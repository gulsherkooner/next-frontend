import { useEffect, useState, useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const TransactionHistory = ({ onBack }) => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTxns = async () => {
      const userId = localStorage.getItem("userId");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/date/wallet/${userId}`);
      const data = await res.json();
      if (data?.transactions) {
        const sorted = data.transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        setTransactions(sorted);
      }
    };
    fetchTxns();
  }, []);

  const groupedTransactions = useMemo(() => {
    const today = dayjs();
    const yesterday = today.subtract(1, "day");
    const startOfWeek = today.startOf("week");

    const groups = {
      Today: [],
      Yesterday: [],
      "This Week": [],
      Older: [],
    };

    transactions.forEach((txn) => {
      const txnDate = dayjs(txn.date);

      if (txnDate.isSame(today, "day")) {
        groups.Today.push(txn);
      } else if (txnDate.isSame(yesterday, "day")) {
        groups.Yesterday.push(txn);
      } else if (txnDate.isSameOrAfter(startOfWeek)) {
        groups["This Week"].push(txn);
      } else {
        groups.Older.push(txn);
      }
    });

    return groups;
  }, [transactions]);

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
    <div className="flex-1 bg-white rounded-lg px-6 py-4 md:-ml-15 shadow xs:w-xs max-w-2xl">
      <div className="flex items-center gap-2 mb-4">
        <ArrowLeft className="w-5 h-5 cursor-pointer" onClick={onBack} />
        <h2 className="text-xl font-bold text-gray-800">Transaction History</h2>
      </div>

      {Object.entries(groupedTransactions).map(([label, txns]) =>
        txns.length ? (
          <div key={label} className="mb-4">
            <h3 className="text-md font-semibold text-gray-600 mb-2">{label}</h3>
            {renderTransactions(txns)}
          </div>
        ) : null
      )}
    </div>
  );
};

export default TransactionHistory;
