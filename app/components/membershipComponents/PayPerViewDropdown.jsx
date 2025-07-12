import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const PayPerViewDropdown = ({ payPerViewPrice, onPriceChange, currency = {}, convertedPrice }) => {
  const [isOpen, setIsOpen] = useState(false);

  const basePrices = [
    { value: 1.99, label: 'Low' },
    { value: 2.99, label: 'Budget' },
    { value: 5.00, label: 'Default' },
    { value: 7.99, label: 'Standard' },
    { value: 9.99, label: 'Premium' },
    { value: 14.99, label: 'High Value' },
  ];

  const selectedPriceData = basePrices.find(price => price.value === payPerViewPrice);

  // Fallbacks for currency
  const symbol = currency.symbol || "$";
  const rate = currency.rate !== undefined ? currency.rate : 1;

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Pay Per View Price
      </label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
      >
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900">
            {symbol}{!isNaN(Number(convertedPrice)) ? convertedPrice : (payPerViewPrice * rate).toFixed(2)}
          </span>
          <span className="text-gray-500">- {selectedPriceData?.label}</span>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
          {basePrices.map((price) => {
            const convertedAmount = (price.value * rate).toFixed(2);
            return (
              <button
                key={price.value}
                onClick={() => {
                  onPriceChange(price.value);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-2"
              >
                <span className="font-medium text-gray-900">
                  {symbol}{convertedAmount}
                </span>
                <span className="text-gray-500">- {price.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PayPerViewDropdown;