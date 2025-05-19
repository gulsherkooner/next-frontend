import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { use } from "react";

const TransactionHistory = ({ onBack }) => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTxns = async () => {
      const userId = localStorage.getItem("userId");
      // console.log(userId);
      const res = await fetch(`http://localhost:5000/api/wallet/${userId}`);
      const data = await res.json();
      if (data?.transactions) {
        const sorted = data.transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        setTransactions(sorted);
      }
    };
    fetchTxns();
  }, []);

  const renderTransactions = (txns) =>
    txns.map((txn, idx) => (
      <div key={idx} className="flex items-start gap-4 py-3 border-b border-gray-300">
        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
        <div className="flex justify-between w-full">
          <div className="flex flex-col">
            <div className="text-sm font-bold text-gray-800">{txn.title}</div>
            <div className="text-xs font-semibold text-gray-500">
              {new Date(txn.date).toLocaleString()}
            </div>
          </div>
          <div
            className={`text-sm font-semibold ${
              txn.amount > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {txn.amount > 0 ? `+$${txn.amount}` : `-$${Math.abs(txn.amount)}`}
          </div>
        </div>
      </div>
    ));

  return (
    <div className="flex-1 bg-white rounded-lg px-6 py-4 shadow w-full max-w-2xl">
      <div className="flex items-center gap-2 mb-4">
        <ArrowLeft className="w-5 h-5 cursor-pointer" onClick={onBack} />
        <h2 className="text-xl font-bold text-gray-800">Transaction history</h2>
      </div>
      <div>{renderTransactions(transactions)}</div>
    </div>
  );
};

export default TransactionHistory;
