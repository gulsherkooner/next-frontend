import { ArrowLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getCookie } from '../../lib/utils/cookie';

const api_url = process.env.NEXT_PUBLIC_API_GATEWAY_URL;

// ✅ Moved default settings to top
const defaultSettings = {
  notifications: {
    email: {
      reminders: 'Off',
      updates: 'Off',
      tips: 'Off',
      connections: 'Off',
      suggestions: 'Off'
    },
    push: {
      messages: 'Off',
      trending: 'Off',
      offers: 'Off',
      news: 'Off',
      comments: 'Off',
      likes: 'Off',
      datingMessages: 'Off'
    }
  }
};

// ✅ Hook using fetch + accessToken
export const useSettings = (user_id, accessToken) => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${api_url}/date/settings/${user_id}`, {
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
          notifications: {
            email: {
              ...defaultSettings.notifications.email,
              ...(fetched.notifications?.email || {})
            },
            push: {
              ...defaultSettings.notifications.push,
              ...(fetched.notifications?.push || {})
            }
          }
        };
        setSettings(merged);

        // Auto-create record if not present
        if (!fetched._id) {
          await fetch(`${api_url}/date/settings/${user_id}`, {
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

  const saveSettings = async (newSettings) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);

    try {
      await fetch(`${api_url}/date/settings/${user_id}`, {
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


export const Notifications = ({ user }) => {
  const user_id = user.user_id;
  const accessToken = getCookie('accessToken');
  const [isEmail, setisEmail] = useState(false);
  const [ispush, setispush] = useState(false);
  const [settings, saveSettings] = useSettings(user_id,accessToken);

  const handleEmailChange = (field, value) => {
    saveSettings({
      notifications: {
        ...settings?.notifications,
        email: {
          ...settings?.notifications?.email,
          [field]: value
        }
      }
    });
  };

  const handlePushChange = (field, value) => {
    saveSettings({
      notifications: {
        ...settings?.notifications,
        push: {
          ...settings?.notifications?.push,
          [field]: value
        }
      }
    });
  };

  return (
    <div className="flex-1 bg-gray-200 rounded-md shadow p-6 text-sm text-gray-800 h-[100vh] overflow-scroll">
      {!isEmail && !ispush && (
        <>
          <h2 className="text-xl font-extrabold mb-6">Notifications</h2>
          <div className="space-y-4 border-t-1 p-3">
            <div className='mb-5 p-2' onClick={() => setisEmail(true)}>
              <p className="font-bold mt-3 text-xl">Email Notifications <ChevronRight className='justify-self-end text-gray-900 -mt-5' /></p>
            </div>
            <hr />
            <div className='mb-5 p-2' onClick={() => setispush(true)}>
              <p className="font-bold mt-3 text-xl">Push Notifications <ChevronRight className='justify-self-end text-gray-900 -mt-5' /></p>
            </div>
            <hr />
          </div>
        </>
      )}

      {isEmail && settings?.notifications?.email && (
        <>
          <ArrowLeft className='inline mb-2' onClick={() => setisEmail(false)} />
          <h2 className="inline text-xl font-extrabold mb-6 ml-3">Email Notifications</h2>
          <hr />
          {[
            { label: "Reminder emails", field: "reminders", desc: "Stay updated on messages or matches you might have missed." },
            { label: "Feature update emails", field: "updates", desc: "Be the first to know about new features and app updates." },
            { label: "Tips & Insights Emails", field: "tips", desc: "Get helpful insights based on your activity." },
            { label: "Dating connection emails", field: "connections", desc: "Get notified about dating activity." },
            { label: "Suggestions emails", field: "suggestions", desc: "Discover recommended profiles and content." }
          ].map(({ label, field, desc }) => (
            <div key={field}>
              <h2 className="text-xl font-extrabold mb-2">{label}</h2>
              <p className="text-lg text-gray-600 mb-4">{desc}</p>
              <div className="space-y-2 mb-4">
                {['On', 'Off'].map(option => (
                  <label key={option} className="flex items-center space-x-4 transform: scale-100">
                    <input
                      type="radio"
                      name={field}
                      checked={settings.notifications.email[field] === option}
                      onChange={() => handleEmailChange(field, option)}
                      className="scale-150 accent-gray-800"
                    />
                    <span className="font-bold text-lg">{option}</span>
                  </label>
                ))}
              </div>
              <hr />
            </div>
          ))}
        </>
      )}

      {ispush && settings?.notifications?.push && (
        <>
          <ArrowLeft className='inline mb-2' onClick={() => setispush(false)} />
          <h2 className="inline text-xl font-extrabold mb-6 ml-3">Push Notifications</h2>
          <hr />
          {[
            { label: "New message notifications", field: "messages", desc: "Receive alerts when someone sends you a message." },
            { label: "Trending Profiles", field: "trending", desc: "Discover profiles getting a lot of attention." },
            { label: "Exclusive drops and offers", field: "offers", desc: "Get notified about premium content and offers." },
            { label: "App news and announcements", field: "news", desc: "Stay informed about updates and news." },
            { label: "Comment notifications", field: "comments", desc: "Get notified when someone comments on your post." },
            { label: "Likes or replies on comments", field: "likes", desc: "Be alerted when someone likes your comment." },
            { label: "Messages from dating", field: "datingMessages", desc: "Get notified about dating feature messages." }
          ].map(({ label, field, desc }) => (
            <div key={field}>
              <h2 className="text-xl font-extrabold mb-2">{label}</h2>
              <p className="text-lg text-gray-600 mb-4">{desc}</p>
              <div className="space-y-2 mb-4">
                {['On', 'Off'].map(option => (
                  <label key={option} className="flex items-center space-x-4 transform: scale-100">
                    <input
                      type="radio"
                      name={field}
                      checked={settings.notifications.push[field] === option}
                      onChange={() => handlePushChange(field, option)}
                      className="scale-150 accent-gray-800"
                    />
                    <span className="font-bold text-lg">{option}</span>
                  </label>
                ))}
              </div>
              <hr />
            </div>
          ))}
        </>
      )}
    </div>
  );
};
