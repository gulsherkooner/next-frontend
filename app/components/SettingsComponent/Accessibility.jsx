export const Accessibility = () => {
    return (
        <div className="flex-1 bg-gray-200 rounded-md shadow p-6 text-lg text-gray-800 h-[100vh] overflow-y-scroll">
            <h2 className="text-xl font-extrabold mb-6">Accessibility & Display</h2>
            <hr />
            <div className="space-y-4 p-5">
                <h2 className="text-xl font-extrabold mb-2">Appearance</h2>
                <p className="text-lg text-gray-600 mb-4">Change the Appearance of the app to reduce eye strain.</p>
                <div className="space-y-2 mb-4">
                    {['Light Mode', 'Dark Mode', 'System Default'].map((option) => (
                        <label key={option} className="flex items-center space-x-4 transform: scale-100">
                            <input
                                type="radio"
                                name="apperance"
                                className="scale-150 accent-gray-800"
                            />
                            <span className='font-bold text-lg'>{option}</span>
                        </label>
                    ))}
                </div>
                <hr />
                <h2 className="text-xl font-extrabold mb-2">Increase colour contrast</h2>
                <p className="text-lg text-gray-600 mb-4">Improves legibility by increasing the contrast between text and background colors.</p>
                <div className="space-y-2 mb-4">
                    {['On', 'Off'].map((option) => (
                        <label key={option} className="flex items-center space-x-4 transform: scale-100">
                            <input
                                type="radio"
                                name="colour"
                                className="scale-150 accent-gray-800"
                            />
                            <span className='font-bold text-lg'>{option}</span>
                        </label>
                    ))}
                </div>
                <hr />
                <h2 className="text-xl font-extrabold mb-2">Font Size</h2>
                <p className="text-lg text-gray-600 mb-4">Adjust the size of text across the app.</p>
                <div className="space-y-2 mb-4">
                    {['Small', 'Default', 'Large'].map((option) => (
                        <label key={option} className="flex items-center space-x-4 transform: scale-100">
                            <input
                                type="radio"
                                name="font"
                                className="scale-150 accent-gray-800"
                            />
                            <span className='font-bold text-lg'>{option}</span>
                        </label>
                    ))}
                </div>
                <hr />
                <h2 className="text-xl font-extrabold mb-2">Appearance</h2>
                <p className="text-lg text-gray-600 mb-4">Change the Appearance of the app to reduce eye strain.</p>
                <div className="space-y-2 mb-4">
                    {['Always', 'Never'].map((option) => (
                        <label key={option} className="flex items-center space-x-4 transform: scale-100">
                            <input
                                type="radio"
                                name="autoplay"
                                className="scale-150 accent-gray-800"
                            />
                            <span className='font-bold text-lg'>{option}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>

    );
};