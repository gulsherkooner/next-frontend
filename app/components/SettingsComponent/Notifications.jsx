import { ArrowLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

export const Notifications = () => {
  const [isEmail, setisEmail] = useState(false);
  const [ispush, setispush] = useState(false);
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
            <div className='mb-5 p-2' >
              <p className="font-bold mt-3 text-xl" onClick={() => setispush(true)}>Push Notifications <ChevronRight className='justify-self-end text-gray-900 -mt-5' /></p>
            </div>
            <hr />
          </div>
        </>)}
      {isEmail && (
        <><ArrowLeft className='inline mb-2' onClick={() => setisEmail(false)} />
          <h2 className="inline text-xl font-extrabold mb-6 ml-3">Email Notifications</h2>
          <hr />
          <div className="space-y-4 p-5">
            <h2 className="text-xl font-extrabold mb-2">Reminder emails</h2>
            <p className="text-lg text-gray-600 mb-4">Stay updated on messages or matches you might have missed.</p>
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
            <h2 className="text-xl font-extrabold mb-2">Feature update emails</h2>
            <p className="text-lg text-gray-600 mb-4">Be the first to know about new features and app updates.</p>
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
            <h2 className="text-xl font-extrabold mb-2">Tips & Insights Emails</h2>
            <p className="text-lg text-gray-600 mb-4">Adjust the size of text across the app.</p>
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
            <h2 className="text-xl font-extrabold mb-2">Dating connection emails</h2>
            <p className="text-lg text-gray-600 mb-4">Change the Appearance of the app to reduce eye strain.</p>
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
            <h2 className="text-xl font-extrabold mb-2">Suggestions emails</h2>
            <p className="text-lg text-gray-600 mb-4">Discover recommend profiles and content based on your intrests and activity.</p>
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
          </div>
        </>
      )}
      {ispush && (
        <>
          <ArrowLeft className='inline mb-2' onClick={() => setispush(false)} />
          <h2 className="inline text-xl font-extrabold mb-6 ml-3">Push Notifications</h2>
          <hr />
          <div className="space-y-4 p-5">
            <h2 className="text-xl font-extrabold mb-2">New message notifications</h2>
            <p className="text-lg text-gray-600 mb-4">Recieve alerts when someone sends you a message.</p>
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
            <h2 className="text-xl font-extrabold mb-2">Trending Profiles</h2>
            <p className="text-lg text-gray-600 mb-4">Discover profiles getting a lot of attention.</p>
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
            <h2 className="text-xl font-extrabold mb-2">Exclusive drops and offers</h2>
            <p className="text-lg text-gray-600 mb-4">Get notified about premium content and limited-time offers.</p>
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
            <h2 className="text-xl font-extrabold mb-2">App news and annoucements</h2>
            <p className="text-lg text-gray-600 mb-4">Stay informed about updates and important news.</p>
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
            <h2 className="text-xl font-extrabold mb-2">Comment notifications </h2>
            <p className="text-lg text-gray-600 mb-4">Get notified when someone comments on your post or reply</p>
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
            <h2 className="text-xl font-extrabold mb-2">likes or replies on your comments</h2>
            <p className="text-lg text-gray-600 mb-4">Be alerted when someone likes a comment you made.</p>
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
            <h2 className="text-xl font-extrabold mb-2">Messages from dating </h2>
            <p className="text-lg text-gray-600 mb-4">Get notified when someone sends you a message through the dating feature.</p>
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
          </div>
        </>
      )}
    </div>
  )
}