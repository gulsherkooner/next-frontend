import { useState } from "react";
import { ArrowLeft } from "lucide-react";
export const Subscriptions = ({ user }) => {
    const [showManage, setShowManage] = useState(false);
    const [confirmed, setConfirmed] = useState(false);

    const [blockedUsers, setBlockedUsers] = useState([
        { name: 'Username 1', handle: '$3.49/mo' },
        { name: 'Username 2', handle: '$3.49/mo' },
        { name: 'Username 3', handle: '$3.49/mo' },
        { name: 'Username 4', handle: '$3.49/mo' },
        { name: 'Username 5', handle: '$3.49/mo' },
        { name: 'Username 6', handle: '$3.49/mo' },
        { name: 'Username 7', handle: '$3.49/mo' },
        { name: 'Username 8', handle: '$3.49/mo' },
        { name: 'Username 9', handle: '$3.49/mo' },
        { name: 'Username 10', handle: '$3.49/mo' }
    ]);
    const handlesubscription = (index) => {
        setShowManage(true);
    }
    return (
        <>
            <div className="flex-1  rounded-md shadow p-6 text-sm text-gray-800 h-[100vh] overflow-scroll">
                <div className='mb-5'>
                    <h2 className="inline text-xl font-extrabold mb-6 ml-3">Subscriptions</h2>
                </div>
                <hr />
                <div className="space-y-4 p-5">
                    <div className=" rounded-md  divide-y ">
                        {blockedUsers.map((user, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
                            >
                                <div className="flex items-center space-x-3 p-3">
                                    <div className="w-10 h-10 bg-gray-300 rounded-full" />
                                    <div>
                                        <p className="font-medium">{user.name}</p>
                                        <p className="text-gray-500 text-sm">{user.handle}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handlesubscription(index)}
                                    className="text-sm text-white font-semibold px-4 py-1 border bg-teal-500 rounded-full hover:bg-teal-400 transition"
                                >
                                    Manage Subscription
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                {showManage && (
                    <div className="fixed inset-0 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full text-center space-y-6">
                            {!confirmed ? (
                                <>
                                    <h2 className="text-xl font-bold">End Subscription</h2>
                                    <p className="text-gray-700">
                                        Are you sure you want to cancel your subscription? You’ll lose access to this creator’s premium content after your current billing period ends.
                                    </p>
                                    <div className="flex justify-center gap-4">
                                        <button
                                            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md font-semibold hover:bg-gray-300"
                                            onClick={() => setShowManage(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="bg-teal-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-teal-400"
                                            onClick={() => setConfirmed(true)}
                                        >
                                            Confirm
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h2 className="text-xl font-bold">Subscription Cancelled</h2>
                                    <p className="text-gray-700">
                                        Don’t worry you’ll still have access until <span className="font-semibold">[end date]</span>. You can resubscribe anytime from the creator’s profile.
                                    </p>
                                    <button
                                        className="mt-4 bg-teal-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-teal-400"
                                        onClick={() => {
                                            setShowManage(false);
                                            setConfirmed(false);
                                        }}
                                    >
                                        Got it
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};