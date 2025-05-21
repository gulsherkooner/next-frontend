import React from 'react';

export const MessageItem = ({ username, time }) => {
  return (
    <div className="flex items-center p-4 border-b border-gray-100">
      <div className="w-12 h-12 rounded-full bg-gray-200 mr-3" />
      <div className="flex-1">
        <div className="font-medium text-gray-900">{username}</div>
        <div className="text-sm text-gray-500">{time}</div>
      </div>
    </div>
  );
};
