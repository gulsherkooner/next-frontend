import { ChevronRight, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
export const Privacy = () => {
  const [isChange, setisChange] = useState(false);
  const [isrestrict, setisrestrict] = useState(false);
  const [ismessage, setismessage] = useState(false);
  const [islocation, setislocation] = useState(false);
  const [isblock, setisblock] = useState(false);
  const [ismuted, setismuted] = useState(false);
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
    { name: 'Username 10', handle: '@User10' },
  ]);

  const handleUnblock = (index) => {
    const updated = [...blockedUsers];
    updated.splice(index, 1);
    setBlockedUsers(updated);
  };
  return (
    <div className="flex-1 bg-gray-200 rounded-md shadow p-6 text-sm text-gray-800 h-[100vh]">
      {!isChange && !islocation && !ismessage && !isrestrict && !isblock && !ismuted && (
        <>
          <h2 className="text-xl font-extrabold mb-6">Privacy & Safety</h2>
          <div className="space-y-4 border-t-1 p-3">
            <div className='mb-5 p-2' onClick={() => setisChange(true)}>
              <p className="font-bold mt-3 text-xl">Change your Password <ChevronRight className='justify-self-end text-gray-900 -mt-5' /></p>
            </div>
            <hr />
            <div className='mb-5 p-2' onClick={() => setisrestrict(true)}>
              <p className="font-bold mt-3 text-xl">Restricted accounts <ChevronRight className='justify-self-end text-gray-900 -mt-5' /></p>
            </div>
            <hr />
            <div className='mb-5 p-2' onClick={() => setismessage(true)}>
              <p className="font-bold mt-3 text-xl">Messages <ChevronRight className='justify-self-end text-gray-900 -mt-5' /></p>
            </div>
            <hr />
            <div className='mb-5 p-2' onClick={() => setislocation(true)}>
              <p className="font-bold mt-3 text-xl">Location information <ChevronRight className='justify-self-end text-gray-900 -mt-5' /></p>
            </div>
            <hr />
          </div>
        </>
      )}
      {isChange && (
        <>
          <ArrowLeft className='inline mb-2' onClick={() => setisChange(false)} />
          <h2 className="inline text-xl font-extrabold mb-6 ml-3">Change Password</h2>
          <hr />
          <div className="space-y-4 p-5 mt-5">
            <h2 className="text-xl font-extrabold mb-5">Current Password</h2>
            <input
              type="text"
              placeholder="Enter Current Password"
              className="bg-white w-full p-2 rounded-xl border border-gray-300 mb-3"
            />
            <p className="text-sm text-gray-800 mb-4">
              Forgot Password?
            </p>
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
            <button type="submit" className=" bg-white text-lg p-2 rounded-xl border border-gray-300" >Submit</button>
          </div>
        </>
      )}
      {isrestrict && (
        <>
          <ArrowLeft className='inline mb-2' onClick={() => setisrestrict(false)} />
          <h2 className="inline text-xl font-extrabold mb-6 ml-3">Restricted Accounts</h2>
          <hr />
          <div className="space-y-4 border-t-1 p-3">
            <div className='mb-5 p-2' >
              <p className="font-bold mt-3 text-xl" onClick={() => { setisblock(true); setisrestrict(false) }}>Blocked Accounts <ChevronRight className='justify-self-end text-gray-900 -mt-5' /></p>
            </div>
            <hr />
            <div className='mb-5 p-2' >
              <p className="font-bold mt-3 text-xl" onClick={() => { setismuted(true); setisrestrict(false) }}>Muted Accounts <ChevronRight className='justify-self-end text-gray-900 -mt-5' /></p>
            </div>
            <hr />
          </div>
        </>
      )}
      {ismessage && (
        <>
          <ArrowLeft className='inline mb-2' onClick={() => setismessage(false)} />
          <h2 className="inline text-xl font-extrabold mb-6 ml-3">Messages</h2>
          <hr />
          <div className="space-y-4 p-5">
            <h2 className="text-xl font-extrabold mb-2">Who can message you?</h2>
            <p className="text-lg text-gray-600 mb-4">People you follow can always send you a message.</p>
            <div className="space-y-2 mb-4">
              {['No one', 'People with Verified profiles', 'Only users interacting via the Dating feature', 'Any one'].map((option) => (
                <label key={option} className="flex items-center space-x-4 transform: scale-100">
                  <input
                    type="radio"
                    name="apperance"
                    className="scale-150 accent-gray-800"
                  />
                  <span className='font-bold text-lg'>{option}</span>
                </label>
              ))}
            </div>
            <hr />
            <h2 className="text-xl font-extrabold mb-2">Show read receipts </h2>
            <p className="text-lg text-gray-600 mb-4">Let others know when you’ve read their messages.</p>
            <div className="space-y-2 mb-4">
              {['On', 'Off'].map((option) => (
                <label key={option} className="flex items-center space-x-4 transform: scale-100">
                  <input
                    type="radio"
                    name="colour"
                    className="scale-150 accent-gray-800"
                  />
                  <span className='font-bold text-lg'>{option}</span>
                </label>
              ))}
            </div>
            <hr />
            <h2 className="text-xl font-extrabold mb-2">Online status</h2>
            <p className="text-lg text-gray-600 mb-4">Let others know when you’re online and active.</p>
            <div className="space-y-2 mb-4">
              {['On', 'Off'].map((option) => (
                <label key={option} className="flex items-center space-x-4 transform: scale-100">
                  <input
                    type="radio"
                    name="font"
                    className="scale-150 accent-gray-800"
                  />
                  <span className='font-bold text-lg'>{option}</span>
                </label>
              ))}
            </div>

          </div>
        </>
      )}
      {islocation && (
        <>
          <ArrowLeft className='inline mb-2' onClick={() => setislocation(false)} />
          <h2 className="inline text-xl font-extrabold mb-6 ml-3">Location information</h2>
          <hr />
          <div className="space-y-4 p-5">
            <h2 className="text-xl font-extrabold mb-2">Show Location in Profile</h2>
            <p className="text-lg text-gray-600 mb-4">Display your city or region on your public profile.</p>
            <div className="space-y-2 mb-4">
              {['On', 'Off'].map((option) => (
                <label key={option} className="flex items-center space-x-4 transform: scale-100">
                  <input
                    type="radio"
                    name="apperance"
                    className="scale-150 accent-gray-800"
                  />
                  <span className='font-bold text-lg'>{option}</span>
                </label>
              ))}
            </div>
            <hr />
            <h2 className="text-xl font-extrabold mb-2">Allow Location Access</h2>
            <p className="text-lg text-gray-600 mb-4">Control whether the app can access your location.</p>
            <div className="space-y-2 mb-4">
              {['On', 'Off'].map((option) => (
                <label key={option} className="flex items-center space-x-4 transform: scale-100">
                  <input
                    type="radio"
                    name="colour"
                    className="scale-150 accent-gray-800"
                  />
                  <span className='font-bold text-lg'>{option}</span>
                </label>
              ))}
            </div>
            <hr />
            <h2 className="text-xl font-extrabold mb-2">Location-Based Suggestions</h2>
            <p className="text-lg text-gray-600 mb-4">Use your location to show relevant content, people, or events.</p>
            <div className="space-y-2 mb-4">
              {['On', 'Off'].map((option) => (
                <label key={option} className="flex items-center space-x-4 transform: scale-100">
                  <input
                    type="radio"
                    name="font"
                    className="scale-150 accent-gray-800"
                  />
                  <span className='font-bold text-lg'>{option}</span>
                </label>
              ))}
            </div>

          </div>
        </>
      )}
      {isblock && (
        <>
          <ArrowLeft className='inline mb-2' onClick={() => { setisblock(false); setisrestrict(true) }} />
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
          <ArrowLeft className='inline mb-2' onClick={() => { setismuted(false); setisrestrict(true) }} />
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
  )
}
