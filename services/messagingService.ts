import { supabase } from '../supabaseClient';
import { Database } from '../types/supabase';
import { Message, MessageUser, UserType, Conversation, Caregiver, Patient } from '../types';
import { ADMIN_USER_ID, ADMIN_DISPLAY_NAME } from '../constants';

type DbMessage = Database['public']['Tables']['messages']['Row'];
type DbMessageInsert = Database['public']['Tables']['messages']['Insert'];

const RETHROW_UNINITIALIZED_ERROR_MSG = "Supabase client is not initialized. Ensure SUPABASE_URL and SUPABASE_ANON_KEY are set.";

// Helper to map DB row to Message type, including sender/recipient details
export const mapDbMessageToMessageType = (dbMsg: DbMessage, currentUserId: string, allUsers: MessageUser[]): Message => {
  const sender = allUsers.find(u => u.id === dbMsg.sender_id && u.type === dbMsg.sender_type as UserType);
  const recipient = allUsers.find(u => u.id === dbMsg.recipient_id && u.type === dbMsg.recipient_type as UserType);
  
  return {
    id: dbMsg.id,
    sender_id: dbMsg.sender_id,
    recipient_id: dbMsg.recipient_id,
    sender_type: dbMsg.sender_type as UserType,
    recipient_type: dbMsg.recipient_type as UserType,
    content: dbMsg.content,
    created_at: dbMsg.created_at,
    read_at: dbMsg.read_at,
    sender: sender || { id: dbMsg.sender_id, name: 'Unknown Sender', type: dbMsg.sender_type as UserType },
    recipient: recipient || { id: dbMsg.recipient_id, name: 'Unknown Recipient', type: dbMsg.recipient_type as UserType },
  };
};

// Fetches potential users the current user can message
export const getUsersForMessaging = async (currentUser: MessageUser): Promise<MessageUser[]> => {
  if (!supabase) {
    console.warn("getUsersForMessaging: Supabase client not initialized.");
    return [];
  }
  
  const users: MessageUser[] = [];

  if (currentUser.type === UserType.ADMIN) {
    // Admin can message all patients and caregivers
    const { data: patients, error: patientError } = await supabase.from('patients').select('id, full_name, profile_image_url');
    if (patientError) console.error("Error fetching patients for admin messaging:", patientError);
    else patients?.forEach(p => users.push({ id: p.id, name: p.full_name, type: UserType.PATIENT, avatarUrl: null }));

    const { data: caregivers, error: caregiverError } = await supabase.from('caregivers').select('id, full_name, profile_image_url');
    if (caregiverError) console.error("Error fetching caregivers for admin messaging:", caregiverError);
    else caregivers?.forEach(c => users.push({ id: c.id, name: c.full_name, type: UserType.CAREGIVER, avatarUrl: c.profile_image_url }));
  
  } else if (currentUser.type === UserType.PATIENT) {
    // Patient can message Admin
    users.push({ id: ADMIN_USER_ID, name: ADMIN_DISPLAY_NAME, type: UserType.ADMIN, avatarUrl: null });
    // TODO: Add assigned caregivers once that link is established (e.g., from bookings or cases)
  
  } else if (currentUser.type === UserType.CAREGIVER) {
    // Caregiver can message Admin
    users.push({ id: ADMIN_USER_ID, name: ADMIN_DISPLAY_NAME, type: UserType.ADMIN, avatarUrl: null });
    // TODO: Add assigned patients once that link is established
  }
  
  return users.sort((a,b) => a.name.localeCompare(b.name));
};


export const getMessages = async (
  userId1: string, userType1: UserType, 
  userId2: string, userType2: UserType, 
  allPotentialUsers: MessageUser[], // Used to populate sender/recipient details
  limit: number = 50, 
  offset: number = 0
): Promise<Message[]> => {
  if (!supabase) {
    console.warn("getMessages: Supabase client not initialized.");
    return [];
  }

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(
      `and(sender_id.eq.${userId1}, sender_type.eq.${userType1}, recipient_id.eq.${userId2}, recipient_type.eq.${userType2}),` +
      `and(sender_id.eq.${userId2}, sender_type.eq.${userType2}, recipient_id.eq.${userId1}, recipient_type.eq.${userType1})`
    )
    .order('created_at', { ascending: false })
    .range(offset, offset + limit -1);

  if (error) {
    console.error('Error fetching messages:', error);
    throw new Error(`Failed to fetch messages: ${error.message}`);
  }
  
  return data ? data.map(dbMsg => mapDbMessageToMessageType(dbMsg, userId1, allPotentialUsers)).reverse() : [];
};


export const sendMessage = async (
  senderId: string, senderType: UserType,
  recipientId: string, recipientType: UserType,
  content: string,
  allPotentialUsers: MessageUser[] // Used to populate sender/recipient details for return
): Promise<Message> => {
  if (!supabase) {
    console.error("sendMessage: Supabase client not initialized.");
    throw new Error(RETHROW_UNINITIALIZED_ERROR_MSG);
  }

  const messageToInsert: DbMessageInsert = {
    sender_id: senderId,
    sender_type: senderType,
    recipient_id: recipientId,
    recipient_type: recipientType,
    content: content,
  };

  const { data, error } = await supabase
    .from('messages')
    .insert(messageToInsert)
    .select('*')
    .single();

  if (error || !data) {
    console.error('Error sending message:', error);
    throw new Error(`Failed to send message: ${error?.message || 'No data returned'}`);
  }
  
  return mapDbMessageToMessageType(data, senderId, allPotentialUsers);
};

export const markMessagesAsRead = async (
  conversationPartnerId: string, 
  conversationPartnerType: UserType,
  currentUserId: string,
  currentUserType: UserType
): Promise<void> => {
  if (!supabase) {
    console.warn("markMessagesAsRead: Supabase client not initialized.");
    return;
  }
  // Mark messages as read where current user is recipient and partner is sender
  const { error } = await supabase
    .from('messages')
    .update({ read_at: new Date().toISOString() })
    .eq('recipient_id', currentUserId)
    .eq('recipient_type', currentUserType)
    .eq('sender_id', conversationPartnerId)
    .eq('sender_type', conversationPartnerType)
    .is('read_at', null); // Only update unread messages

  if (error) {
    console.error('Error marking messages as read:', error);
    // Don't throw, as it's not critical for chat flow but should be logged
  }
};


// Derives conversations from existing messages
// This is less efficient than a dedicated 'conversations' table for many messages
// but simpler for an initial implementation.
export const getConversations = async (currentUser: MessageUser, allUsers: MessageUser[]): Promise<Conversation[]> => {
    if (!supabase) {
        console.warn("getConversations: Supabase client not initialized.");
        return [];
    }

    // Fetch all messages involving the current user
    const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${currentUser.id},recipient_id.eq.${currentUser.id}`) // Basic filter, refine with type if needed
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching messages for conversations:", error);
        return [];
    }
    if (!messages) return [];
    
    const mappedMessages = messages.map(dbMsg => mapDbMessageToMessageType(dbMsg, currentUser.id, allUsers));

    const conversationMap = new Map<string, Conversation>();

    for (const msg of mappedMessages) {
        let partnerId: string;
        let partnerType: UserType;
        let partnerName: string;
        let partnerAvatar: string | null | undefined;

        if (msg.sender_id === currentUser.id && msg.sender_type === currentUser.type) {
            partnerId = msg.recipient_id;
            partnerType = msg.recipient_type;
            partnerName = msg.recipient?.name || 'Unknown Recipient';
            partnerAvatar = msg.recipient?.avatarUrl;
        } else if (msg.recipient_id === currentUser.id && msg.recipient_type === currentUser.type) {
            partnerId = msg.sender_id;
            partnerType = msg.sender_type;
            partnerName = msg.sender?.name || 'Unknown Sender';
            partnerAvatar = msg.sender?.avatarUrl;
        } else {
            continue; // Message not directly involving current user in a way that defines a partner
        }
        
        const conversationKey = [currentUser.id, partnerId].sort().join('_'); // Simple key

        if (!conversationMap.has(conversationKey)) {
            conversationMap.set(conversationKey, {
                id: conversationKey,
                partner: { id: partnerId, name: partnerName, type: partnerType, avatarUrl: partnerAvatar },
                lastMessage: null,
                unreadCount: 0,
                updated_at: '1970-01-01T00:00:00Z', // Initialize old
            });
        }

        const conversation = conversationMap.get(conversationKey)!;

        // Update last message and unread count
        if (new Date(msg.created_at) > new Date(conversation.updated_at)) {
            conversation.lastMessage = msg;
            conversation.updated_at = msg.created_at;
        }
        if (msg.recipient_id === currentUser.id && msg.recipient_type === currentUser.type && !msg.read_at) {
            conversation.unreadCount++;
        }
    }
    
    return Array.from(conversationMap.values()).sort((a, b) => 
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
};