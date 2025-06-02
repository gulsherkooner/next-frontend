import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { getCookie } from '../../lib/utils/cookie';

const api_url = process.env.NEXT_PUBLIC_API_GATEWAY_URL;

const defaultContent = {
  localContent: 'Off',
  sensitiveContentLevel: 'Standard',
  suggestionPreference: 'Show more from accounts I follow',
  likes: [],
  dislikes: []
};

const LikesForm = ({ likes, setLikes, onSave, type }) => {
  const categories = {
    "Hobbies": ["Painting", "Music", "Movies", "Gaming"],
    "Sports & Fitness": ["Cycling", "Hockey", "Football"]
  };

  return (
    <div className="bg-gray-200 rounded-lg max-w-xl">
      <h2 className="text-xl font-extrabold mb-2">{type === 'likes' ? 'Interested In' : 'Show Less Of'}</h2>
      <div className="flex flex-wrap gap-2 mb-2">
        {Object.values(categories).flat().map(tag => (
          <button
            key={tag}
            onClick={() => {
              const updated = likes.includes(tag)
                ? likes.filter(l => l !== tag)
                : [...likes, tag];
              setLikes(updated);
              onSave(updated);
            }}
            className={`px-3 py-1 rounded-full text-sm border ${likes.includes(tag) ? "bg-black text-white border-black" : "bg-gray-200 text-black"
              }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export const Content = ({ user }) => {
  const user_id = user?.user_id;
  const accessToken = getCookie('accessToken');
  const [settings, setSettings] = useState(null);
  const [likes, setLikes] = useState([]);
  const [dislikes, setDislikes] = useState([]);

  // Fetch settings on mount
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

        if (response.ok) {
          const data = await response.json();
          const newSettings = {
            ...data,
            content: {
              ...defaultContent,
              ...(data.content || {})
            }
          };

          setSettings(newSettings);

          setLikes(newSettings.content.likes);
          setDislikes(newSettings.content.dislikes);

          // Save if content was missing or partially missing
          if (!data.content || Object.keys(data.content).length < Object.keys(defaultContent).length) {
            await saveSettings(newSettings);
          }

        } else {
          console.error('Failed to fetch settings');
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      }
    };

    if (user_id && accessToken) {
      fetchSettings();
    }
  }, [user_id, accessToken]);

  const saveSettings = async (updatedSettings) => {
    try {
      await fetch(`${api_url}/date/settings/${user_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(updatedSettings),
      });
    } catch (err) {
      console.error('Error saving settings:', err);
    }
  };

  const handleChange = (field, value) => {
    const updated = {
      ...settings,
      content: {
        ...settings?.content,
        [field]: value
      }
    };
    setSettings(updated);
    saveSettings(updated);
  };

  const saveLikes = (updatedLikes) => {
    const updated = {
      ...settings,
      content: {
        ...settings?.content,
        likes: updatedLikes
      }
    };
    setSettings(updated);
    saveSettings(updated);
  };

  const saveDislikes = (updatedDislikes) => {
    const updated = {
      ...settings,
      content: {
        ...settings?.content,
        dislikes: updatedDislikes
      }
    };
    setSettings(updated);
    saveSettings(updated);
  };

  if (!settings) return null; // Loading

  return (
    <div className="flex-1 bg-gray-200 rounded-md shadow p-6 text-sm text-gray-800 h-[100vh] overflow-scroll">
      <h2 className="text-xl font-extrabold mb-6">Content preferences</h2>
      <hr />
      <div className="space-y-4 p-5">
        {[{
          label: 'Local Content',
          desc: 'Prioritize content from your region',
          field: 'localContent',
          options: ['On', 'Off']
        }, {
          label: 'Sensitive Content Filter',
          desc: 'Control how much sensitive content is shown across Explore.',
          field: 'sensitiveContentLevel',
          options: ['None', 'Less', 'Standard', 'More']
        }, {
          label: 'Suggested Content Filters',
          desc: 'Control content suggestions.',
          field: 'suggestionPreference',
          options: [
            'Show more from accounts I follow',
            'Prioritize creators I engage with',
            'Only verified accounts'
          ]
        }].map(({ label, desc, field, options }) => (
          <div key={field}>
            <h2 className="text-xl font-extrabold mb-2">{label}</h2>
            <p className="text-sm text-gray-600 mb-4">{desc}</p>
            <div className="space-y-2 mb-4">
              {options.map(option => (
                <label key={option} className="flex items-center space-x-4 transform: scale-100">
                  <input
                    type="radio"
                    name={field}
                    checked={settings?.content?.[field] === option}
                    onChange={() => handleChange(field, option)}
                    className="scale-150 accent-gray-800"
                  />
                  <span className="font-bold text-lg">{option}</span>
                </label>
              ))}
            </div>
            <hr />
          </div>
        ))}
        <LikesForm likes={likes} setLikes={setLikes} onSave={saveLikes} type="likes" />
        <LikesForm likes={dislikes} setLikes={setDislikes} onSave={saveDislikes} type="dislikes" />
      </div>
    </div>
  );
};
