import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { getCookie } from '../../lib/utils/cookie';

export const YourAccount = ({ data, accessToken }) => {
  const [userData, setUserData] = useState({});
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false); // ✅ Loading state

  useEffect(() => {
    const updated = {
      email: data?.user.email || '',
      username: data?.user.username || '',
      bio: data?.user.bio || '',
      DOB: data?.user.DOB,
      age: data?.age,
      country: getCountry(data?.locations[0]),
      language: data?.languages[0],
      gender: data?.gender[0],
      phone: data?.phone || '',
      website: data?.website || '',
      created_at: data?.user.created_at
    };
    setUserData(updated);
    setEditData({
      username: updated.username,
      phone: updated.phone,
      email: updated.email,
      website: updated.website,
      bio: updated.bio
    });
  }, [data]);

  const getCountry = (city) => {
    const map = {
      "new york": "United States",
      "london": "United Kingdom",
      "paris": "France",
      "tokyo": "Japan",
      "berlin": "Germany",
      "los angeles": "United States",
      "chicago": "United States",
      "toronto": "Canada",
      "sydney": "Australia",
      "mumbai": "India"
    };
    return city ? map[city.toLowerCase()] || null : null;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true); // ✅ Start loading
    try {
      const accessToken = getCookie("accessToken");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/date/dating-profile/${data.user_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(editData),
      });
      const response2 = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/auth/user`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(editData),
      });

      if (!response.ok || !response2.ok) throw new Error('Update failed');

      toast.success('Profile updated successfully!');
      setUserData((prev) => ({ ...prev, ...editData }));
    } catch (err) {
      console.error(err);
      toast.error('Update failed');
    } finally {
      setLoading(false); // ✅ End loading
    }
  };
  const isEdited = () => {
    return (
      editData.username !== userData.username ||
      editData.phone !== userData.phone ||
      editData.email !== userData.email ||
      editData.website !== userData.website ||
      editData.bio !== userData.bio
    );
  };

  return (
    <div className="flex-1 rounded-md shadow p-6 text-sm text-gray-800 h-[100vh] overflow-scroll">
      <h2 className="text-xl font-extrabold mb-6">Account information</h2>

      {/* Editable Fields */}
      {['username', 'phone', 'email', 'website'].map((field) => (
        <div className='mb-6' key={field}>
          <p className="font-bold mb-2 text-xl capitalize">{field}</p>
          <input
            name={field}
            value={editData[field] || ''}
            onChange={handleInputChange}
            className="text-gray-600 text-lg w-full p-2 rounded onfocus:outline-2"
          />
        </div>
      ))}
      <div className='mb-6'>
        <p className="font-bold mb-2 text-xl">Bio</p>
        <textarea
          name="bio"
          value={editData.bio}
          onChange={handleInputChange}
          className="w-full p-3 border rounded bg-gray-50 text-gray-700"
        />
      </div>

      {/* ✅ Button with loading state */}
      {isEdited() && (
        <button
          className={`bg-teal-600 text-white px-4 py-2 rounded font-semibold ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      )}


      <hr className='my-6' />
      {[
        { label: 'Country', value: userData.country },
        { label: 'Language', value: userData.language },
        { label: 'Age', value: userData.age },
        { label: 'Gender', value: userData.gender },
        { label: 'Birth date', value: userData.DOB },
        {
          label: 'Joined',
          value: `Joined ${new Date(userData.created_at).toLocaleString('default', {
            month: 'long',
          })} ${new Date(userData.created_at).getFullYear()}`
        },
      ].map(({ label, value }) => (
        <div className='mb-6' key={label}>
          <p className="font-bold mb-2 text-xl">{label}</p>
          <p className="text-gray-600 text-lg">{value}</p>
        </div>
      ))}
    </div>
  );
};
