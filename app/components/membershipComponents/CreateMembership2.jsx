import React, { useEffect, useState, useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import CountryDropdown from "./CountryDropdown";
import PriceDropdown from "./PriceDropdown";
import PayPerViewDropdown from "./PayPerViewDropdown";
import axios from "axios";

const CreateMembership2 = ({
  setCreateMemberBox,
  setSubscription,
  subscription,
  countryCurrencyMap,
  rates
}) => {
  const [selectedCountry, setSelectedCountry] = useState("US");
  const [selectedPrice, setSelectedPrice] = useState(12.99);
  const [payPerViewPrice, setPayPerViewPrice] = useState(5.0);

  const currentCurrency = useMemo(
    () => countryCurrencyMap[selectedCountry] || countryCurrencyMap["US"],
    [selectedCountry]
  );
  const rate =
    currentCurrency && rates && rates[currentCurrency.currency] !== undefined
      ? rates[currentCurrency.currency]
      : 1;

  const convertedPrice = useMemo(
    () => (selectedPrice * rate).toFixed(2),
    [selectedPrice, rate]
  );
  const convertedPayPerView = useMemo(
    () => (payPerViewPrice * rate).toFixed(2),
    [payPerViewPrice, rate]
  );
  const earningsAfterFees = useMemo(
    () => (convertedPrice * 0.9).toFixed(2),
    [convertedPrice]
  );

  const handleNext = () => {
    setSubscription({
      ...subscription,
      MonthlyPrice: selectedPrice,
      country: selectedCountry,
      payPerViewPrice: payPerViewPrice,
    });
    setCreateMemberBox(3);
  };

  return (
    <div className="flex-1 min-h-0 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="space-y-4">
          {/* Step 1 */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                Step 1: Set Your Monthly Price
              </h2>
              <p className="text-md md:text-lg text-gray-600 leading-relaxed max-w-3xl">
                Choose a monthly price that reflects your content's value and
                the perks you offer. You can also set a Pay-Per-View price for
                those who want to view individual posts.
              </p>
            </div>

            {/* Pricing Controls */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-4">
              <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
                Set Monthly Price
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Country Selection */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <CountryDropdown
                    selectedCountry={selectedCountry}
                    onCountryChange={setSelectedCountry}
                    currency={currentCurrency}
                  />
                </div>

                {/* Price Selection */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Monthly Price
                  </label>
                  <PriceDropdown
                    selectedPrice={selectedPrice}
                    onPriceChange={setSelectedPrice}
                    currency={{ ...currentCurrency, rate }}
                    convertedPrice={convertedPrice}
                  />
                </div>
              </div>

              {/* Important Note */}
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <div className="text-sm text-blue-800">
                  <span className="font-medium">Important Note</span> - After
                  fees, you'll receive 90% of each subscription payment. For
                  example, at {currentCurrency.symbol}
                  {convertedPrice}/month, you earn {currentCurrency.symbol}
                  {earningsAfterFees} per subscriber, which will be transferred
                  to your wallet.
                </div>
              </div>
            </div>
          </div>

          {/* Pay Per View Section */}
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4 space-y-4">
              <h3 className="text-xl md:text-2xl font-semibold text-gray-900">
                Set Pay Per View Price
              </h3>

              <div className="">
                <PayPerViewDropdown
                  payPerViewPrice={payPerViewPrice}
                  onPriceChange={setPayPerViewPrice}
                  currency={{ ...currentCurrency, rate }}
                  convertedPrice={convertedPayPerView}
                />
              </div>

              {/* Important Note */}
              <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <div className="w-5 h-5 rounded-full bg-amber-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <div className="text-sm text-amber-800">
                  <span className="font-medium">Important Note</span> - While
                  uploading a specific post or video, you have the option to
                  override this default price and set a unique Pay-Per-View
                  price for that post.
                </div>
              </div>
            </div>
          </div>

          {/* Next Button */}
          <div className="flex justify-start gap-3">
            <button
              onClick={() => setCreateMemberBox(1)}
              className="bg-gray-100 hover:bg-gray-200 font-semibold px-6 py-2 rounded-full text-md md:text-lg transition-colors duration-200 "
            >
              Back
            </button>
            <button
              onClick={() => handleNext()}
              className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-6 py-2 rounded-full text-md md:text-lg transition-colors duration-200 "
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateMembership2;
