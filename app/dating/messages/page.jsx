'use client';
import React, { useState, useEffect } from 'react';
import MessagesList from '../../components/messsageComponents/MessagesList';
import dynamic from 'next/dynamic';
import { useisDesktop } from '../../hooks/use-mobile';
const ChatView = dynamic(() => import('../../components/messsageComponents/ChatView'), {
  ssr: false,
});

import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import MobileNav from '../../components/MobileNav';
import useSocket from '../../hooks/useSocket';
import { getCookie } from '../../lib/utils/cookie';

export default function MessagesPage() {
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [user, setUser] = useState([]);
  const userId = typeof window !== "undefined" && localStorage.getItem("userId");
  const token = typeof window !== "undefined" && localStorage.getItem("token");
  const socket = useSocket();
  const [contacts, setContacts] = useState([]);
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

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        // Step 1: Fetch user profile
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/date/dating-profile/${userId}`);
        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = await res.json();
        setUser(data);

        // Step 2: Fetch all profiles
        const people = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/date/unlocked-contacts/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        if (!people.ok) throw new Error('Failed to fetch contacts');
        const contactdata = await people.json();

        // Step 3: Fetch unread counts
        const countsRes = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/messages/unread-counts/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const counts = await countsRes.json();
        const countMap = counts.reduce((map, c) => {
          map[c.sender] = parseInt(c.count, 10);
          return map;
        }, {});

        // Step 4: Fetch last messages
        const lastMessagesRes = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/messages/last-messages/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const lastMessages = await lastMessagesRes.json();

        // ✅ Step 5: Merge everything
        const finalContacts = contactdata.map(contact => {
          const last = lastMessages.find(m => m.contactId === contact.user_id);
          return {
            ...contact,
            unreadCount: countMap[contact.user_id] || 0,
            lastMessage: last?.lastMessage || '',
            lastMessageTime: last?.timestamp || ''
          };
        });

        // ✅ Final setContacts
        console.log("✅ Final merged contacts:", finalContacts);
        setContacts(finalContacts);
      } catch (err) {
        console.error('❌ Error in fetchProfile:', err);
      }
    };

    fetchProfile();
  }, [userId]);


  useEffect(() => {
    if (!socket || !user) return;

    // Join user's room
    socket.emit('join', { userId: user.user_id });

    // Listen for new messages
    socket.on('message', (message) => {
      if (currentChat && message.sender === currentChat.user_id) {
        // Message for open chat → just append to messages
        setMessages(prev => [...prev, message]);
      } else {
        // Message for a different chat → increment unread count
        setContacts(prev =>
          prev.map(contact =>
            contact.user_id === message.sender
              ? {
                ...contact,
                unreadCount: (contact.unreadCount || 0) + 1,
                lastMessage: message.text,
                lastMessageTime: message.timestamp,
                lastMessageStatus: message.status
              }
              : contact
          )
        );
      }
    });


    // Listen for typing events
    socket.on('typing', ({ userId, isTyping }) => {
      setTypingUsers((prev) => {
        if (isTyping) {
          return [...new Set([...prev, userId])];
        } else {
          return prev.filter((id) => id !== userId);
        }
      });
    });



    // Listen for online users updates
    socket.on('onlineUsers', (users) => {
      setOnlineUsers(users);
      // Update contacts online status
      setContacts(prev =>
        prev.map(contact => ({
          ...contact,
          isOnline: users.includes(contact.user_id)
        }))
      );
    });

    return () => {
      socket.off('message');
      socket.off('typing');
      socket.off('onlineUsers');
    };
  }, [socket, user, currentChat]);

  const handleSendMessage = (text) => {
    if (!currentChat || !user) return;

    const newMessage = {
      text,
      sender: user.user_id,
      receiver: currentChat.user_id,
      timestamp: new Date().toISOString(),
      status: 'sent'
    };

    // Emit message via socket
    socket.emit('message', newMessage);

    // Optimistically update UI
    setMessages(prev => [...prev, newMessage]);

    // Update last message in contacts
    setContacts(prev =>
      prev.map(contact =>
        contact.user_id === currentChat.user_id
          ? { ...contact, lastMessage: text, lastMessageTime: 'Just now' }
          : contact
      )
    );
  };

  const handleStartTyping = () => {
    if (!currentChat || !user) return;
    socket.emit('typing', {
      userId: user.user_id,
      receiverId: currentChat.user_id,
      isTyping: true
    });
  };

  const handleStopTyping = () => {
    if (!currentChat || !user) return;
    socket.emit('typing', {
      userId: user.user_id,
      receiverId: currentChat.user_id,
      isTyping: false
    });
  };
  useEffect(() => {
    if (currentChat) {
      const fetchConversation = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/messages/conversation/${currentChat.user_id}/${userId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
          });
          const data = await response.json();
          setMessages(Array.isArray(data) ? data : []);
          // Mark messages as read
          await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/messages/mark-read/${currentChat.user_id}/${userId}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          // Reset unread count in contacts
          setContacts(prev =>
            prev.map(contact =>
              contact.user_id === currentChat.user_id
                ? { ...contact, unreadCount: 0 }
                : contact
            )
          );
        } catch (err) {
          console.error('Failed to fetch conversation:', err);
        }

      };
      fetchConversation();
    }
  }, [currentChat, token]);
  return (
    <div className="bg-gray-50 min-h-screen w-full pb-14 md:pb-0 overflow-hidden">
      <Header />
      <Sidebar />

      <div className="md:ml-64 pt-16 px-0 lg:px-0">
        <main className="flex flex-col md:flex-row h-[calc(100vh-4rem)] w-full bg-white ">
          {/* Contacts list */}
          {isDesktop ? <><div className="w-full md:w-80 border-r border-gray-200 flex flex-col ">
            <div className="p-4 border-b border-gray-200 ">
              <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
              <div className="mt-2 relative">
                <input
                  type="text"
                  placeholder="Search contacts..."
                  className="w-full p-2 pl-8 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <svg
                  className="absolute left-2 top-3 h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <MessagesList
              messages={messages}
              contacts={contacts}
              currentChat={currentChat}
              setCurrentChat={setCurrentChat}
              typingUsers={typingUsers}
            />
          </div></> : <>{currentChat ? <></> : <div className="w-full lg:w-80 border-r border-gray-200 flex flex-col ">
            <div className="p-4 border-b border-gray-200 ">
              <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
              <div className="mt-2 relative">
                <input
                  type="text"
                  placeholder="Search contacts..."
                  className="w-full p-2 pl-8 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <svg
                  className="absolute left-2 top-3 h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <MessagesList
              messages={messages}
              contacts={contacts}
              currentChat={currentChat}
              setCurrentChat={setCurrentChat}
              typingUsers={typingUsers}
            />
          </div>}</>}

          {/* Chat view */}
          {isDesktop ? (<div className="flex-1 flex flex-col border-t md:border-t-0 border-gray-200">
            {currentChat ? (
              <ChatView
                contact={currentChat}
                messages={messages}
                onSendMessage={handleSendMessage}
                onStartTyping={handleStartTyping}
                onStopTyping={handleStopTyping}
                isTyping={typingUsers.includes(currentChat?.user_id)}
                typingUser={contacts.find(c => c.user_id === currentChat?.user_id)?.firstName}
                userpic={user.profile_img_url[0]}
                user_id={userId}
                socket={socket}
                onback={() => setCurrentChat(null)}
              />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-4">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-700 mb-2">Select a chat</h3>
                <p className="text-gray-500 text-center max-w-md">
                  Choose a conversation from the list to start messaging or search for contacts to connect with.
                </p>
              </div>
            )}
          </div>) : <> {currentChat ? (
            <ChatView
              currentChat={currentChat}
              contact={currentChat}
              messages={messages}
              onSendMessage={handleSendMessage}
              onStartTyping={handleStartTyping}
              onStopTyping={handleStopTyping}
              isTyping={typingUsers.includes(currentChat?.user_id)}
              typingUser={contacts.find(c => c.user_id === currentChat?.user_id)?.firstName}
              userpic={user.profile_img_url[0]}
              user_id={userId}
              socket={socket}
              onback={() => setCurrentChat(null)}
            />) : <></>} </>}

        </main>
      </div>
      <MobileNav />
    </div>
  );
}