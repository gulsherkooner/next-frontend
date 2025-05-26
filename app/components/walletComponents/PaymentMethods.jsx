import { CreditCard, PlusCircle } from "lucide-react";
import { useState } from "react";
const PaymentMethods = ({ onBack, onAddCard }) => {
  const [selected, setSelected] = useState("Google Pay");
  const creditCards = [
    { name: "Apple Pay", icon: "/icons/apple-pay.svg" },
    { name: "Mastercard....6854", icon: "/icons/mastercard.svg" },
    { name: "Visa....2463", icon: "/icons/visa.svg" },
  ];

  const netBanking = [
    { name: "WhatsAppPay", icon: "/icons/whatsapp.svg" },
    { name: "Amazon Pay", icon: "/icons/amazonpay.svg" },
    { name: "Paytm", icon: "/icons/paytm.svg" },
    { name: "Google Pay", icon: "/icons/googlepay.svg" },
  ];

  return (
    <div className="bg-gray-200 p-6 rounded-2xl space-y-6 md:-ml-20">
      <h2 className="text-xl font-bold text-gray-800">Payment methods</h2>

      {/* Credit & Debit cards */}
      <div>
        <h3 className="text-md font-semibold text-gray-700 mb-2">
          Credit & Debit cards
        </h3>
        <div className="space-y-2">
          {creditCards.map((card) => (
            <div
              key={card.name}
              className={`flex items-center justify-between p-3 bg-white rounded-md hover:bg-gray-100 cursor-pointer ${selected === card.name ? "ring-2 ring-gray-400" : ""
                }`}
              onClick={() => setSelected(card.name)}
            >
              <div className="flex items-center gap-3">
                <img src={card.icon} alt={card.name} className="h-6 w-6" />
                <span className="text-gray-800 font-medium">{card.name}</span>
              </div>
              <input
                type="checkbox"
                checked={selected === card.name}
                readOnly
                className="form-checkbox accent-black"
              />
            </div>
          ))}
          <button
            className="flex items-center text-sm text-black font-semibold mt-1 hover:underline"
            onClick={onAddCard}
          >
            <CreditCard className="mr-1 w-4 h-4" />
            Add Card
          </button>
        </div>
      </div>

      <hr className="border-gray-400" />

      {/* Net banking */}
      <div>
        <h3 className="text-md font-semibold text-gray-700 mb-2">
          Net banking
        </h3>
        <div className="space-y-2">
          {netBanking.map((method) => (
            <div
              key={method.name}
              className={`flex items-center justify-between p-3 bg-white rounded-md hover:bg-gray-100 cursor-pointer ${selected === method.name ? "ring-2 ring-gray-400" : ""
                }`}
              onClick={() => setSelected(method.name)}
            >
              <div className="flex items-center gap-3">
                <img src={method.icon} alt={method.name} className="h-6 w-6" />
                <span className="text-gray-800 font-medium">
                  {method.name}
                </span>
              </div>
              <input
                type="checkbox"
                checked={selected === method.name}
                readOnly
                className="form-checkbox accent-black"
              />
            </div>
          ))}
          <button className="flex items-center text-sm text-black font-semibold mt-1 hover:underline">
            <PlusCircle className="mr-1 w-4 h-4" />
            Add Net Banking Options
          </button>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          className="px-4 py-2 text-sm font-medium text-black bg-white rounded-md hover:bg-gray-300"
          onClick={onBack}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-black"
          onClick={onBack}
        >
          Done
        </button>
      </div>

    </div>
  );
};

export default PaymentMethods;
