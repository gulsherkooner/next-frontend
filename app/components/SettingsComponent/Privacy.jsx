import { ChevronRight, ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getCookie } from '../../lib/utils/cookie';

const api_url = process.env.NEXT_PUBLIC_API_GATEWAY_URL;

const defaultSettings = {
  privacy: {
    messages: {
      whoCanMessage: 'Anyone',
      readReceipts: 'On',
      onlineStatus: 'On'
    },
    location: {
      showInProfile: 'On',
      allowAccess: 'Off',
      suggestions: 'On'
    }
  }
};

const usePrivacySettings = (user_id, accessToken) => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${api_url}/api/settings/${user_id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        const fetched = response.ok ? await response.json() : {};
        const merged = {
          ...defaultSettings,
          ...fetched,
          privacy: {
            messages: {
              ...defaultSettings.privacy.messages,
              ...(fetched.privacy?.messages || {})
            },
            location: {
              ...defaultSettings.privacy.location,
              ...(fetched.privacy?.location || {})
            }
          }
        };

        setSettings(merged);

        if (!fetched._id) {
          await fetch(`${api_url}/api/settings/${user_id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify(merged),
          });
        }

      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    if (user_id && accessToken) {
      fetchSettings();
    }
  }, [user_id, accessToken]);

  const saveSettings = async (section, field, value) => {
    const updated = {
      ...settings,
      privacy: {
        ...settings.privacy,
        [section]: {
          ...settings.privacy[section],
          [field]: value
        }
      }
    };

    setSettings(updated);

    try {
      await fetch(`${api_url}/api/settings/${user_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(updated),
      });
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  return [settings, saveSettings];
};



export const Privacy = ({ user }) => {
  const user_id = user.user_id;
  const accessToken = getCookie('accessToken');
  const [section, setSection] = useState('main');
  const [isblock, setisblock] = useState(false);
  const [ismuted, setismuted] = useState(false);
  const [settings, saveSettings] = usePrivacySettings(user_id, accessToken);

  const [blockedUsers, setBlockedUsers] = useState([
    { name: 'Username 1', handle: '@User1' },
    { name: 'Username 2', handle: '@User2' },
    { name: 'Username 3', handle: '@User3' },
    { name: 'Username 4', handle: '@User4' },
    { name: 'Username 5', handle: '@User5' },
    { name: 'Username 6', handle: '@User6' },
    { name: 'Username 7', handle: '@User7' },
    { name: 'Username 8', handle: '@User8' },
    { name: 'Username 9', handle: '@User9' },
    { name: 'Username 10', handle: '@User10' }
  ]);

  const handleUnblock = (index) => {
    const updated = [...blockedUsers];
    updated.splice(index, 1);
    setBlockedUsers(updated);
  };

  const renderOptions = (title, desc, field, sectionName, options = ['On', 'Off']) => (
    <div>
      <h2 className="text-xl font-extrabold mb-2">{title}</h2>
      <p className="text-lg text-gray-600 mb-4">{desc}</p>
      <div className="space-y-2 mb-4">
        {options.map(opt => (
          <label key={opt} className="flex items-center space-x-4 transform: scale-100">
            <input
              type="radio"
              name={`${sectionName}-${field}`}
              checked={settings?.privacy?.[sectionName]?.[field] === opt}
              onChange={() => saveSettings(sectionName, field, opt)}
              className="scale-150 accent-gray-800"
            />
            <span className='font-bold text-lg'>{opt}</span>
          </label>
        ))}
      </div>
      <hr />
    </div>
  );

  return (
    <div className="flex-1 bg-gray-200 rounded-md shadow p-6 text-sm text-gray-800 h-[100vh] overflow-scroll">
      {section === 'main' && !isblock && !ismuted && (
        <>
          <h2 className="text-xl font-extrabold mb-6">Privacy & Safety</h2>
          <div className="space-y-4 border-t-1 p-3">
            <div className='mb-5 p-2' onClick={() => setSection('changePassword')}>
              <p className="font-bold mt-3 text-xl">Change your Password <ChevronRight className='justify-self-end text-gray-900 -mt-5' /></p>
            </div>
            <hr />
            <div className='mb-5 p-2' onClick={() => setSection('messages')}>
              <p className="font-bold mt-3 text-xl">Messages <ChevronRight className='justify-self-end text-gray-900 -mt-5' /></p>
            </div>
            <hr />
            <div className='mb-5 p-2' onClick={() => setSection('location')}>
              <p className="font-bold mt-3 text-xl">Location information <ChevronRight className='justify-self-end text-gray-900 -mt-5' /></p>
            </div>
            <hr />
            <div className='mb-5 p-2' onClick={() => setSection('restrict')}>
              <p className="font-bold mt-3 text-xl">Restricted accounts <ChevronRight className='justify-self-end text-gray-900 -mt-5' /></p>
            </div>
            <hr />
          </div>
        </>
      )}

      {section === 'changePassword' && (
        <>
          <ArrowLeft className='inline mb-2' onClick={() => setSection('main')} />
          <h2 className="inline text-xl font-extrabold mb-6 ml-3">Change Password</h2>
          <hr />
          <div className="space-y-4 p-5 mt-5">
            <h2 className="text-xl font-extrabold mb-5">Current Password</h2>
            <input
              type="text"
              placeholder="Enter Current Password"
              className="bg-white w-full p-2 rounded-xl border border-gray-300 mb-3"
            />
            <p className="text-sm text-gray-800 mb-4">Forgot Password?</p>
          </div>
          <div className="space-y-4 p-5">
            <h2 className="text-xl font-extrabold mb-5">New Password</h2>
            <input
              type="text"
              placeholder="Enter New Password"
              className="bg-white w-full p-2 rounded-xl border border-gray-300 mb-5"
            />
          </div>
          <div className="space-y-4 p-5">
            <h2 className="text-xl font-extrabold mb-5">Confirm Password</h2>
            <input
              type="text"
              placeholder="Confirm Password"
              className="bg-white w-full p-2 rounded-xl border border-gray-300 mb-5"
            />
          </div>
          <div className="space-y-4 p-5 justify-self-end">
            <button type="submit" className="bg-white text-lg p-2 rounded-xl border border-gray-300">Submit</button>
          </div>
        </>
      )}

      {section === 'messages' && settings?.privacy.messages && (
        <>
          <ArrowLeft className='inline mb-2' onClick={() => setSection('main')} />
          <h2 className="inline text-xl font-extrabold mb-6 ml-3">Messages</h2>
          <hr />
          {renderOptions('Who can message you?', 'People you follow can always send you a message.', 'whoCanMessage', 'messages', ['No one', 'Verified profiles', 'Dating only', 'Anyone'])}
          {renderOptions('Show read receipts', 'Let others know when you’ve read their messages.', 'readReceipts', 'messages')}
          {renderOptions('Online status', 'Let others know when you’re online and active.', 'onlineStatus', 'messages')}
        </>
      )}

      {section === 'location' && settings?.privacy?.location && (
        <>
          <ArrowLeft className='inline mb-2' onClick={() => setSection('main')} />
          <h2 className="inline text-xl font-extrabold mb-6 ml-3">Location information</h2>
          <hr />
          {renderOptions('Show Location in Profile', 'Display your city or region on your public profile.', 'showInProfile', 'location')}
          {renderOptions('Allow Location Access', 'Control whether the app can access your location.', 'allowAccess', 'location')}
          {renderOptions('Location-Based Suggestions', 'Use your location to show relevant content, people, or events.', 'suggestions', 'location')}
        </>
      )}

      {section === 'restrict' && (
        <>
          <ArrowLeft className='inline mb-2' onClick={() => setSection('main')} />
          <h2 className="inline text-xl font-extrabold mb-6 ml-3">Restricted Accounts</h2>
          <hr />
          <div className="space-y-4 border-t-1 p-3">
            <div className='mb-5 p-2' onClick={() => { setisblock(true); setSection('') }}>
              <p className="font-bold mt-3 text-xl">Blocked Accounts <ChevronRight className='justify-self-end text-gray-900 -mt-5' /></p>
            </div>
            <hr />
            <div className='mb-5 p-2' onClick={() => { setismuted(true); setSection('') }}>
              <p className="font-bold mt-3 text-xl">Muted Accounts <ChevronRight className='justify-self-end text-gray-900 -mt-5' /></p>
            </div>
            <hr />
          </div>
        </>
      )}

      {isblock && (
        <>
          <ArrowLeft className='inline mb-2' onClick={() => { setisblock(false); setSection('restrict'); }} />
          <h2 className="inline text-xl font-extrabold mb-6 ml-3">Blocked Accounts</h2>
          <hr />
          <div className="space-y-4 p-5">
            <div className="bg-gray-200 rounded-md shadow divide-y ">
              {blockedUsers.map((user, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3 p-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full" />
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-gray-500 text-sm">{user.handle}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleUnblock(index)}
                    className="text-sm font-semibold px-4 py-1 border rounded-full hover:bg-gray-200 transition"
                  >
                    Unblock
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {ismuted && (
        <>
          <ArrowLeft className='inline mb-2' onClick={() => { setismuted(false); setSection('restrict'); }} />
          <h2 className="inline text-xl font-extrabold mb-6 ml-3">Muted Accounts</h2>
          <hr />
          <div className="space-y-4 p-5">
            <div className="bg-gray-200 rounded-md shadow divide-y ">
              {blockedUsers.map((user, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3 p-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full" />
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-gray-500 text-sm">{user.handle}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleUnblock(index)}
                    className="text-sm font-semibold px-4 py-1 border rounded-full hover:bg-gray-200 transition"
                  >
                    Unmute
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};