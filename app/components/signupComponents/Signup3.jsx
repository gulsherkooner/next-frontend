import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";

const Signup3 = ({ userData, setUserData, setPage }) => {
  const [error, setError] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleNext = () => {
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(userData.password)) {
      setError(
        "Password must be at least 8 characters long and include at least one letter, one number, and one special character."
      );
    } else {
      setError("");
      setPage(4);
    }
  };

  return (
    <div className="bg-[#eeeeee] p-8 rounded-lg max-w-md w-full aspect-square flex flex-col justify-between">
      <div className="space-y-1">
        <div className="">
          <ArrowLeft size={20} onClick={() => setPage(2)} />
        </div>
        <div className="mt-5">
          <h1 className="text-xl font-bold text-[#121212]">
            Please set yout passowrd
          </h1>
          <p className="text-gray-600 text-sm mb-2">
            Create a secure password to protect your account.
          </p>
        </div>

        <div>
          <label htmlFor="password" className="text-[#121212] text-sm">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={userData.password}
              onChange={(e) =>
                setUserData({ ...userData, password: e.target.value })
              }
              className="flex h-10 w-full text-sm bg-[#fdfdfd] rounded-md border px-3 py-2 border-[#bababa] placeholder:text-sm text-[#121212] focus:ring-2 focus:ring-offset-2 focus:outline-none"
              placeholder="Enter your password"
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
      </div>

      <div className="mt-8">
        <p className="text-gray-600 text-sm mb-2">
          By signing up, you agree to our Terms of Service and Privacy Policy.
          We may use your contact details to keep your account safe and
          personalise your experience, including showing relevant ads. You can
          also control if others can find you using your email or phone number.
        </p>
        <button
          onClick={() => handleNext()}
          className="w-full py-2 rounded-md text-sm bg-[#bababa] text-[#fafafa] hover:bg-[#fdfdfd] hover:text-[#5a5a5a] cursor-pointer border border-[#bababa]"
        >
          Create account
        </button>
        <p className="text-red-600 text-sm mb-2">{error}</p>
      </div>
    </div>
  );
};

export default Signup3;
