import React, { useState } from "react";
import { ArrowLeft, BadgeCheck } from "lucide-react";
import CountryDropdown from "./CountryDropdown";
import PriceDropdown from "./PriceDropdown";
import PayPerViewDropdown from "./PayPerViewDropdown";
const CreateMembership1 = ({ setCreateMemberBox }) => {
  const [selectedCountry, setSelectedCountry] = useState("US");
  const [selectedPrice, setSelectedPrice] = useState(12.99);
  const [payPerViewPrice, setPayPerViewPrice] = useState(5.0);

  // Currency mapping based on country
  const countryCurrencyMap = {
    US: { currency: "USD", symbol: "$", rate: 1 },
    GB: { currency: "GBP", symbol: "£", rate: 0.79 },
    EU: { currency: "EUR", symbol: "€", rate: 0.85 },
    CA: { currency: "CAD", symbol: "C$", rate: 1.25 },
    AU: { currency: "AUD", symbol: "A$", rate: 1.35 },
    JP: { currency: "JPY", symbol: "¥", rate: 110 },
    IN: { currency: "INR", symbol: "₹", rate: 75 },
  };

  const currentCurrency = countryCurrencyMap[selectedCountry];
  const convertedPrice = (selectedPrice * currentCurrency.rate).toFixed(2);
  const convertedPayPerView = (payPerViewPrice * currentCurrency.rate).toFixed(
    2
  );
  const earningsAfterFees = (convertedPrice * 0.9).toFixed(2);

  return (
    <div className="flex-1 min-h-0 overflow-y-auto">
      <div className="max-w-4xl mx-auto md:p-8 p-4">
        <div className="space-y-4">
          {/* Step 1 */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                Give your audience exclusive access to premium posts and perks.
              </h2>
              <p className="text-md md:text-lg text-gray-600 leading-relaxed max-w-3xl">
                Enable memberships on your channel to build a closer connection
                with followers and get rewarded for your content.
              </p>
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                Eligibility Requirements
              </h2>
              <p className="text-md md:text-lg text-gray-600 leading-relaxed max-w-3xl">
                &emsp;•&ensp;Your account must be at least 30 days old
              </p>
              <p className="text-md md:text-lg text-gray-600 leading-relaxed max-w-3xl">
                &emsp;•&ensp;You must have an active profile with a display
                picture and name
              </p>
              <p className="text-md md:text-lg text-gray-600 leading-relaxed max-w-3xl">
                &emsp;•&ensp;You must have at least one post in the past 30 days
              </p>
              <p className="text-md md:text-lg text-gray-600 leading-relaxed max-w-3xl">
                &emsp;•&ensp;You must have a verified phone number
              </p>
            </div>
            {/* Important Note */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <div className="text-sm text-blue-800">
                <span className="font-medium">Important Note</span> - Once you
                set a subscription price, any changes will only apply to new
                subscribers. Existing subscribers will continue to be charged
                the original price unless they cancel and re-subscribe.
              </div>
            </div>
          </div>

          {/* Next Button */}
          <div className="flex justify-start">
            <button
              onClick={() => setCreateMemberBox(2)}
              className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-6 py-2 rounded-full text-lg transition-colors duration-200 min-w-[200px]"
            >
              Set Up Membership
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateMembership1;
