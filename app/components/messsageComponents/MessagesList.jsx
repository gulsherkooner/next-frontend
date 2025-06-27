import React, { useState,useEffect } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import calendar from 'dayjs/plugin/calendar';

dayjs.extend(relativeTime);
dayjs.extend(calendar);

function formatLastSeen(timestamp) {
  return dayjs(timestamp).calendar(null, {
    sameDay: 'h:mm A',      // today
    lastDay: '[Yesterday]',
    lastWeek: 'ddd',        // Mon, Tue...
    sameElse: 'DD MMM YYYY' // older
  });
}

const girlProfilePics = [
  "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
];
function isImageMessage(text) {
  return text?.startsWith('http') && text.includes('/uploads/');
}

const MessagesList = ({ contacts, currentChat, setCurrentChat, typingUsers }) => {
  console.log(contacts);

  const [fallbackImages, setFallbackImages] = useState({});
  const handleError = (contactId) => {
    const randomFallback =
      girlProfilePics[Math.floor(Math.random() * girlProfilePics.length)];
    setFallbackImages((prev) => ({ ...prev, [contactId]: randomFallback }));
  };
  const [isDesktop, setIsDesktop] = useState(true);
  useEffect(() => {
    const checkScreenSize = () => {
      const isNowDesktop = window.innerWidth >= 1024;
      setIsDesktop(isNowDesktop);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  return (
    <div className="h-[100vh] overflow-y-auto pb-50 md:pb-0">
      {contacts.map((contact) => (
        <div
          key={contact.user_id}
          className={`p-4 border-b border-gray-200 flex items-center cursor-pointer hover:bg-gray-50 ${currentChat?.user_id === contact.user_id ? 'bg-blue-50' : ''
            }`}
          onClick={() => setCurrentChat(contact)}
        >
          <div className="relative">
            <img
              src={fallbackImages[contact.user_id] || contact.profile_img_url?.[0]}
              alt={contact.name}
              className="w-12 h-12 rounded-full"
              onError={() => handleError(contact.user_id)}
            />
            {contact.isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          <div className="ml-3 flex-1">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-800">{contact.firstName}</h3>
              <span className="text-xs text-gray-500">
                {formatLastSeen(contact.lastMessageTime)}
              </span>
            </div>
            <p className="text-sm text-gray-600 truncate">
              {typingUsers.includes(contact.user_id) ? (
                <span className="italic text-blue-500 animate-pulse">typing...</span>
              ) : (
                contact.lastMessage?.startsWith('http') && contact.lastMessage.includes('/uploads/')
                  ? 'Photo'
                  : contact.lastMessage
              )}
            </p>
          </div>
          {contact.unreadCount > 0 && (
            <div className="ml-2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {contact.unreadCount}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MessagesList;
