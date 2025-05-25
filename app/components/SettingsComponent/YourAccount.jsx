import { ChevronRight, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';
export const YourAccount = ({ data }) => {
  const [userData, setUserData] = useState({});
  const cityToCountryMap = {
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

  function getCountry(city) {
    if (!city) return null;
    return cityToCountryMap[city.toLowerCase()] || null;
  }
  const calculateAge = (dob) => {
    if (!dob) return null;

    // Convert from "DD-MM-YYYY" to "YYYY-MM-DD"
    const [day, month, year] = dob.split("-");
    const formatted = `${year}-${month}-${day}`;
    const birthDate = new Date(formatted);

    if (isNaN(birthDate)) return null;

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();

    const hasHadBirthdayThisYear =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

    if (!hasHadBirthdayThisYear) age -= 1;

    return age;
  };
  useEffect(() => {
    setUserData({
      email: data?.user.email,
      username: data?.user.username,
      name: data?.user.name,
      bio: data?.user.bio,
      profile_img_url: data?.user.profile_img_url,
      created_at: data?.user.created_at,
      followers: data?.user.followers,
      following: data?.user.following,
      banner_img_url: data?.user.banner_img_url,
      is_verified: data?.user.is_verified || false,
      profile_img_data: "",
      banner_img_data: "",
      DOB: data?.user.DOB,
      age: calculateAge(data?.user.DOB),
      country : getCountry(data?.locations[0]),
      language : data?.languages[0],
      gender : data?.gender[0],
      phone: data?.phone,
      website : data?.website,
    });
  }, [data]);
  return (
    <div className="flex-1 bg-gray-200 rounded-md shadow p-6 text-sm text-gray-800 h-[100vh] overflow-scroll">
      <h2 className="text-xl font-extrabold mb-6">Account information</h2>
      <div className="space-y-4 border-t-1 p-3">
        <div className='mb-6'>
          <p className="font-bold mb-2 text-xl">Username {/*<ChevronRight className='justify-self-end text-gray-900' />*/}</p>
          <p className="text-gray-600 text-lg">{userData.username}</p>
        </div>
        <div className='mb-6'>
          <p className="font-bold mb-2 text-xl">Phone {/*<ChevronRight className='justify-self-end text-gray-900' />*/}</p>
          <p className="text-gray-600 text-lg">{userData.phone}</p>
        </div>
        <div className='mb-6'>
          <p className="font-bold mb-2 text-xl">Email {/*<ChevronRight className='justify-self-end text-gray-900' />*/}</p>
          <p className="text-gray-600 text-lg">{userData.email}</p>
        </div>
        <div className='mb-6'>
          <p className="font-bold mb-2 text-xl">Website{/*<ChevronRight className='justify-self-end text-gray-900' />*/}</p>
          <p className="text-gray-600 text-lg break-words">{userData.website}</p>
        </div>
        <div className='mb-6'>
          <p className="font-bold mb-3.5 text-xl">Bio</p>
          <div className="border rounded p-3 text-gray-700 bg-gray-50 mt-1">
            {userData.bio}
          </div>
        </div>
        <hr />
        <div className='mb-6'>
          <p className="font-bold mb-2 text-xl">Country{/*<ChevronRight className='justify-self-end text-gray-900' />*/}</p>
          <p className="text-gray-600 text-lg">{userData.country}</p>
        </div>
        <div className='mb-6'>
          <p className="font-bold mb-2 text-xl">Language{/*<ChevronRight className='justify-self-end text-gray-900' />*/}</p>
          <p className="text-gray-600 text-lg">{userData.language}</p>
        </div>
        <div className='mb-6'>
          <p className="font-bold mb-2 text-xl">Age{/*<ChevronRight className='justify-self-end text-gray-900' />*/}</p>
          <p className="text-gray-600 text-lg">{userData.age}</p>
        </div>
        <div className='mb-6'>
          <p className="font-bold mb-2 text-xl">Gender{/*<ChevronRight className='justify-self-end text-gray-900' />*/}</p>
          <p className="text-gray-600 text-lg">{userData.gender}</p>
        </div>
        <div className='mb-6'>
          <p className="font-bold mb-2 text-xl">Birth date{/*<ChevronRight className='justify-self-end text-gray-900' />*/}</p>
          <p className="text-gray-600 text-lg">{userData.DOB}</p>
        </div>
        <hr />
        <div className='mb-6'>
          <p className="font-bold mb-2 text-xl">Joined{/*<ChevronRight className='justify-self-end text-gray-900' />*/}</p>
          <p className="text-gray-600 text-lg">
            Joined {new Date(userData.created_at).toLocaleString('default', { month: 'long' })} {new Date(userData.created_at).getFullYear()}
          </p>

        </div>
        <hr />
      </div>
    </div>
  )
}