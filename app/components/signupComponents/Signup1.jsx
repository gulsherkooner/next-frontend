import React, { useState } from "react";
import DateOfBirth from "./DateOfBirth";
import { Eye, EyeOff, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { sendOTP } from "../../features/auth/authSlice";
import {Riple} from "react-loading-indicators"

const Signup1 = ({ userData, setUserData, setPage, setOTP }) => {
  const [error, setError] = useState();
  const [selectedMonth, setSelectedMonth] = useState({
    value: "12",
    label: "Dec",
  });
  const [selectedDay, setSelectedDay] = useState({ value: "2", label: "2" });
  const [selectedYear, setSelectedYear] = useState({
    value: "1984",
    label: "1984",
  });
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleNext = async() => {
    const nameRegex = /^[a-zA-Z0-9\s]+$/; // Only allows letters and spaces
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email validation regex
    const currentYear = new Date().getFullYear(); // Get the current year

    if (!userData.name) {
      setError("Name is required.");
    } else if (!nameRegex.test(userData.name)) {
      setError("Name should only contain letters and spaces.");
    } else if (userData.name.length > 50) {
      setError("Name should be less than 50 characters.");
    } else if (!userData.email) {
      setError("Email is required.");
    } else if (!emailRegex.test(userData.email)) {
      setError("Please enter a valid email address.");
    } else if (userData.email.length > 50) {
      setError("Email should be less than 50 characters.");
    } else if (currentYear - selectedYear.value < 16) {
      setError("You must be more than 16 years old to use this application.");
    } else {
      setLoading(true)
      setUserData({
        ...userData,
        DOB: `${selectedDay.value
          .toString()
          .padStart(2, "0")}-${selectedMonth.value
          .toString()
          .padStart(2, "0")}-${selectedYear.value}`,
      });
      setError("");
      const data = await dispatch(sendOTP(userData.email));
      setOTP(data?.payload?.verificationCode);
      setLoading(false)
      setPage(2);
    }
  };

  return (
    <div className="bg-[#eeeeee] p-8 rounded-lg max-w-md w-full aspect-square flex flex-col justify-between">
      <div className="space-y-1">
        <div className="">
          <X size={20} onClick={() => router.back()} />
        </div>
        <div className="mt-5">
          <h1 className="text-xl font-bold mb-2 text-[#121212]">
            Create your account
          </h1>
        </div>

        <div>
          <label htmlFor="name" className="text-[#121212] text-sm">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={userData.name}
            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
            className="flex h-10 w-full text-sm bg-[#fdfdfd] rounded-md border px-3 py-2 border-[#bababa] placeholder:text-sm text-[#121212] focus:ring-2 focus:ring-offset-2 focus:outline-none"
            placeholder="Enter your Full Name"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="text-[#121212] text-sm">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={userData.email}
            onChange={(e) =>
              setUserData({ ...userData, email: e.target.value })
            }
            className="flex h-10 w-full text-sm bg-[#fdfdfd] rounded-md border px-3 py-2 border-[#bababa] placeholder:text-sm text-[#121212] focus:ring-2 focus:ring-offset-2 focus:outline-none"
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="mt-6">
          <label className="block font-medium">Enter your date of birth</label>
          <p className="text-gray-600 text-sm mt-1 mb-2">
            This will not be shown publicly. Confirm your own age, even if this
            account is for a business, or entertainment.
          </p>
          <DateOfBirth
            selectedDay={selectedDay}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            setSelectedDay={setSelectedDay}
            setSelectedMonth={setSelectedMonth}
            setSelectedYear={setSelectedYear}
          />
        </div>
      </div>

      <div className="mt-8">
        <button
          onClick={() => handleNext()}
          className="w-full py-2 rounded-md text-sm bg-[#bababa] text-[#fafafa] hover:bg-[#fdfdfd] hover:text-[#5a5a5a] cursor-pointer border border-[#bababa]"
        >
          {loading ? <Riple color="#32cd32" size="small" text="" textColor="" /> : "Next"}
        </button>
        <p className="text-red-600 text-sm mb-2">{error && error}</p>
      </div>
    </div>
  );
};

export default Signup1;
