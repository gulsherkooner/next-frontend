import { useState } from "react";
import { Wallet, ChevronRight } from "lucide-react";
import TransactionHistory from "./TransactionHistory";
import PaymentMethods from "./PaymentMethods";
import AddCardForm from "./AddCardForm";
import PaymentSelector from "./PaymentSelector"; // Import it
const WalletBox = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [amount, setAmount] = useState("");
  const [viewHistory, setViewHistory] = useState(false);
  const [viewPaymentoption, setViewPaymentOption] = useState(false);
  const [viewAddCard, setViewAddCard] = useState(false);
  const [viewPaymentSelector, setViewPaymentSelector] = useState(false);
  const handlePresetClick = (value) => {
    setAmount((prev) => (parseInt(prev || "0") + value).toString());
  };

  const handleProceed = () => {
    setViewPaymentSelector(true);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setAmount("");
  };

  if (viewHistory) {
    return <TransactionHistory onBack={() => setViewHistory(false)} />;
  }
  if (viewPaymentoption) {
    return (
      <PaymentMethods
        onBack={() => setViewPaymentOption(false)}
        onAddCard={() => {
          setViewPaymentOption(false);
          setViewAddCard(true); // Navigate to Add Card
        }}
      />
    );
  }
  if (viewAddCard) {
    return <AddCardForm onBack={() => {
      setViewAddCard(false);
      setViewPaymentOption(true); // Go back to payment screen
    }} />;
  }
  if (viewPaymentSelector) {
    return (
      <PaymentSelector
        amount={amount}
        onBack={() => {
          setViewPaymentSelector(false);
          setIsAdding(false);
          setAmount("");
        }}
      />
    );
  }
  return (
    <div className="flex-l justify-center items-center min-h-[60vh] px-4">
      <div className="bg-gray-200 p-6 md:p-8 shadow-lg text-left w-full max-w-md rounded-t-2xl">
        <Wallet className="inline mr-2 mb-2" />
        <h2 className="inline text-2xl font-bold text-gray-800">Wallet</h2>
        <p className="text-l font-semibold text-gray-600 mb-2">Available Balance</p>
        <h2 className="text-2xl font-bold text-gray-800">$32</h2>

        {isAdding ? (
          <div className="mt-4 space-y-2">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {[5, 10, 15, 20].map((val) => (
                <button
                  key={val}
                  onClick={() => handlePresetClick(val)}
                  className="bg-gray-100 border border-gray-300 text-gray-800 font-medium px-4 py-1.5 rounded-full hover:bg-gray-200 transition"
                >
                  + ${val}
                </button>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded-2xl bg-white text-gray-800 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleProceed}
                className="px-4 py-2 rounded-2xl bg-gray-400 text-white font-semibold hover:bg-gray-500 transition"
              >
                Proceed to payment
              </button>
            </div>
          </div>

        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="bg-white text-black font-bold px-6 py-2 mt-3 -mb-1.5 rounded-full hover:bg-gray-100 transition"
          >
            + Add Balance
          </button>
        )}
      </div>

      <div
        className="flex justify-between items-center bg-gray-200 p-6 md:p-7 border-t border-gray-500 text-left w-full max-w-md cursor-pointer"
        onClick={() => setViewHistory(true)}
      >
        <span className="text-l font-bold text-gray-800">Transaction history</span>
        <ChevronRight className="w-5 h-5" />
      </div>

      <div className="flex justify-between items-center bg-gray-200 p-6 md:p-7 border-t border-gray-500 text-left w-full max-w-md cursor-pointer rounded-b-2xl"
        onClick={() => setViewPaymentOption(true)}>
        <span className="text-l font-bold text-gray-800">Payment methods</span>
        <ChevronRight className="w-5 h-5" />
      </div>
    </div>
  );
};

export default WalletBox;
