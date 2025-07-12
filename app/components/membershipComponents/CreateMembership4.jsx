import React, { useEffect, useState, useMemo } from "react";
import { Check, Plus, X } from "lucide-react";

const CreateMembership4 = ({
  setCreateMemberBox,
  setSubscription,
  subscription,
}) => {
  const [perk, setPerk] = useState(subscription.perks);
  const [addingPerk, setAddingPerk] = useState(false);
  const [newPerkTitle, setNewPerkTitle] = useState("");
  const [newPerkDesc, setNewPerkDesc] = useState("");
  const MAX_PERKS = 8;

  // Toggle perk checked state
  const handlePerkToggle = (perkTitle) => {
    setPerk((prev) => ({
      ...prev,
      [perkTitle]: {
        ...prev[perkTitle],
        checked: !prev[perkTitle].checked,
      },
    }));
  };

  // Delete a perk
  const handleDeletePerk = (perkTitle) => {
    setPerk((prev) => {
      const updated = { ...prev };
      delete updated[perkTitle];
      return updated;
    });
  };

  // Add new perk
  const handleAddPerk = () => {
    if (!newPerkTitle.trim()) {
      alert("Perk title cannot be empty.");
      return;
    }
    if (perk[newPerkTitle]) {
      alert("Perk with this title already exists.");
      return;
    }
    if (Object.keys(perk).length >= MAX_PERKS) {
      alert(`You can only add up to ${MAX_PERKS} perks.`);
      return;
    }
    setPerk((prev) => ({
      ...prev,
      [newPerkTitle]: {
        checked: false,
        description: newPerkDesc,
      },
    }));
    setNewPerkTitle("");
    setNewPerkDesc("");
    setAddingPerk(false);
  };

  const handleNext = () => {
    setSubscription({
      ...subscription,
      perks: { ...perk },
    });
    setCreateMemberBox(5);
  };

  return (
    <div className="flex-1 min-h-0 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="space-y-4">
          {/* Step 1 */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                Step 3: Set Your Perks
              </h2>
              <p className="text-md md:text-lg text-gray-600 leading-relaxed max-w-3xl">
                Let your audience know what exclusive benefits they'll get for
                supporting you. Choose from common perk or add your own!
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Suggested Perks
              </h2>
              <p className="text-md md:text-lg text-gray-600 leading-relaxed max-w-3xl">
                Let your audience know what exclusive benefits they'll get for
                supporting you. Choose from common perk or add your own!
              </p>
            </div>

            {Object.entries(perk).map(([title, { checked, description }]) => (
              <div className="flex justify-start gap-2" key={title}>
                <div className="flex justify-between w-full">
                  <div className="flex gap-2">
                    <div>
                      <div className="flex items-center space-x-2 p-1">
                        <input
                          type="checkbox"
                          id={`perk-${title}`}
                          className="hidden"
                          checked={checked}
                          onChange={() => handlePerkToggle(title)}
                        />
                        <label
                          htmlFor={`perk-${title}`}
                          className="relative w-6 h-6 border-2 border-gray-400 rounded cursor-pointer flex items-center justify-center"
                        >
                          <span
                            className={`absolute inset-0 flex items-center justify-center transition-opacity ${
                              checked ? "" : "opacity-0"
                            }`}
                          >
                            <Check size={20} color="green" />
                          </span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 ">
                        {title}
                      </h2>
                      <p className="text-md text-gray-600 leading-relaxed max-w-3xl">
                        {description}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  className="ml-2 mt-1 p-1 rounded hover:bg-gray-200 transition"
                  onClick={() => handleDeletePerk(title)}
                  title="Delete perk"
                  type="button"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
            ))}

            {/* Add Perk */}
            {addingPerk ? (
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="perk-title"
                  className="font-bold text-md md:text-lg text-gray-900"
                >
                  Title
                </label>
                <input
                  id="perk-title"
                  type="text"
                  className="rounded-lg px-4 py-3 bg-gray-100 placeholder-gray-500 text-base"
                  placeholder="Personalized Feedback"
                  value={newPerkTitle}
                  onChange={(e) => setNewPerkTitle(e.target.value)}
                  maxLength={50}
                />
                <label
                  htmlFor="perk-desc"
                  className="font-bold text-md md:text-lg text-gray-900"
                >
                  Description
                </label>
                <textarea
                  id="perk-desc"
                  className="rounded px-4 py-3 bg-gray-100 placeholder-gray-500 text-base"
                  placeholder="I&#39;ll give tailored feedback on your posts and reels, along with tips to help you improve your content."
                  value={newPerkDesc}
                  onChange={(e) => setNewPerkDesc(e.target.value)}
                  rows={3}
                  maxLength={200}
                />
                <div className="flex gap-2 mt-2">
                  <button
                    className="bg-teal-500 text-white px-3 py-1 rounded"
                    onClick={handleAddPerk}
                    disabled={Object.keys(perk).length >= MAX_PERKS}
                  >
                    Add
                  </button>
                  <button
                    className="bg-gray-200 px-3 py-1 rounded"
                    onClick={() => setAddingPerk(false)}
                  >
                    Cancel
                  </button>
                </div>
                {Object.keys(perk).length >= MAX_PERKS && (
                  <div className="text-red-500 text-sm mt-1">
                    You can only add up to {MAX_PERKS} perks.
                  </div>
                )}
              </div>
            ) : (
              <div
                className="flex items-center gap-1 cursor-pointer"
                onClick={() => {
                  if (Object.keys(perk).length < MAX_PERKS) setAddingPerk(true);
                }}
              >
                <Plus size={25} color="gray" />
                <h2 className="text-xl font-bold text-gray-900 ">Add perk</h2>
              </div>
            )}
          </div>

          {/* Next Button */}
          <div className="flex justify-start gap-3">
            <button
              onClick={() => setCreateMemberBox(3)}
              className="bg-gray-100 hover:bg-gray-200 font-semibold px-6 py-2 rounded-full text-md md:text-lg transition-colors duration-200 "
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-6 py-2 rounded-full text-md md:text-lg transition-colors duration-200 "
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateMembership4;
