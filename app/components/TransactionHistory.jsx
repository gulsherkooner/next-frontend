import { ArrowLeft } from "lucide-react";

const TransactionHistory = ({ onBack }) => {
  const newTransactions = [
    {
      title: "Wallet Top-Up",
      amount: "+$10.00",
      date: "18 Apr 2025, 11:40 AM",
    },
    {
      title: "Message Sent (Messaged @sofia_23)",
      amount: "-$3.00",
      date: "18 Apr 2025, 11:40 AM",
    },
    {
      title: "Payout to Creator (To @sofia_23)",
      amount: "+$323.10",
      date: "18 Apr 2025, 11:40 AM",
    },
  ];

  const lastWeekTransactions = [
    {
      title: "Message Sent (Messaged @Julie)",
      amount: "-$3.00",
      date: "18 Apr 2025, 11:40 AM",
    },
    {
      title: "Message Sent (Messaged @DebbyCorrigan)",
      amount: "-$3.00",
      date: "18 Apr 2025, 11:40 AM",
    },
    {
      title: "Message Sent (Messaged @Tomi342)",
      amount: "-$3.00",
      date: "18 Apr 2025, 11:40 AM",
    },
    {
      title: "Message Sent (Messaged @JackieOsborne56)",
      amount: "-$3.00",
      date: "18 Apr 2025, 11:40 AM",
    },
    {
      title: "Payout to Creator (To @SophieOsborne)",
      amount: "+$123.15",
      date: "18 Apr 2025, 11:40 AM",
    },
  ];

  const renderTransactions = (transactions) =>
    transactions.map((txn, idx) => (
      <div key={idx} className="flex items-start gap-4 py-3 border-b border-gray-300">
        {/* Circle avatar */}
        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>

        {/* Text & amount */}
        <div className="flex justify-between w-full">
          <div className="flex flex-col">
            <div className="text-sm font-bold text-gray-800">{txn.title}</div>
            <div className="text-xs font-semibold text-gray-500">{txn.date}</div>
          </div>
          <div className={`text-sm font-semibold ${txn.amount.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
            {txn.amount}
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

      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-600 mb-2">New</h3>
        {renderTransactions(newTransactions)}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-600 mb-2">Last week</h3>
        {renderTransactions(lastWeekTransactions)}
      </div>
    </div>
  );
};

export default TransactionHistory;
