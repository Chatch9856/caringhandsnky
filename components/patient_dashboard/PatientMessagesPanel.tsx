import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../AuthContext';
import { useToast } from '../ToastContext';
import LoadingSpinner from '../LoadingSpinner';
import { Message, MessageUser, UserType, Conversation, Patient } from '../../types';
import { getUsersForMessaging, getMessages, sendMessage, markMessagesAsRead, getConversations, mapDbMessageToMessageType } from '../../services/messagingService';
import { ADMIN_USER_ID, ADMIN_DISPLAY_NAME, DefaultCaregiverIcon, MessageSquareIcon } from '../../constants';
import { supabase } from '../../supabaseClient';
import ConversationList from '../shared/ConversationList';
import ChatWindow from '../shared/ChatWindow';
import { Database } from '../../types/supabase'; // Import Database type

// Define DbMessage type based on Supabase schema
type DbMessage = Database['public']['Tables']['messages']['Row'];

interface PatientMessagesPanelProps {
  currentUser: Patient; // Assuming Patient type is passed from dashboard
}

const PatientMessagesPanel: React.FC<PatientMessagesPanelProps> = ({ currentUser }) => {
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const patientUser: MessageUser = { id: currentUser.id, name: currentUser.full_name, type: UserType.PATIENT, avatarUrl: null /* TODO: Add avatar to Patient if exists */ };
  
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
      const contacts = await getUsersForMessaging(patientUser);
      setPotentialContacts(contacts);
       const convos = await getConversations(patientUser, [patientUser, ...contacts]);
      setConversations(convos);
    } catch (err: any) {
      setError(`Failed to load messaging data: ${err.message}`);
      addToast(`Error: ${err.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [addToast, patientUser]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const fetchMessagesForConversation = useCallback(async (partner: MessageUser) => {
    if (!supabase) return;
    setIsLoadingMessages(true);
    try {
      const fetchedMessages = await getMessages(patientUser.id, patientUser.type, partner.id, partner.type, [patientUser, ...potentialContacts]);
      setMessages(fetchedMessages);
      await markMessagesAsRead(partner.id, partner.type, patientUser.id, patientUser.type);
      const convos = await getConversations(patientUser, [patientUser, ...potentialContacts]); // Refresh unread counts
      setConversations(convos);
    } catch (err: any) {
      addToast(`Error fetching messages: ${err.message}`, 'error');
    } finally {
      setIsLoadingMessages(false);
    }
  }, [addToast, patientUser, potentialContacts]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessagesForConversation(selectedConversation.partner);
    } else {
      setMessages([]);
    }
  }, [selectedConversation, fetchMessagesForConversation]);
  
  useEffect(() => {
    if (!supabase) return;
    const channel = supabase.channel(`public:messages:patient:${patientUser.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        async (payload) => {
          const newMessageDb = payload.new as DbMessage; 
          const isForCurrentUser = (newMessageDb.sender_id === patientUser.id && newMessageDb.sender_type === patientUser.type) || 
                                   (newMessageDb.recipient_id === patientUser.id && newMessageDb.recipient_type === patientUser.type);

          if (isForCurrentUser) {
            const convos = await getConversations(patientUser, [patientUser, ...potentialContacts]);
            setConversations(convos);

            if (selectedConversation) {
              const partner = selectedConversation.partner;
              const isForCurrentChat = 
                (newMessageDb.sender_id === partner.id && newMessageDb.sender_type === partner.type && newMessageDb.recipient_id === patientUser.id && newMessageDb.recipient_type === patientUser.type) ||
                (newMessageDb.sender_id === patientUser.id && newMessageDb.sender_type === patientUser.type && newMessageDb.recipient_id === partner.id && newMessageDb.recipient_type === partner.type);
              
              if (isForCurrentChat) {
                setMessages(prev => [...prev, mapDbMessageToMessageType(newMessageDb, patientUser.id, [patientUser, ...potentialContacts])]);
                if (newMessageDb.recipient_id === patientUser.id && newMessageDb.recipient_type === patientUser.type) {
                  await markMessagesAsRead(newMessageDb.sender_id, newMessageDb.sender_type as UserType, patientUser.id, patientUser.type);
                }
              }
            }
          }
        }
      )
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') console.log('Patient subscribed to messages channel');
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            console.error('Patient messages channel error/timeout:', err);
            addToast("Realtime messaging connection issue.", "error");
        }
    });
    return () => { supabase.removeChannel(channel); };
  }, [supabase, selectedConversation, patientUser, potentialContacts, addToast]);


  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  const handleSendMessage = async () => {
    if (!selectedConversation?.partner || !newMessageContent.trim() || !supabase) return;
    
    const partner = selectedConversation.partner;
    try {
      const sentMessage = await sendMessage(
        patientUser.id, patientUser.type, 
        partner.id, partner.type, 
        newMessageContent.trim(),
        [patientUser, ...potentialContacts]
      );
      setMessages(prev => [...prev, sentMessage]);
      setNewMessageContent('');
      const convos = await getConversations(patientUser, [patientUser, ...potentialContacts]);
      setConversations(convos);
      const updatedSelectedConvo = convos.find(c => c.partner.id === partner.id && c.partner.type === partner.type);
      if(updatedSelectedConvo) setSelectedConversation(updatedSelectedConvo);
    } catch (err: any) {
      addToast(`Failed to send message: ${err.message}`, 'error');
    }
  };
  

  if (isLoading && !error) {
    return <div className="p-6 rounded-xl bg-white mt-0 flex justify-center items-center min-h-[300px]"><LoadingSpinner text="Loading your messages..." /></div>;
  }
  if (error) {
    return <div className="p-6 rounded-xl bg-white mt-0 text-red-600 text-center">{error}</div>;
  }

  return (
    <div className="h-[calc(100vh-300px)] flex flex-col md:flex-row border border-slate-200 rounded-lg overflow-hidden">
      <div className="w-full md:w-1/3 border-r border-slate-200 flex flex-col bg-white">
        <div className="p-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-primary-dark flex items-center">
            <MessageSquareIcon className="w-6 h-6 mr-2"/>Your Conversations
          </h3>
        </div>
        <div className="flex-grow overflow-y-auto">
            <ConversationList 
                conversations={conversations}
                currentUser={patientUser}
                onSelectConversation={handleSelectConversation}
                selectedConversationId={selectedConversation?.id}
            />
            {conversations.length === 0 && (
                <p className="p-4 text-sm text-neutral-500 text-center">You have no active conversations. Admin or assigned caregivers will appear here.</p>
            )}
        </div>
      </div>
      <div className="w-full md:w-2/3 flex flex-col bg-slate-50">
        {selectedConversation ? (
          <ChatWindow
            currentUser={patientUser}
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
            <p className="text-lg">Select a conversation to view messages.</p>
            <p className="text-sm">Your chats with admin or caregivers will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientMessagesPanel;