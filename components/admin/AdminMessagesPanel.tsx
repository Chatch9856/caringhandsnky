import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '../ToastContext';
import LoadingSpinner from '../LoadingSpinner';
import { Message, MessageUser, UserType, Conversation } from '../../types';
import { getUsersForMessaging, getMessages, sendMessage, markMessagesAsRead, getConversations, mapDbMessageToMessageType } from '../../services/messagingService';
import { ADMIN_USER_ID, ADMIN_DISPLAY_NAME, DefaultCaregiverIcon, SendIcon, MessageSquareIcon } from '../../constants';
import { supabase } from '../../supabaseClient';
import ConversationList from '../shared/ConversationList';
import ChatWindow from '../shared/ChatWindow';
import { Database } from '../../types/supabase'; // Import Database type

// Define DbMessage type based on Supabase schema
type DbMessage = Database['public']['Tables']['messages']['Row'];

const AdminMessagesPanel: React.FC = () => {
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const adminUser: MessageUser = { id: ADMIN_USER_ID, name: ADMIN_DISPLAY_NAME, type: UserType.ADMIN };
  
  const [potentialContacts, setPotentialContacts] = useState<MessageUser[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [newMessageContent, setNewMessageContent] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const loadInitialData = useCallback(async () => {
    if (!supabase) {
        setError("Messaging system is currently unavailable. Database connection is not configured.");
        addToast("Messaging system unavailable.", "error");
        setIsLoading(false);
        return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const contacts = await getUsersForMessaging(adminUser);
      setPotentialContacts(contacts);
      const convos = await getConversations(adminUser, [adminUser, ...contacts]); // Pass all users for mapping
      setConversations(convos);
    } catch (err: any) {
      setError(`Failed to load messaging data: ${err.message}`);
      addToast(`Error: ${err.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const fetchMessagesForConversation = useCallback(async (partner: MessageUser) => {
    if (!supabase) return;
    setIsLoadingMessages(true);
    try {
      const fetchedMessages = await getMessages(adminUser.id, adminUser.type, partner.id, partner.type, [adminUser, ...potentialContacts]);
      setMessages(fetchedMessages);
      await markMessagesAsRead(partner.id, partner.type, adminUser.id, adminUser.type);
      // Refresh conversations to update unread counts
      const convos = await getConversations(adminUser, [adminUser, ...potentialContacts]);
      setConversations(convos);

    } catch (err: any) {
      addToast(`Error fetching messages: ${err.message}`, 'error');
    } finally {
      setIsLoadingMessages(false);
    }
  }, [addToast, potentialContacts, adminUser]);


  useEffect(() => {
    if (selectedConversation) {
      fetchMessagesForConversation(selectedConversation.partner);
    } else {
      setMessages([]); // Clear messages if no conversation is selected
    }
  }, [selectedConversation, fetchMessagesForConversation]);
  
  // Realtime subscription for new messages
  useEffect(() => {
    if (!supabase) return;

    const channel = supabase.channel('public:messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        async (payload) => {
          const newMessageDb = payload.new as DbMessage; 
          // Check if the message involves the current admin user
          const isAdminSender = newMessageDb.sender_id === adminUser.id && newMessageDb.sender_type === adminUser.type;
          const isAdminRecipient = newMessageDb.recipient_id === adminUser.id && newMessageDb.recipient_type === adminUser.type;

          if (isAdminSender || isAdminRecipient) {
            // Refresh conversations list (for unread counts and last message)
             const convos = await getConversations(adminUser, [adminUser, ...potentialContacts]);
             setConversations(convos);

            // If this message belongs to the currently open conversation, add it
            if (selectedConversation) {
              const partner = selectedConversation.partner;
              const isForCurrentConversation = 
                (newMessageDb.sender_id === partner.id && newMessageDb.sender_type === partner.type && newMessageDb.recipient_id === adminUser.id && newMessageDb.recipient_type === adminUser.type) ||
                (newMessageDb.sender_id === adminUser.id && newMessageDb.sender_type === adminUser.type && newMessageDb.recipient_id === partner.id && newMessageDb.recipient_type === partner.type);

              if (isForCurrentConversation) {
                setMessages(prev => [...prev, mapDbMessageToMessageType(newMessageDb, adminUser.id, [adminUser,...potentialContacts])]);
                // If admin is recipient and viewing, mark as read
                if (isAdminRecipient) {
                   await markMessagesAsRead(newMessageDb.sender_id, newMessageDb.sender_type as UserType, adminUser.id, adminUser.type);
                }
              }
            }
          }
        }
      )
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          console.log('Subscribed to messages channel');
        }
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            console.error('Messages channel error/timeout:', err);
            addToast("Realtime messaging connection issue.", "error");
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, selectedConversation, adminUser, potentialContacts, addToast]);


  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };
  
  const handleStartNewConversation = (contact: MessageUser) => {
    // Check if a conversation with this contact already exists
    const existingConvo = conversations.find(c => c.partner.id === contact.id && c.partner.type === contact.type);
    if (existingConvo) {
        setSelectedConversation(existingConvo);
    } else {
        // Create a temporary conversation object to select; it will be solidified once a message is sent.
        const newConvo: Conversation = {
            id: `${adminUser.id}_${contact.id}`, // temp ID
            partner: contact,
            lastMessage: null,
            unreadCount: 0,
            updated_at: new Date().toISOString()
        };
        setSelectedConversation(newConvo);
        setMessages([]); // Start with empty messages
    }
  };


  const handleSendMessage = async () => {
    if (!selectedConversation?.partner || !newMessageContent.trim() || !supabase) return;
    
    const partner = selectedConversation.partner;
    try {
      const sentMessage = await sendMessage(
        adminUser.id, adminUser.type, 
        partner.id, partner.type, 
        newMessageContent.trim(),
        [adminUser, ...potentialContacts]
      );
      setMessages(prev => [...prev, sentMessage]);
      setNewMessageContent('');
      // Refresh conversations after sending a message
      const convos = await getConversations(adminUser, [adminUser, ...potentialContacts]);
      setConversations(convos);
      // Ensure the current conversation remains selected or is updated
      const updatedSelectedConvo = convos.find(c => c.partner.id === partner.id && c.partner.type === partner.type);
      if(updatedSelectedConvo) setSelectedConversation(updatedSelectedConvo);

    } catch (err: any) {
      addToast(`Failed to send message: ${err.message}`, 'error');
    }
  };

  if (isLoading && !error) {
    return <div className="p-6 rounded-xl shadow-sm bg-white mt-0 flex justify-center items-center min-h-[300px]"><LoadingSpinner text="Loading messages..." /></div>;
  }
  if (error) {
    return <div className="p-6 rounded-xl shadow-sm bg-white mt-0 text-red-600 text-center">{error}</div>;
  }

  return (
    <div className="bg-white p-0 rounded-xl shadow-sm mt-0 h-[calc(100vh-250px)] flex flex-col md:flex-row"> {/* Panel styling */}
      {/* Left Panel: Conversation List / User List */}
      <div className="w-full md:w-1/3 border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-primary-dark flex items-center">
                <MessageSquareIcon className="w-6 h-6 mr-2"/>Conversations
            </h3>
            {/* TODO: Add search for conversations/users */}
        </div>
        <div className="flex-grow overflow-y-auto">
            <ConversationList 
                conversations={conversations}
                currentUser={adminUser}
                onSelectConversation={handleSelectConversation}
                selectedConversationId={selectedConversation?.id}
            />
            {/* Section to start new conversations */}
            <div className="p-2 border-t border-slate-200">
                <h4 className="text-sm font-semibold text-neutral-600 px-2 mb-1">Start New Chat:</h4>
                 {potentialContacts.filter(contact => 
                    !conversations.some(c => c.partner.id === contact.id && c.partner.type === contact.type)
                 ).map(contact => (
                    <button 
                        key={`${contact.id}-${contact.type}`}
                        onClick={() => handleStartNewConversation(contact)}
                        className="w-full text-left px-3 py-2.5 rounded-md hover:bg-primary-light/30 transition-colors duration-150 flex items-center space-x-3"
                    >
                        {contact.avatarUrl ? 
                            <img src={contact.avatarUrl} alt={contact.name} className="w-8 h-8 rounded-full object-cover" /> :
                            <DefaultCaregiverIcon className="w-8 h-8 rounded-full text-slate-400 bg-slate-200 p-1" />
                        }
                        <div>
                            <p className="text-sm font-medium text-neutral-dark">{contact.name}</p>
                            <p className="text-xs text-neutral-500 capitalize">{contact.type}</p>
                        </div>
                    </button>
                ))}
                 {potentialContacts.filter(contact => 
                    !conversations.some(c => c.partner.id === contact.id && c.partner.type === contact.type)
                 ).length === 0 && conversations.length > 0 && (
                    <p className="text-xs text-neutral-500 px-2 py-2">All potential contacts have existing conversations.</p>
                 )}
            </div>
        </div>
      </div>

      {/* Right Panel: Chat Window */}
      <div className="w-full md:w-2/3 flex flex-col bg-slate-50">
        {selectedConversation ? (
          <ChatWindow
            currentUser={adminUser}
            partner={selectedConversation.partner}
            messages={messages}
            isLoadingMessages={isLoadingMessages}
            newMessageContent={newMessageContent}
            setNewMessageContent={setNewMessageContent}
            onSendMessage={handleSendMessage}
            messagesEndRef={messagesEndRef}
          />
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-neutral-500 p-8">
            <MessageSquareIcon className="w-24 h-24 text-slate-300 mb-4"/>
            <p className="text-lg">Select a conversation or start a new one.</p>
            <p className="text-sm">Choose a patient or caregiver from the list to begin messaging.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMessagesPanel;