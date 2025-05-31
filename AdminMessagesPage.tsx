import React, { useState, useEffect, useCallback, useRef } from 'react';
import AdminLayout from './AdminLayout'; // Corrected path
import { useToast } from './components/ToastContext';
import LoadingSpinner from './components/LoadingSpinner';
import { Message, MessageUser, UserType, Conversation } from './types';
import { getUsersForMessaging, getMessages, sendMessage, markMessagesAsRead, getConversations, mapDbMessageToMessageType } from './services/messagingService';
import { ADMIN_USER_ID, ADMIN_DISPLAY_NAME, DefaultCaregiverIcon, SendIcon, MessageSquareIcon as PageIcon } from './constants'; // Renamed MessageSquareIcon to PageIcon to avoid conflict if used locally
import { supabase } from './supabaseClient';
import ConversationList from './components/shared/ConversationList';
import ChatWindow from './components/shared/ChatWindow';
import { Database } from './types/supabase';

type DbMessage = Database['public']['Tables']['messages']['Row'];

export default function AdminMessagesPage() {
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
      const convos = await getConversations(adminUser, [adminUser, ...contacts]);
      setConversations(convos);
    } catch (err: any) {
      setError(`Failed to load messaging data: ${err.message}`);
      addToast(`Error: ${err.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [addToast, adminUser]);

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
      const convos = await getConversations(adminUser, [adminUser, ...potentialContacts]);
      setConversations(convos);
    } catch (err: any) {
      addToast(`Error fetching messages: ${err.message}`, 'error');
    } finally {
      setIsLoadingMessages(false);
    }
  }, [addToast, adminUser, potentialContacts]);


  useEffect(() => {
    if (selectedConversation) {
      fetchMessagesForConversation(selectedConversation.partner);
    } else {
      setMessages([]);
    }
  }, [selectedConversation, fetchMessagesForConversation]);
  
  useEffect(() => {
    if (!supabase) return;

    const channel = supabase.channel('public:messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        async (payload) => {
          const newMessageDb = payload.new as DbMessage; 
          const isAdminSender = newMessageDb.sender_id === adminUser.id && newMessageDb.sender_type === adminUser.type;
          const isAdminRecipient = newMessageDb.recipient_id === adminUser.id && newMessageDb.recipient_type === adminUser.type;

          if (isAdminSender || isAdminRecipient) {
             const convos = await getConversations(adminUser, [adminUser, ...potentialContacts]);
             setConversations(convos);

            if (selectedConversation) {
              const partner = selectedConversation.partner;
              const isForCurrentConversation = 
                (newMessageDb.sender_id === partner.id && newMessageDb.sender_type === partner.type && newMessageDb.recipient_id === adminUser.id && newMessageDb.recipient_type === adminUser.type) ||
                (newMessageDb.sender_id === adminUser.id && newMessageDb.sender_type === adminUser.type && newMessageDb.recipient_id === partner.id && newMessageDb.recipient_type === partner.type);

              if (isForCurrentConversation) {
                setMessages(prev => [...prev, mapDbMessageToMessageType(newMessageDb, adminUser.id, [adminUser,...potentialContacts])]);
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
          console.log('Admin subscribed to messages channel');
        }
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            console.error('Admin messages channel error/timeout:', err);
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
    const existingConvo = conversations.find(c => c.partner.id === contact.id && c.partner.type === contact.type);
    if (existingConvo) {
        setSelectedConversation(existingConvo);
    } else {
        const newConvo: Conversation = {
            id: `${adminUser.id}_${contact.id}_${contact.type}`, // More specific temp ID
            partner: contact,
            lastMessage: null,
            unreadCount: 0,
            updated_at: new Date().toISOString()
        };
        setSelectedConversation(newConvo);
        setMessages([]);
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
      const convos = await getConversations(adminUser, [adminUser, ...potentialContacts]);
      setConversations(convos);
      const updatedSelectedConvo = convos.find(c => c.partner.id === partner.id && c.partner.type === partner.type);
      if(updatedSelectedConvo) setSelectedConversation(updatedSelectedConvo);
    } catch (err: any) {
      addToast(`Failed to send message: ${err.message}`, 'error');
    }
  };

  if (isLoading && !error) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-full">
          <LoadingSpinner text="Loading messaging system..." />
        </div>
      </AdminLayout>
    );
  }
  
  if (error) {
    return (
      <AdminLayout>
        <div className="p-6 text-red-600 text-center">{error}</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 h-full flex flex-col">
        <h1 className="text-2xl font-bold text-slate-800 px-0 pt-0 pb-2 border-b border-slate-200">Messages</h1>
        <div className="flex-grow bg-white rounded-xl shadow-sm flex flex-col md:flex-row min-h-[calc(100vh-280px)] overflow-hidden"> {/* Adjust min-h as needed */}
          {/* Left Panel: Conversation List / User List */}
          <div className="w-full md:w-1/3 border-r border-slate-200 flex flex-col">
            <div className="p-4 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-primary-dark flex items-center">
                    <PageIcon className="w-5 h-5 mr-2"/>Contacts & Chats
                </h3>
            </div>
            <div className="flex-grow overflow-y-auto">
                <ConversationList 
                    conversations={conversations}
                    currentUser={adminUser}
                    onSelectConversation={handleSelectConversation}
                    selectedConversationId={selectedConversation?.id}
                />
                <div className="p-2 border-t border-slate-200">
                    <h4 className="text-sm font-semibold text-neutral-600 px-2 mb-1">Start New Chat:</h4>
                    {potentialContacts.length > 0 ? potentialContacts.filter(contact => 
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
                    )) : <p className="text-xs text-neutral-400 p-2">No new contacts available.</p>}
                     {potentialContacts.filter(contact => 
                        !conversations.some(c => c.partner.id === contact.id && c.partner.type === contact.type)
                     ).length === 0 && conversations.length > 0 && potentialContacts.length > 0 && (
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
                <PageIcon className="w-20 h-20 text-slate-300 mb-4"/>
                <p className="text-md">Select a conversation or start a new one.</p>
                <p className="text-sm">Choose a patient or caregiver from the list to begin messaging.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
