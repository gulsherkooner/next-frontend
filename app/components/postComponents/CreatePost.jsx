import React, { useState } from "react";
import {
  Video,
  Heart,
  BarChart,
  Smile,
  X,
  Plus,
  Image,
  FileText,
  ChevronRight,
  ChevronDown,
  Earth,
  Users,
  EarthLock,
  UsersRound,
  UserRoundCheck,
} from "lucide-react";
import CreateVideo from "./CreateVideo";
import CreateImage from "./CreateImage";

const CreatePost = () => {
  const [postText, setPostText] = useState("");
  const [openVideoDialog, setOpenVideoDialog] = useState(false);
  const [openImageDialog, setOpenImageDialog] = useState(false);

  const handlePostSubmit = (e) => {
    e.preventDefault();
    console.log("Post submitted:", postText);
    setPostText("");
    setOpenVideoDialog(false);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <form onSubmit={handlePostSubmit}>
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0"></div>
          <input
            type="text"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            className="ml-2 p-2 w-full bg-gray-100 rounded-full text-sm focus:outline-none"
            placeholder="What's on your mind ?"
          />
        </div>

        {/* Video Upload Dialog - Overlay with rgba background */}
        <CreateVideo openVideoDialog={openVideoDialog} setOpenVideoDialog={setOpenVideoDialog} />
        <CreateImage openImageDialog={openImageDialog} setOpenImageDialog={setOpenImageDialog} />

        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <div className="flex space-x-1">
            <button
              type="button"
              className="flex items-center px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 rounded-md"
              onClick={() => setOpenImageDialog(!openImageDialog)}
            >
              <Image size={18} className="mr-2" />
              <span className="hidden sm:inline">Post</span>
            </button>
            <button
              type="button"
              className="flex items-center px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 rounded-md"
              onClick={() => setOpenVideoDialog(!openVideoDialog)}
            >
              <Video size={18} className="mr-2" />
              <span className="hidden sm:inline">Video</span>
            </button>
            <button
              type="button"
              className="flex items-center px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 rounded-md"
              onClick={() => setOpenVideoDialog(!openVideoDialog)}
            >
              <Heart size={18} className="mr-2" />
              <span className="hidden sm:inline">Reel</span>
            </button>
            <button
              type="button"
              className="flex items-center px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 rounded-md"
            >
              <BarChart size={18} className="mr-2" />
              <span className="hidden sm:inline">Poll</span>
            </button>
            <button
              type="button"
              className="flex items-center px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 rounded-md"
            >
              <Smile size={18} className="mr-2" />
              <span className="hidden sm:inline">Emoji</span>
            </button>
          </div>
          <button
            type="submit"
            disabled={!postText.trim()}
            className={`px-4 py-1.5 rounded-md text-sm font-medium ${
              postText.trim()
                ? "bg-gray-800 text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
