import { CreditCard } from "lucide-react";
const AddCardForm = ({ onBack }) => {
    return (
        <div className="bg-white p-6 rounded-2xl max-w-md w-full space-y-4 shadow-md sm:ml-15 md:ml-0 ">
            <h2 className="text-xl font-bold text-gray-800">Add card</h2>

            <div className="relative">
                <p className="text-sm text-gray-600 mb-1 font-bold">Card Number</p>
                <CreditCard size={18} className="absolute left-2 top-9 " />
                <input
                    className="w-full p-2 px-9 rounded-md border border-gray-300"
                    placeholder="Enter number"
                />
            </div>

            <div className="flex gap-2">
                <div className="w-1/2">
                    <p className="text-sm text-gray-600 mb-1 font-bold">Exp Date</p>
                    <input
                        className="w-full p-2 rounded-md border border-gray-300"
                        placeholder="MM/YY"
                    />
                </div>
                <div className="w-1/2">
                    <p className="text-sm text-gray-600 mb-1 font-bold">CVV</p>
                    <input
                        className="w-full p-2 rounded-md border border-gray-300"
                        placeholder="222"
                    />
                </div>
            </div>

            <div>
                <p className="text-sm text-gray-600 mb-1 font-bold">Name on card</p>
                <input
                    className="w-full p-2 rounded-md border border-gray-300"
                    placeholder="Enter name"
                />
            </div>
            <div>
                <p className="text-xs text-gray-600 mb-1 font-bold">Country</p>
                <select className="w-full p-1 rounded-md border border-gray-300 text-sm">
                    <option>USA</option>
                    <option>India</option>
                    <option>UK</option>
                </select>
            </div>



            <div className="flex justify-end gap-3 pt-2">
                <button
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50"
                    onClick={onBack}
                >
                    Cancel
                </button>
                <button className="px-4 py-2 text-sm font-medium text-white bg-teal-500 rounded-md hover:bg-teal-600" onClick={onBack}>
                    Add Card
                </button>
            </div>
        </div>
    );
};

export default AddCardForm;