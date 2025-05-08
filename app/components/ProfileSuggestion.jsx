import React from "react";

const ProfileItem = ({ username, followers, onFollow }) => {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        <div className="ml-2">
          <div className="font-medium text-sm">{username}</div>
          <div className="text-xs text-gray-500">{followers} Followers</div>
        </div>
      </div>
      <button 
        onClick={onFollow}
        className="px-4 py-1 text-xs font-medium text-blue-600 hover:text-blue-800"
      >
        Follow
      </button>
    </div>
  );
};

const ProfileSuggestion = ({ title, profiles }) => {
  const handleFollow = () => {
    console.log("Followed profile");
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <h2 className="font-medium text-lg mb-3">{title}</h2>
      <div className="divide-y divide-gray-100">
        {profiles.map((profile, index) => (
          <ProfileItem 
            key={index}
            username={profile.username}
            followers={profile.followers}
            onFollow={handleFollow}
          />
        ))}
      </div>
      {profiles.length > 4 && (
        <button className="w-full text-center py-2 text-sm text-gray-500 hover:text-gray-700 mt-2">
          Show more
        </button>
      )}
    </div>
  );
};

export default ProfileSuggestion;