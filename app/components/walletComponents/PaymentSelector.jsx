import React, { useState } from "react";
import SuccessMessage from "./SuccessMessage";
import { getCookie } from "../../lib/utils/cookie";

export default function PaymentSelector({ amount, onBack, onTopUpComplete }) {
  const [selected, setSelected] = useState("googlepay");
  const [paymentDone, setPaymentDone] = useState(false);
  const [newBalance, setNewBalance] = useState(0);

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

  const handleAddMoney = async () => {
    const accessToken = getCookie("accessToken");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/date/wallet/topup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        amount: parseFloat(amount),
        method: selected,
      }),
    });

    const data = await res.json();
    if (data?.balance !== undefined) {
      onTopUpComplete(data.balance);
      setNewBalance(parseFloat(data.balance));
    }
    setPaymentDone(true);
  };

  if (paymentDone) {
    return (
      <SuccessMessage
        amountAdded={amount}
        newBalance={newBalance}
        onDone={onBack}
      />
    );
  }

  const renderOption = ({ id, label, icon }) => (
    <label
      key={id}
      className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all
        ${selected === id ? "border-teal-500 bg-teal-50" : "border-gray-200 bg-white hover:bg-gray-50"}`}
      onClick={() => setSelected(id)}
    >
      <div className="flex items-center gap-3">
        <img src={icon} className="h-7 w-7 rounded-full shadow" alt={label} />
        <span className="text-sm font-medium text-gray-800">{label}</span>
      </div>
      <div
        className={`w-4 h-4 rounded-full border-2 ${selected === id ? "bg-teal-500 border-teal-500" : "border-gray-300"}`}
      ></div>
    </label>
  );

  return (
    <div className="w-full max-w-xl mx-auto bg-gray-100 shadow-lg rounded-2xl p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-800">Select Payment Method</h2>
        <p className="text-sm text-gray-600 mt-1">
          You're adding <span className="font-bold text-teal-600">${amount}</span> to your wallet
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold text-gray-700"> Preferred</p>
        {payments.preferred.map(renderOption)}
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold text-gray-700">Credit & Debit Cards</p>
        <div className="space-y-2">{payments.cards.map(renderOption)}</div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold text-gray-700">Net Banking</p>
        <div className="space-y-2">{payments.netbanking.map(renderOption)}</div>
      </div>

      <div className="flex justify-between gap-4 pt-6">
        <button
          onClick={onBack}
          className="flex-1 px-4 py-2 rounded-xl border border-gray-400 text-gray-700 hover:bg-gray-100 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleAddMoney}
          className="flex-1 px-4 py-2 rounded-xl bg-teal-500 text-white font-medium hover:bg-teal-600 transition"
        >
          Add Money
        </button>
      </div>
    </div>
  );
}