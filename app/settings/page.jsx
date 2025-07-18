'use client';
import React, { useState, useEffect } from 'react';
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";
import { getCookie } from '../lib/utils/cookie';
import {
  CircleUserRound, Bell, Globe, Eye,
  PersonStanding, FileChartColumn,
  CircleHelp, HeartIcon, ArrowLeft, Search, ChevronRight,
  Router,
  DollarSign
} from 'lucide-react';

// Import your settings components
import { YourAccount } from '../components/SettingsComponent/YourAccount';
import { Notifications } from '../components/SettingsComponent/Notifications';
import { Privacy } from '../components/SettingsComponent/Privacy';
import { Dating } from '../components/SettingsComponent/Dating';
import { Language } from '../components/SettingsComponent/language';
import { Accessibility } from '../components/SettingsComponent/Accessibility';
import { Content } from '../components/SettingsComponent/Content';
import { Additional } from '../components/SettingsComponent/Additional';
import { Subscriptions } from '../components/SettingsComponent/Subscriptions';
import { useRouter } from 'next/navigation';
export default function SettingPage() {
  const [selectedSettingId, setSelectedSettingId] = useState(null);
  const [isDesktop, setIsDesktop] = useState(true);
  const [data, setData] = useState();
  const router = useRouter();
  useEffect(() => {
    const checkProfileStatus = async () => {
      const accessToken = getCookie("accessToken");
      try {
        const api_url = process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:3001";
        const response = await fetch(`${api_url}/auth/user`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`, // 👈 pass userId in Authorization header
            // 'credentials': "include"
          }
        });
        const data = await response.json();
        const newresponse = await fetch(`${api_url}/date/dating-profile/${data.user.user_id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`, // 👈 pass userId in Authorization header
            // 'credentials': "include"
          }
        });
        const profileData = await newresponse.json();
        const mergedData = {
          ...data,      // from /auth/user
          ...profileData,        // from /date/check-profile
        };

        setData(mergedData);
        if (!response.ok) throw new Error('Profile check failed');
      } catch (error) {
        console.error("Profile check error:", error);
      }
    };
    checkProfileStatus();
  }, []);
  useEffect(() => {
    const checkScreenSize = () => {
      const isNowDesktop = window.innerWidth >= 1024;
      setIsDesktop(isNowDesktop);
      setSelectedSettingId(isNowDesktop ? 1 : null);


      // If switching to mobile view, show the menu
      if (!isNowDesktop) {
        setSelectedSettingId(null);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);


  const handleaccountclick = (id) => {
    setSelectedSettingId(id);
  };

  const renderSettingComponent = () => {
    // console.log(data);
    switch (selectedSettingId) {
      case 1:
        return <YourAccount data={data} />;
      case 2:
        return <Notifications user={data.user} />;
      case 3:
        return <Privacy user={data.user} />;
      case 4:
        return <Dating data={data} />;
      case 5:
        return <Language />;
      case 7:
        return <Accessibility user={data.user} />;
      case 8:
        return <Content user={data.user} />;
      case 9:
        return <Additional />;
      case 6:
        return <Subscriptions user={data.user} />;
      default:
        return <YourAccount />;
    }
  };

  return (
    <div className="bg-white min-h-screen w-full pb-14 md:pb-0">
      <Header />
      <Sidebar />
      <div className="pt-14 md:pl-58 px-2">
        {isDesktop ? (
          <div className="flex gap-2">
            {/* Sidebar Menu */}
            <div className="w-70  h-fit rounded-md shadow p-7 hidden md:block">
              <h2 className="text-xl font-extrabold mb-4">Settings</h2>
              <ul className="space-y-3 text-sm font-medium text-gray-700 p-1">
                <li className={`cursor-pointer p-2 mb-7 hover:text-black ${selectedSettingId === 1 ? 'text-black bg-gray-100 font-bold' : ''}`} onClick={() => handleaccountclick(1)}><CircleUserRound className="inline mr-2 mb-0.5" />Your account</li>
                <li className={`cursor-pointer mb-7 p-2 hover:text-black ${selectedSettingId === 2 ? 'text-black font-bold bg-gray-100' : ''}`} onClick={() => handleaccountclick(2)}><Bell className="inline mr-2 mb-0.5" />Notifications</li>
                <li className={`cursor-pointer mb-7 p-2 hover:text-black ${selectedSettingId === 3 ? 'text-black font-bold bg-gray-100' : ''}`} onClick={() => handleaccountclick(3)}><Eye className="inline mr-2 mb-0.5" />Privacy and safety</li>
                <li className={`cursor-pointer mb-7 p-2 hover:text-black ${selectedSettingId === 4 ? 'text-black font-bold bg-gray-100' : ''}`} onClick={() => handleaccountclick(4)}><HeartIcon className="inline mr-2 mb-0.5" />Dating profile</li>
                <li className={`cursor-pointer mb-7 p-2 hover:text-black ${selectedSettingId === 5 ? 'text-black font-bold bg-gray-100' : ''}`} onClick={() => handleaccountclick(5)}><Globe className="inline mr-2 mb-0.5" />Language preference</li>
                <li className={`cursor-pointer mb-7 p-2 hover:text-black ${selectedSettingId === 6 ? 'text-black font-bold bg-gray-100' : ''}`} onClick={() => handleaccountclick(6)}><DollarSign className="inline mr-2 mb-0.5" />Subscriptions</li>
                <li className={`cursor-pointer mb-7 p-2 hover:text-black ${selectedSettingId === 7 ? 'text-black font-bold bg-gray-100' : ''}`} onClick={() => handleaccountclick(7)}><PersonStanding className="inline mr-2 mb-0.5" />Accessibility & display</li>
                <li className={`cursor-pointer mb-7 p-2 hover:text-black ${selectedSettingId === 8 ? 'text-black font-bold bg-gray-100' : ''}`} onClick={() => handleaccountclick(8)}><FileChartColumn className="inline mr-2 mb-0.5" />Content preference</li>
                <li className={`cursor-pointer p-2 hover:text-black ${selectedSettingId === 9 ? 'text-black font-bold bg-gray-100' : ''}`} onClick={() => handleaccountclick(9)}><CircleHelp className="inline mr-2 mb-0.5" />Additional resources</li>
              </ul>
            </div>

            {/* Detail View */}
            {renderSettingComponent()}
          </div>
        ) : (
          // Mobile & Tablet View
          <div className="flex flex-col gap-4">
            {selectedSettingId === null ? (
              <div className="bg-white rounded-md shadow p-5 h-[100vh]">
                <ArrowLeft className='inline mb-2' onClick={()=>router.push('/')} />
                <h2 className="text-xl font-extrabold ml-2 inline">Settings</h2>
                <hr />
                <div className="relative mt-4">
                  <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search"
                    className="bg-gray-200 pl-10 pr-4 py-2 rounded-full text-sm w-full focus:outline-none focus:ring-1 focus:ring-gray-300"
                  />
                </div>
                <ul className="space-y-4 text-sm font-medium text-gray-700">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((id) => (
                    <li
                      key={id}
                      className="cursor-pointer flex justify-between items-center hover:text-black mt-7 ml-4"
                      onClick={() => handleaccountclick(id)}
                    >
                      <div className="flex items-center gap-2">
                        {menuIcons(id)} {menuLabels(id)}
                      </div>
                      <ChevronRight className="text-gray-900" />
                    </li>
                  ))}
                </ul>

              </div>
            ) : (
              <div className="bg-white rounded-md shadow p-4">
                <button
                  className="text-md mb-4 font-bold"
                  onClick={() => setSelectedSettingId(null)}
                >
                  <ArrowLeft className='inline mr-3' />
                  Back to Settings
                </button>
                {renderSettingComponent()}
              </div>
            )}
          </div>
        )}
      </div>
      <MobileNav />
    </div>
  );
}

// Helper functions
function menuLabels(id) {
  return [
    'Your account', 'Notifications', 'Privacy and safety', 'Dating profile',
    'Language preference', 'Subscriptions', 'Accessibility & display', 'Content preference', 'Additional resources'
  ][id - 1];
}

function menuIcons(id) {
  const icons = [
    <CircleUserRound className="inline" />,
    <Bell className="inline" />,
    <Eye className="inline" />,
    <HeartIcon className="inline" />,
    <Globe className="inline" />,
    <DollarSign className="inline" />,
    <PersonStanding className="inline" />,
    <FileChartColumn className="inline" />,
    <CircleHelp className="inline" />
  ];
  return icons[id - 1];
}
