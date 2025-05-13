import { Wallet } from "lucide-react";

export default function WalletCard() {
  return (
    <div className="max-w-xs bg-gray-100 p-4 rounded-xl shadow-sm mb-5">
      <div className="flex items-center gap-2">
        <Wallet className="w-5 h-5" />
        <h2 className="text-lg font-semibold">Wallet</h2>
      </div>
      <p className="text-sm text-gray-500 mt-1">Available balance</p>
      <p className="text-3xl font-bold mt-1">$ 32</p>
      <a
        href="#"
        className="text-sm mt-4 inline-flex items-center text-black font-medium hover:underline"
      >
        View wallet <span className="ml-1">→</span>
      </a>
    </div>
  );
}
