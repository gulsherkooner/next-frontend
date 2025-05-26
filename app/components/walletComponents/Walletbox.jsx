import { useEffect, useState } from "react";
import { Wallet, ChevronRight, PlusCircle } from "lucide-react";
import TransactionHistory from "./TransactionHistory";
import PaymentMethods from "./PaymentMethods";
import AddCardForm from "./AddCardForm";
import PaymentSelector from "./PaymentSelector";
import { getCookie } from "../../lib/utils/cookie";
import SuccessMessage from "./SuccessMessage";

const WalletBox = () => {
  const [balance, setBalance] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [amount, setAmount] = useState("");
  const [viewHistory, setViewHistory] = useState(false);
  const [viewPaymentoption, setViewPaymentOption] = useState(false);
  const [viewAddCard, setViewAddCard] = useState(false);
  const [viewPaymentSelector, setViewPaymentSelector] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isSelectAccount, setselectAccount] = useState(false);
  const [withdrawConfirmed, setWithdrawConfirmed] = useState(false);
  const [userId, setUserId] = useState(null);
  const [lastWithdrawAmount, setLastWithdrawAmount] = useState("");
  const [selected, setSelected] = useState("Google Pay");

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

  const handleWithdraw = async () => {
    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      alert("Enter a valid amount.");
      return;
    }
    if (withdrawAmount > balance) {
      alert("Insufficient balance.");
      return;
    }

    const accessToken = getCookie("accessToken");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/wallet/deduct`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          amount: withdrawAmount,
          purpose: "Wallet Withdrawal",
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setBalance((prev) => prev - withdrawAmount);
        setLastWithdrawAmount(amount);
        setIsWithdrawing(false);
        setWithdrawConfirmed(true);
        setAmount("");
      } else {
        alert("Withdrawal failed: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Error during withdrawal:", err);
      alert("An error occurred while processing withdrawal.");
    }
  };
  if (isSelectAccount) {
    const netBanking = [
      { name: "WhatsAppPay", icon: "/icons/whatsapp.svg" },
      { name: "Amazon Pay", icon: "/icons/amazonpay.svg" },
      { name: "Paytm", icon: "/icons/paytm.svg" },
      { name: "Google Pay", icon: "/icons/googlepay.svg" },
    ];

    return (
      <div className="bg-gray-200 p-6 max-w-2xl rounded-2xl space-y-6 md:-ml-20">
        <h2 className="text-xl font-bold text-gray-800">Select Bank Account </h2>

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
              Add Bank
            </button>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            className="px-4 py-2 text-sm font-medium text-black bg-white rounded-md hover:bg-gray-300"
            onClick={()=>{setselectAccount(false)}}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-black"
            onClick={()=>{setselectAccount(false)}}
          >
            Done
          </button>
        </div>

      </div>
    );
  }
  // Withdraw screen
  if (isWithdrawing) {
    return (
      <div className=" max-w-xl mx-auto bg-gray-200 rounded-2xl shadow-md p-6 space-y-4 md:-ml-20">
        <h2 className="text-lg font-bold flex items-center">
          <span className="mr-2">💸</span> Withdraw Funds
        </h2>
        <p className="text-sm text-gray-600">Available balance:</p>
        <h3 className="text-2xl font-bold text-gray-800">${balance}</h3>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-800"
        />
        <button
          className="text-sm text-gray-500 font-medium rounded-full bg-gray-300 px-3 py-2"
          onClick={() => setAmount(balance.toString())}
        >
          Withdraw all
        </button>

        <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
          <div
            onClick={() => setselectAccount(true)}>
            <p className="font-medium">HSBC Bank ****2212</p>
            <p className="text-xs text-gray-500">Expected transfer by 06, May 25</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            className="px-4 py-2 rounded-full bg-white border font-semibold text-gray-700"
            onClick={() => setIsWithdrawing(false)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-full bg-gray-600 text-white font-semibold"
            onClick={handleWithdraw}
          >
            Withdraw
          </button>
        </div>
      </div>
    );
  }

  // Success screen
  if (withdrawConfirmed) {
    return (
      <div className="flex justify-center  bg-gray-100 px-4">
        <div className="w-full max-w-md mx-auto bg-gray-200 text-center p-6 rounded-xl shadow-md space-y-4">
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-800" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h2 className="text-md font-semibold text-gray-900">Money withDrawn Successfully!</h2>
          <p className="text-sm text-gray-700">
            ${lastWithdrawAmount} has been withdrawn from your wallet. New balance: ${balance}
          </p>

          <button
            onClick={() => setWithdrawConfirmed(false)}
            className="px-4 py-1.5 rounded-full bg-white text-gray-800 font-medium shadow hover:bg-gray-100"
          >
            Done
          </button>
        </div>
      </div>
    );
  }


  // Normal wallet screen
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
    <div className="flex flex-col items-center px-4 md:px-6 lg:px-8 max-w-3xl md:-ml-20 space-y-4">
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
                className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-800"
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
            <div className="flex gap-4">
              <button
                onClick={() => setIsAdding(true)}
                className="bg-white text-black font-bold px-6 py-2 mt-3 rounded-full hover:bg-gray-100 transition"
              >
                + Add Balance
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setIsWithdrawing(true);
                }}
                className="bg-white text-black font-bold px-6 py-2 mt-3 rounded-full hover:bg-gray-100 transition"
              >
                💵 Withdraw Funds
              </button>
            </div>
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
