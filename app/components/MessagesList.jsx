import React from 'react';
import { MessageItem } from './MessageItem';

export const MessagesList = () => {
  const messages = [
    { username: 'User name 1', time: '10h' },
    { username: 'User name 2', time: '12h' },
    { username: 'User name 3', time: '8h' },
    { username: 'User name 4', time: '15h' },
    { username: 'User name 5', time: '7h' },
    { username: 'User name 6', time: '14h' },
  ];

  return (
    <div className="w-80 bg-white border-r border-gray-200 h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold">Messages</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {messages.map((message, index) => (
          <MessageItem
            key={index}
            username={message.username}
            time={message.time}
          />
        ))}
      </div>
    </div>
  );
};
