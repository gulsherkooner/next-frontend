'use client';
import React from 'react';
import { MessagesList } from '../../components/MessagesList';
import { ChatView } from '../../components/ChatView';
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";

export default function MessagesPage() {
  return (
    <div className="bg-gray-100 min-h-screen w-full pb-14 md:pb-0">
      <Header />
      <Sidebar />

      <div className="md:ml-64 pt-16 px-4 lg:px-8">
        {/* Layout wrapper */}
        <main className="flex flex-wrap mb-6 gap-2 w-full max-w-4xl h-[calc(100vh-4rem)] bg-white rounded-lg shadow overflow-hidden">
          {/* flex items-center mb-6 flex-wrap gap-2*/}
          <div className="w-full md:w-80 border-r border-gray-200">
            <MessagesList />
          </div>

          {/* Right - Chat View */}
          <div className="flex-1 hidden md:flex">
            <ChatView />
          </div>
        </main>
      </div>
    </div>
  );
}
