import React from 'react';
import { Conversation, MessageUser } from '../../types';
import { DefaultCaregiverIcon } from '../../constants';

interface ConversationListProps {
  conversations: Conversation[];
  currentUser: MessageUser;
  onSelectConversation: (conversation: Conversation) => void;
  selectedConversationId?: string | null;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  currentUser,
  onSelectConversation,
  selectedConversationId,
}) => {
  if (!conversations.length) {
    return <p className="p-4 text-sm text-center text-neutral-500">No conversations yet.</p>;
  }

  return (
    <ul className="divide-y divide-slate-200">
      {conversations.map((convo) => {
        const partner = convo.partner;
        const lastMessageText = convo.lastMessage 
          ? (convo.lastMessage.sender_id === currentUser.id ? 'You: ' : '') + convo.lastMessage.content 
          : 'No messages yet';
        
        const lastMessageDate = convo.lastMessage 
          ? new Date(convo.lastMessage.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
          : '';

        const isActive = selectedConversationId === convo.id;

        return (
          <li key={convo.id}>
            <button
              onClick={() => onSelectConversation(convo)}
              className={`w-full text-left px-3 py-3.5 hover:bg-primary-light/20 focus:outline-none focus:bg-primary-light/30 transition-colors duration-150 ease-in-out flex items-start space-x-3
                ${isActive ? 'bg-primary-light/40' : ''}`}
              aria-current={isActive ? "page" : undefined}
            >
              {partner.avatarUrl ? (
                <img src={partner.avatarUrl} alt={partner.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
              ) : (
                <DefaultCaregiverIcon className="w-10 h-10 rounded-full text-slate-400 bg-slate-200 p-1.5 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-semibold text-neutral-dark truncate" title={partner.name}>
                    {partner.name}
                  </p>
                  {lastMessageDate && <p className="text-xs text-neutral-500">{lastMessageDate}</p>}
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-neutral-500 truncate" title={lastMessageText}>
                    {lastMessageText}
                  </p>
                  {convo.unreadCount > 0 && (
                    <span className="ml-2 px-1.5 py-0.5 text-xs font-semibold text-white bg-red-500 rounded-full">
                      {convo.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default ConversationList;