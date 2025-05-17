import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";

const Signup5 = ({ userData, setUserData, setPage, onSave, userError }) => {
  const [error, setError] = useState();

  const handleNext = () => {
    const usernameRegex = /^[a-zA-Z0-9._]{3,20}$/;

    if (!usernameRegex.test(userData.username)) {
      setError(
        "Username must be 3-20 characters long and can only contain letters, numbers, dots, and underscores."
      );
    } else {
      setError("");
      onSave();
    }
  };

  return (
    <div className="bg-[#eeeeee] p-8 rounded-lg max-w-md w-full aspect-square flex flex-col justify-between">
      <div className="space-y-1">
        <div className="">
          <ArrowLeft size={20} onClick={()=>setPage(4)} />
        </div>
        <div className="mt-5">
          <h1 className="text-xl font-bold text-[#121212]">
            What should we call you
          </h1>
          <p className="text-gray-600 text-sm mb-2">
            Tell us your name or a username you’d like to use. This is how
            others will see you on the platform!
          </p>
        </div>

        <div>
          <label htmlFor="password" className="text-[#121212] text-sm">
            Username
          </label>
          <div className="relative">
            <input
              id="password"
              type="text"
              value={userData.username}
              onChange={(e) =>
                setUserData({ ...userData, username: e.target.value })
              }
              className="flex h-10 w-full text-sm bg-[#fdfdfd] rounded-md border px-3 py-2 border-[#bababa] placeholder:text-sm text-[#121212] focus:ring-2 focus:ring-offset-2 focus:outline-none"
              placeholder="Enter your username"
              required
            />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <p className="text-gray-600 text-sm mb-2">
          Click Submit to create your account...
        </p>
        <button
          onClick={() => handleNext()}
          className="w-full py-2 rounded-md text-sm bg-[#bababa] text-[#fafafa] hover:bg-[#fdfdfd] hover:text-[#5a5a5a] cursor-pointer border border-[#bababa]"
        >
          Submit
        </button>
        <p className="text-gray-600 text-sm mb-2">
          {error && error}
        </p>
        <p className="text-gray-600 text-sm mb-2">
          {userError && userError}
        </p>
      </div>
    </div>
  );
};

export default Signup5;
