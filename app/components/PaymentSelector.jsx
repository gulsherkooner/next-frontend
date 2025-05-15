import { useState } from "react";
import SuccessMessage from "./SuccessMessage";

export default function PaymentSelector({ amount, onBack }) {
  const [selected, setSelected] = useState("googlepay");
  const [paymentDone, setPaymentDone] = useState(false);

  const payments = {
    preferred: [
      { id: "googlepay", label: "Google Pay", icon: "/icons/googlepay.svg" },
    ],
    cards: [
      { id: "applepay", label: "Apple Pay", icon: "/icons/apple-pay.svg" },
      { id: "mastercard", label: "Mastercard...4854", icon: "/icons/mastercard.svg" },
      { id: "visa", label: "Visa...2463", icon: "/icons/visa.svg" },
    ],
    netbanking: [
      { id: "whatsapp", label: "WhatsAppPay", icon: "/icons/whatsapp.svg" },
      { id: "amazon", label: "Amazon Pay", icon: "/icons/amazonpay.svg" },
      { id: "paytm", label: "Paytm", icon: "/icons/paytm.svg" },
    ],
  };

  if (paymentDone) {
    return (
      <SuccessMessage
        amountAdded={amount}
        newBalance={32 + parseFloat(amount)}
        onDone={onBack} // optional: goes back to wallet on Done
      />
    );
  }

  const renderOption = ({ id, label, icon }) => (
    <label
      key={id}
      className={`flex items-center justify-between border p-3 rounded-md cursor-pointer ${selected === id ? "border-gray-800" : "border-gray-300"
        }`}
    >
      <div className="flex items-center gap-2">
        <img src={icon} className="h-6 w-6" alt={`${label} icon`} />
        <span className="font-medium">{label}</span>
      </div>
      <input
        type="checkbox"
        checked={selected === id}
        onChange={() => setSelected(id)}
        className="form-checkbox h-5 w-5 text-gray-600"
      />
    </label>
  );

  return (
    <div className="w-full max-w-md mx-auto bg-white shadow-md rounded-xl p-5 space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Select payment</h2>
        <p className="text-sm text-gray-600">Amount to add: ${amount}</p>
      </div>

      <div>
        <p className="text-sm font-semibold mb-2">Preferred Payment</p>
        {payments.preferred.map(renderOption)}
      </div>

      <div>
        <p className="text-sm font-semibold mb-2">Credit & Debit cards</p>
        <div className="space-y-2">
          {payments.cards.map(renderOption)}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold mb-2">Net banking</p>
        <div className="space-y-2">
          {payments.netbanking.map(renderOption)}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          className="px-4 py-2 rounded-2xl border border-gray-400 text-gray-700 hover:bg-gray-100"
          onClick={onBack}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 rounded-2xl bg-gray-400 text-white hover:bg-gray-700"
          onClick={() => setPaymentDone(true)} // ✅ Corrected
        >
          Add money
        </button>
      </div>
    </div>
  );
}
