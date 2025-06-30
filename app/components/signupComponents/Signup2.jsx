import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";

const Signup2 = ({ userData, setUserData, setPage, OTP, setOTP }) => {
  const [error, setError] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [code, setCode] = useState();

  const handleNext = () => {
    const otpRegex = /^\d{6}$/;

    if (!otpRegex.test(code)) {
      setError("OTP must be a 6-digit number.");
    } else if (code !== OTP) {
      setError(
        "Code did not match, Please check your mail for Verification Code"
      );
    } else {
      setOTP(null);
      setError("");
      setPage(3);
    }
  };

  return (
    <div className="bg-[#eeeeee] p-8 rounded-lg max-w-md w-full aspect-square flex flex-col justify-between">
      <p>{OTP}</p>
      <div className="space-y-1">
        <div className="">
          <ArrowLeft size={20} onClick={() => setPage(1)} />
        </div>
        <div className="mt-5">
          <h1 className="text-xl font-bold text-[#121212]">Verify code</h1>
          <p className="text-gray-600 text-sm mb-2">
            Enter it below to verify {userData.email}
          </p>
        </div>

        <div>
          <label htmlFor="otp" className="text-[#121212] text-sm">
            Verification Code
          </label>
          <div className="relative">
            <input
              id="otp"
              type={showPassword ? "text" : "password"}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex h-10 w-full text-sm bg-[#fdfdfd] rounded-md border px-3 py-2 border-[#bababa] placeholder:text-sm text-[#121212] focus:ring-2 focus:ring-offset-2 focus:outline-none"
              placeholder="Enter verification code"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-custom-secondary-text"
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-2">Didn&#x27;t receive email?</p>
      </div>

      <div className="mt-8">
        <p className="text-gray-600 text-sm mb-2">
          Please check in spam section of your mail if you did not see it in
          your inbox!
        </p>
        <button
          onClick={() => handleNext()}
          className="w-full py-2 rounded-md text-sm bg-[#bababa] text-[#fafafa] hover:bg-[#fdfdfd] hover:text-[#5a5a5a] cursor-pointer border border-[#bababa]"
        >
          Next
        </button>
        <p className="text-red-600 text-sm mb-2">{error}</p>
      </div>
    </div>
  );
};

export default Signup2;
