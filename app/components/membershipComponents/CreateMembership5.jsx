import React, { useEffect, useState, useMemo } from "react";
import { Check, Pencil, Plus } from "lucide-react";

const CreateMembership5 = ({
  setCreateMemberBox,
  subscription,
  countryCurrencyMap,
  onClose
}) => {
  const [perks, setPerks] = useState(subscription.perks);

  return (
    <div className="flex-1 min-h-0 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="space-y-4">
          {/* Step 1 */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                Step 4: Review Your Membership Setup
              </h2>
              <p className="text-md md:text-lg text-gray-600 leading-relaxed max-w-3xl">
                Take a final look at your membership details before going live.
                Make sure your pricing, benefits, and profile information are
                accurate and reflect what you want to offer to your subscribers.
              </p>
            </div>

            {subscription.introVideo &&
              subscription.introVideo.media_content && (
                <div className="flex justify-center items-center">
                  <video
                    controls
                    autoPlay={false}
                    preload="metadata"
                    className="w-full  rounded-lg"
                    src={`data:video/mp4;base64,${subscription.introVideo.media_content}`}
                  />
                </div>
              )}

            <div className="flex gap-2">
              <h2 className="text-xl font-bold text-gray-900">
                {countryCurrencyMap[subscription.country]?.symbol || ""}
                {subscription?.MonthlyPrice} Monthly
              </h2>
              <p className=" flex items-center gap-2 text-md md:text-lg text-gray-600 leading-relaxed max-w-3xl">
                •
              </p>
              <p
                onClick={() => setCreateMemberBox(2)}
                className="cursor-pointer flex items-center gap-2 text-md md:text-lg text-gray-600 leading-relaxed max-w-3xl"
              >
                <Pencil size={18} color="gray" />
                Edit
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Perks</h2>
            </div>

            {Object.entries(perks)
              .filter(([_, { checked }]) => checked)
              .map(([title, { checked, description }]) => (
                <div className="flex justify-start gap-2" key={title}>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 ">
                      {title}
                    </h2>
                    <p className="text-md text-gray-600 leading-relaxed max-w-3xl">
                      {description}
                    </p>
                  </div>
                </div>
              ))}

            {/* Add Perk */}
            <div
              className="flex items-center gap-1 cursor-pointer"
              onClick={() => setCreateMemberBox(4)}
            >
              <Plus size={25} color="gray" />
              <h2 className="text-xl font-bold text-gray-900 ">Add perk</h2>
            </div>
          </div>

          {/* Next Button */}
          <div className="flex justify-start gap-3">
            <button
              onClick={() => setCreateMemberBox(4)}
              className="bg-gray-100 hover:bg-gray-200 font-semibold px-6 py-2 rounded-full text-md md:text-lg transition-colors duration-200 "
            >
              Back
            </button>
            <button
              onClick={onClose}
              className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-6 py-2 rounded-full text-md md:text-lg transition-colors duration-200 "
            >
              Publish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateMembership5;
