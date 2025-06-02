import { useEffect, useState } from 'react';
import { getCookie } from '../../lib/utils/cookie';

const api_url = process.env.NEXT_PUBLIC_API_GATEWAY_URL;

const defaultAccessibility = {
  appearance: 'System Default',
  colorContrast: 'Off',
  fontSize: 'Default',
  autoplay: 'Always'
};

export const Accessibility = ({ user}) => {
  const user_id = user?.user_id;
  const accessToken = getCookie('accessToken');
  const [settings, setSettings] = useState(null);

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
            accessibility: data.accessibility || defaultAccessibility,
          };
          setSettings(newSettings);

          // Save default if missing
          if (!data.accessibility) {
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
      accessibility: {
        ...settings?.accessibility,
        [field]: value
      }
    };
    setSettings(updated);
    saveSettings(updated);
  };

  if (!settings) return null; // Still loading

  return (
    <div className="flex-1 bg-gray-200 rounded-md shadow p-6 text-lg text-gray-800 h-[100vh] overflow-y-scroll">
      <h2 className="text-xl font-extrabold mb-6">Accessibility & Display</h2>
      <hr />
      <div className="space-y-4 p-5">
        {[
          {
            label: 'Appearance',
            desc: 'Change the Appearance of the app to reduce eye strain.',
            field: 'appearance',
            options: ['Light Mode', 'Dark Mode', 'System Default']
          },
          {
            label: 'Increase colour contrast',
            desc: 'Improves legibility by increasing the contrast between text and background colors.',
            field: 'colorContrast',
            options: ['On', 'Off']
          },
          {
            label: 'Font Size',
            desc: 'Adjust the size of text across the app.',
            field: 'fontSize',
            options: ['Small', 'Default', 'Large']
          },
          {
            label: 'Autoplay',
            desc: 'Change the Appearance of the app to reduce eye strain.',
            field: 'autoplay',
            options: ['Always', 'Never']
          }
        ].map(({ label, desc, field, options }) => (
          <div key={field}>
            <h2 className="text-xl font-extrabold mb-2">{label}</h2>
            <p className="text-lg text-gray-600 mb-4">{desc}</p>
            <div className="space-y-2 mb-4">
              {options.map(option => (
                <label key={option} className="flex items-center space-x-4 transform: scale-100">
                  <input
                    type="radio"
                    name={field}
                    checked={settings?.accessibility?.[field] === option}
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
      </div>
    </div>
  );
};
