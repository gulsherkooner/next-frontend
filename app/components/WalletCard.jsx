import { useEffect, useState } from "react";
import { Wallet } from "lucide-react";

export default function WalletCard() {
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    const fetchBalance = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const res = await fetch(`http://localhost:5000/api/wallet/${userId}`);
        const data = await res.json();
        if (data?.balance !== undefined) {
          setBalance(parseFloat(data.balance));
        }
      } catch (err) {
        console.error("Failed to fetch wallet balance", err);
      }
    };

    fetchBalance();
  }, []);

  return (
    <div className="max-w-xs bg-gray-100 p-4 rounded-xl shadow-sm mb-5">
      <div className="flex items-center gap-2">
        <Wallet className="w-5 h-5" />
        <h2 className="text-lg font-semibold">Wallet</h2>
      </div>
      <p className="text-sm text-gray-500 mt-1">Available balance</p>
      <p className="text-3xl font-bold mt-1">
        {balance !== null ? `$ ${balance.toFixed(2)}` : "Loading..."}
      </p>
      <a
        href="/Wallet"
        className="text-sm mt-4 inline-flex items-center text-black font-medium hover:underline"
      >
        View wallet <span className="ml-1">→</span>
      </a>
    </div>
  );
}
