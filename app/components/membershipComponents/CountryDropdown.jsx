import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import CountryFlag from "react-country-flag";

const CountryDropdown = ({ selectedCountry, onCountryChange, currency }) => {
  const [isOpen, setIsOpen] = useState(false);

  const countries = [
    { code: "US", name: "United States" },
    { code: "GB", name: "United Kingdom" },
    { code: "EU", name: "European Union" },
    { code: "CA", name: "Canada" },
    { code: "AU", name: "Australia" },
    { code: "JP", name: "Japan" },
    { code: "IN", name: "India" },
  ];

  const selectedCountryData = countries.find(
    (country) => country.code === selectedCountry
  );

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
      >
        <div className="flex items-center gap-3">
          <div className="rounded-full h-5 w-6 flex items-center justify-center overflow-hidden">
            <CountryFlag
              countryCode={selectedCountryData?.code}
              svg
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
              className="w-full h-full"
            />
          </div>
          <span className="font-medium text-gray-900">
            {selectedCountryData?.name}
          </span>
          <span className="text-gray-500">({currency.currency})</span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {countries.map((country) => (
            <button
              key={country.code}
              onClick={() => {
                onCountryChange(country.code);
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3"
            >
              <div className="rounded-full h-5 w-6 flex items-center justify-center overflow-hidden">
                <CountryFlag
                  countryCode={country.code}
                  svg
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                  className="w-full h-full"
                />
              </div>
              <span className="font-medium text-gray-900">{country.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CountryDropdown;
