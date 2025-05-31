import React from 'react';
import { Message, MessageUser } from '../../types';
import LoadingSpinner from '../LoadingSpinner';
import ChatMessage from './ChatMessage';
import { SendIcon, DefaultCaregiverIcon } from '../../constants';

interface ChatWindowProps {
  currentUser: MessageUser;
  partner: MessageUser;
  messages: Message[];
  isLoadingMessages: boolean;
  newMessageContent: string;
  setNewMessageContent: (content: string) => void;
  onSendMessage: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  currentUser,
  partner,
  messages,
  isLoadingMessages,
  newMessageContent,
  setNewMessageContent,
  onSendMessage,
  messagesEndRef,
}) => {
  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-200 bg-white shadow-sm flex items-center space-x-3">
        {partner.avatarUrl ? (
          <img src={partner.avatarUrl} alt={partner.name} className="w-10 h-10 rounded-full object-cover" />
        ) : (
          <DefaultCaregiverIcon className="w-10 h-10 rounded-full text-slate-400 bg-slate-200 p-1.5" />
        )}
        <div>
          <h3 className="text-md font-semibold text-primary-dark">{partner.name}</h3>
          <p className="text-xs text-neutral-500 capitalize">{partner.type}</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-grow overflow-y-auto p-4 space-y-3 bg-slate-50">
        {isLoadingMessages ? (
          <LoadingSpinner text="Loading messages..." />
        ) : messages.length === 0 ? (
          <p className="text-center text-neutral-500 text-sm py-8">No messages yet. Start the conversation!</p>
        ) : (
          messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} currentUser={currentUser} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Area */}
      <div className="p-3 border-t border-slate-200 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSendMessage();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={newMessageContent}
            onChange={(e) => setNewMessageContent(e.target.value)}
            placeholder={`Message ${partner.name}...`}
            className="flex-grow block w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary sm:text-sm transition-colors"
            aria-label="Type your message"
          />
          <button
            type="submit"
            disabled={!newMessageContent.trim()}
            className="p-2.5 bg-accent hover:bg-accent-dark text-white rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;