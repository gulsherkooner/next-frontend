import React from 'react';

export const ChatView = () => {
  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-200 mr-3" />
          <span className="font-medium">User name 1</span>
        </div>
        <div className="flex space-x-4">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/481845ce832f1b51dfeca3a47611c980d388986c?placeholderIfAbsent=true&apiKey=0559def863cd4a48b1cfc8edd9377a19"
            className="w-6 h-6"
            alt="Phone"
          />
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/0e5334c07bab021f9ae3b115fd121fdfbd1b08fd?placeholderIfAbsent=true&apiKey=0559def863cd4a48b1cfc8edd9377a19"
            className="w-6 h-6"
            alt="Video"
          />
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/dd4d8db4136fd0242c081a773ffca60b9041d308?placeholderIfAbsent=true&apiKey=0559def863cd4a48b1cfc8edd9377a19"
            className="w-6 h-6"
            alt="Options"
          />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex items-start mb-4">
          <div className="w-8 h-8 rounded-full bg-gray-200 mr-2" />
          <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
            <span>Message content here</span>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="flex items-center p-4 border-t border-gray-200">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/717347bf782b7090df77dbc00295478fe9d4d53e?placeholderIfAbsent=true&apiKey=0559def863cd4a48b1cfc8edd9377a19"
          className="w-6 h-6 mr-2"
          alt="Add"
        />
        <input
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 mr-2"
          placeholder="Type a message..."
        />
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/65211aa44f57073f10171696b5397c83fe3b2f0b?placeholderIfAbsent=true&apiKey=0559def863cd4a48b1cfc8edd9377a19"
          className="w-6 h-6"
          alt="Mic"
        />
      </div>
    </div>
  );
};
