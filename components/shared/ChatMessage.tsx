import React from 'react';
import { Message, MessageUser } from '../../types';
import { DefaultCaregiverIcon } from '../../constants';

interface ChatMessageProps {
  message: Message;
  currentUser: MessageUser;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, currentUser }) => {
  const isCurrentUserSender = message.sender_id === currentUser.id && message.sender_type === currentUser.type;
  const senderDisplay = message.sender || { name: "Unknown", avatarUrl: null };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <div className={`flex items-end space-x-2 ${isCurrentUserSender ? 'justify-end' : 'justify-start'}`}>
      {!isCurrentUserSender && (
        <div className="flex-shrink-0">
          {senderDisplay.avatarUrl ? (
            <img src={senderDisplay.avatarUrl} alt={senderDisplay.name} className="w-7 h-7 rounded-full object-cover" />
          ) : (
            <DefaultCaregiverIcon className="w-7 h-7 rounded-full text-slate-400 bg-slate-200 p-0.5" />
          )}
        </div>
      )}
      <div 
        className={`max-w-[70%] p-2.5 rounded-xl shadow-sm ${
          isCurrentUserSender 
            ? 'bg-primary text-white rounded-br-none' 
            : 'bg-white text-neutral-dark border border-slate-200 rounded-bl-none'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
        <p className={`text-xs mt-1 ${isCurrentUserSender ? 'text-primary-light/80 text-right' : 'text-neutral-400 text-left'}`}>
          {formatDate(message.created_at)}
          {isCurrentUserSender && message.read_at && (
            <span className="ml-1" title={`Read at ${new Date(message.read_at).toLocaleTimeString()}`}>✓✓</span>
          )}
        </p>
      </div>
       {isCurrentUserSender && ( // Avatar for current user on the right
        <div className="flex-shrink-0">
          {currentUser.avatarUrl ? (
            <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-7 h-7 rounded-full object-cover" />
          ) : (
            <DefaultCaregiverIcon className="w-7 h-7 rounded-full text-slate-400 bg-primary-light/30 p-0.5" />
          )}
        </div>
      )}
    </div>
  );
};

export default ChatMessage;