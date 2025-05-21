import { useEffect, useState } from "react";
import { Wallet, ChevronRight } from "lucide-react";
import TransactionHistory from "./TransactionHistory";
import PaymentMethods from "./PaymentMethods";
import AddCardForm from "./AddCardForm";
import PaymentSelector from "./PaymentSelector";

const WalletBox = () => {
  const [balance, setBalance] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [amount, setAmount] = useState("");
  const [viewHistory, setViewHistory] = useState(false);
  const [viewPaymentoption, setViewPaymentOption] = useState(false);
  const [viewAddCard, setViewAddCard] = useState(false);
  const [viewPaymentSelector, setViewPaymentSelector] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserId(localStorage.getItem("userId"));
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchWallet = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/wallet/${userId}`);
      const data = await res.json();
      if (data && data.balance !== undefined) setBalance(data.balance);
    };

    fetchWallet();
  }, [userId]);

  const handlePresetClick = (value) => {
    setAmount((prev) => (parseInt(prev || "0") + value).toString());
  };

  const handleCancel = () => {
    setIsAdding(false);
    setAmount("");
  };

  if (viewHistory) return <TransactionHistory onBack={() => setViewHistory(false)} />;
  if (viewPaymentoption) {
    return (
      <PaymentMethods
        onBack={() => setViewPaymentOption(false)}
        onAddCard={() => {
          setViewPaymentOption(false);
          setViewAddCard(true);
        }}
      />
    );
  }

  if (viewAddCard) {
    return (
      <AddCardForm
        onBack={() => {
          setViewAddCard(false);
          setViewPaymentOption(true);
        }}
      />
    );
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
        onTopUpComplete={(newBalance) => setBalance(newBalance)}
      />
    );
  }

  return (
    <div className="flex flex-col items-center w-full px-4 md:px-6 lg:px-8 max-w-3xl mx-auto space-y-4">
      <div className="w-full bg-gray-200 rounded-2xl shadow-md overflow-hidden">
        <div className="p-6 md:p-8">
          <Wallet className="inline mr-2 mb-2" />
          <h2 className="inline text-2xl font-bold text-gray-800">Wallet</h2>
          <p className="text-l font-semibold text-gray-600 mt-1">Available Balance</p>
          <h2 className="text-2xl font-bold text-gray-800">${balance}</h2>

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
                  onClick={() => setViewPaymentSelector(true)}
                  className="px-4 py-2 rounded-2xl bg-gray-500 text-white font-semibold hover:bg-gray-600 transition"
                >
                  Proceed to payment
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="bg-white text-black font-bold px-6 py-2 mt-3 rounded-full hover:bg-gray-100 transition"
            >
              + Add Balance
            </button>
          )}
        </div>

        <div
          className="flex justify-between items-center p-6 border-t border-gray-300 cursor-pointer hover:bg-gray-100 transition"
          onClick={() => setViewHistory(true)}
        >
          <span className="text-l font-bold text-gray-800">Transaction history</span>
          <ChevronRight className="w-5 h-5" />
        </div>

        <div
          className="flex justify-between items-center p-6 border-t border-gray-300 cursor-pointer hover:bg-gray-100 transition"
          onClick={() => setViewPaymentOption(true)}
        >
          <span className="text-l font-bold text-gray-800">Payment methods</span>
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

export default WalletBox;
