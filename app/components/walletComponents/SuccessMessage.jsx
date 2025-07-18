const SuccessMessage = ({ amountAdded, newBalance, onDone }) => {
  return (
    <div className="w-full max-w-xl mx-auto bg-gray-100 text-center p-6 rounded-xl shadow-md space-y-4">
      <div className="flex justify-center">
        <div className="w-14 h-14 rounded-full bg-white border-4 border-teal-500 flex items-center justify-center">
          <svg className="w-8 h-8 text-teal-500" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
      <h2 className="text-md font-semibold text-gray-900">Money Added Successfully!</h2>
      <p className="text-sm text-gray-700">
        ${amountAdded} has been added to your wallet. New balance: ${newBalance}
      </p>
      <button
        onClick={onDone}
        className="px-4 py-1.5 rounded-full bg-white text-gray-800 font-bold shadow hover:bg-gray-100"
      >
        Done
      </button>
    </div>
  );
};

export default SuccessMessage;