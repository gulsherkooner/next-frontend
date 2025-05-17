import React, { useState } from "react";
import { ChevronDown, Eye, EyeOff, X } from "lucide-react";

const DateOfBirth = ({
  selectedMonth,
  setSelectedMonth,
  selectedDay,
  setSelectedDay,
  selectedYear,
  setSelectedYear,
}) => {
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isDayOpen, setIsDayOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);

  const months = [
    { value: "1", label: "Jan" },
    { value: "2", label: "Feb" },
    { value: "3", label: "Mar" },
    { value: "4", label: "Apr" },
    { value: "5", label: "May" },
    { value: "6", label: "Jun" },
    { value: "7", label: "Jul" },
    { value: "8", label: "Aug" },
    { value: "9", label: "Sep" },
    { value: "10", label: "Oct" },
    { value: "11", label: "Nov" },
    { value: "12", label: "Dec" },
  ];

  const generateDays = () => {
    return Array.from({ length: 31 }, (_, i) => {
      const day = i + 1;
      return { value: day.toString(), label: day.toString() };
    });
  };

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 100 }, (_, i) => {
      const year = currentYear - i;
      return { value: year.toString(), label: year.toString() };
    });
  };

  const days = generateDays();
  const years = generateYears();
  return (
    <div className="grid grid-cols-3 gap-2">
      {/* Month Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setIsMonthOpen(!isMonthOpen);
            setIsDayOpen(false);
            setIsYearOpen(false);
          }}
          className="flex items-center justify-between w-full px-4 py-2 bg-gray-200 rounded-lg "
        >
          <div className="flex flex-col justify-center items-start">
            <span>Month</span>
            <span className="font-semibold">{selectedMonth.label}</span>
          </div>
          <div className="flex items-center">
            <ChevronDown size={16} />
          </div>
        </button>

        {isMonthOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {months.map((month) => (
              <button
                key={month.value}
                type="button"
                onClick={() => {
                  setSelectedMonth(month);
                  setIsMonthOpen(false);
                }}
                className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                  selectedMonth.value === month.value ? "bg-gray-100" : ""
                }`}
              >
                {month.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Day Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setIsDayOpen(!isDayOpen);
            setIsMonthOpen(false);
            setIsYearOpen(false);
          }}
          className="flex items-center justify-between w-full px-4 py-2 bg-gray-200 rounded-lg"
        >
          <div className="flex flex-col justify-center items-start">
            <span>Day</span>
            <span className="mr-2 font-semibold">{selectedDay.label}</span>
          </div>
          <div className="flex items-center">
            <ChevronDown size={16} />
          </div>
        </button>

        {isDayOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {days.map((day) => (
              <button
                key={day.value}
                type="button"
                onClick={() => {
                  setSelectedDay(day);
                  setIsDayOpen(false);
                }}
                className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                  selectedDay.value === day.value && "bg-gray-100"
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Year Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setIsYearOpen(!isYearOpen);
            setIsMonthOpen(false);
            setIsDayOpen(false);
          }}
          className="flex items-center justify-between w-full px-4 py-2 bg-gray-200 rounded-lg"
        >
          <div className="flex flex-col justify-center items-start">
            <span>Year</span>
            <span className="mr-2 font-semibold">{selectedYear.label}</span>
          </div>
          <div className="flex items-center">
            <ChevronDown size={16} />
          </div>
        </button>

        {isYearOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {years.map((year) => (
              <button
                key={year.value}
                type="button"
                onClick={() => {
                  setSelectedYear(year);
                  setIsYearOpen(false);
                }}
                className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                  selectedYear.value === year.value && "bg-gray-100"
                }`}
              >
                {year.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DateOfBirth;
