"use client";
import React from "react";
import EditableTags from "./EditableTags";
import Section from "./Section";
import PhotoGallery from "./Gallery";
import PostComposer from "./Postcomposer";
import { motion } from "framer-motion";

export default function DatingProfileContent({
  profile,
  posts,
  showPostModal,
  setShowPostModal,
}) {
  if (!profile) {
    return (
      <div className="text-center text-gray-500 py-6">
        No dating profile data available.
      </div>
    );
  }

  const basics = [
    profile.height ? `${profile.height} cm` : "175",
    profile.age,
    ...(profile.locations || []),
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="pt-6 space-y-6"
    >
      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Tags */}
        <div className="space-y-4">
          <EditableTags title="Looking for" items={profile.lookingFor || []} />
          <EditableTags title="My Basics" items={basics || []} />
          <EditableTags title="Likes" items={profile.likes || []} />
          <EditableTags title="Languages" items={profile.languages || []} />
          <EditableTags title="Education" items={profile.professions || []} />
        </div>

        {/* Right Column - Sections + Photos */}
        <div className="col-span-2 space-y-6 w-full">
          <Section title="About Me" text={profile.describeSelf || "—"} />
          <Section title="What I’m Looking For In A Partner" text={profile.idealDate || "—"} />
          <Section title="What I Bring To The Table" text={profile.greatPartner || "—"} />

          {/* Photo Section */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Photos</h2>
              {/* Optional Add Photo button can go here */}
            </div>

            {/* Photo Grid */}
            <div className="space-y-3">
              <PhotoGallery posts={posts || []} />
            </div>
          </div>
        </div>
      </div>


      {/* Modal */}
      {showPostModal && (
        <PostComposer
          showPostModal={showPostModal}
          setShowPostModal={setShowPostModal}
          profile={profile}
        />
      )}
    </motion.div>
  );
}