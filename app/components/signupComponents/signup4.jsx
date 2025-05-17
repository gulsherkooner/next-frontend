import { ArrowLeft, Camera, Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";

const Signup4 = ({ userData, setUserData, setPage }) => {

  const handleNext = () => {
    setPage(5);
  }

  return (
    <div className="bg-[#eeeeee] p-8 rounded-lg max-w-md w-full aspect-square flex flex-col justify-between">
      <div className="space-y-1">
        <div className="">
          <ArrowLeft size={20} onClick={()=>setPage(3)} />
        </div>
        <div className="mt-5">
          <h1 className="text-xl font-bold text-[#121212]">
            Pick a profile picture
          </h1>
          <p className="text-gray-600 text-sm mb-2">
            Choose a photo that represents you best. You can always change it later!
          </p>
        </div>
      </div>

      <div className="flex justify-center items-center">
        <div className="w-40 h-40 bg-gray-200 rounded-full flex justify-center items-center">
          <Camera size={30} />
        </div>
      </div>

      <div className="mt-8">
        <button
          onClick={()=> handleNext()}
          className="w-full py-2 rounded-md text-sm bg-[#bababa] text-[#fafafa] hover:bg-[#fdfdfd] hover:text-[#5a5a5a] cursor-pointer border border-[#bababa]"
        >
          SKIP!
        </button>
      </div>
    </div>
  );
};

export default Signup4;
