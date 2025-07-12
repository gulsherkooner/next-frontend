import React, { useEffect, useState, useMemo } from "react";
import { Check, Pencil, Plus, X } from "lucide-react";

const ViewMembership = ({
  membership,
  profile,
  countryCurrencyMap,
  channel,
  rates,
  onClose
}) => {
  const [perk, setPerk] = useState(membership.perks || {});

  useEffect(() => {
    setPerk(membership.perks || {});
  }, [membership.perks]);

  return (
    membership && (
      <div className="flex-1 min-h-0 overflow-y-auto relative">
        {/* X Button at top right */}
        <button
          className="absolute top-4 right-4 z-10 bg-gray-100 hover:bg-gray-200 rounded-full p-2"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={24} />
        </button>
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          <div className="space-y-4">
            {/* Step 1 */}
            <div className="space-y-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                  Subscribe to channel @{channel}
                </h2>
              </div>

              {membership.introVideo && (
                <div className="flex justify-center items-center">
                  <video
                    controls
                    autoPlay={false}
                    preload="metadata"
                    className="w-full rounded-lg"
                    src={
                      membership.introVideo.media_url
                        ? membership.introVideo.media_url
                        : membership.introVideo.media_content
                        ? `data:video/mp4;base64,${membership.introVideo.media_content}`
                        : ""
                    }
                  />
                </div>
              )}

              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <h2 className="text-xl font-bold text-gray-900">
                    {countryCurrencyMap[membership.country]?.symbol || ""}
                    {membership?.MonthlyPrice &&
                    rates &&
                    countryCurrencyMap[membership.country]?.currency
                      ? (
                          membership.MonthlyPrice *
                          (rates[
                            countryCurrencyMap[membership.country].currency
                          ] || 1)
                        ).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : membership?.MonthlyPrice}{" "}
                    Monthly
                  </h2>
                  <p className=" flex items-center gap-2 text-md md:text-lg text-gray-600 leading-relaxed max-w-3xl">
                    •
                  </p>
                  <p
                    onClick={() => setCreateMemberBox(2)}
                    className="cursor-pointer flex items-center gap-2 text-md md:text-lg text-gray-600 leading-relaxed max-w-3xl"
                  >
                    Cancel anytime.
                  </p>
                </div>
                {!profile && (
                  <button className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-5 py-1.5 rounded-full text-md md:text-lg transition-colors duration-200 ">
                    Subscribe
                  </button>
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Subscription offerings
                </h2>
              </div>

              <div className="">
                {perk &&
                  typeof perk === "object" &&
                  Object.entries(perk)
                    .filter(([_, { checked }]) => checked)
                    .map(([title, { checked, description }]) => (
                      <div key={title}>
                        <p className="text-md text-gray-600 leading-relaxed ">
                          &ensp;•&ensp;{title} – {description}
                        </p>
                      </div>
                    ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default ViewMembership;
