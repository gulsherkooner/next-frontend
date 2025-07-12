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
import { useDispatch, useSelector } from "react-redux";
import { createPost } from "@/app/features/posts/postsSlice";

const CreatePost = () => {
  const [postText, setPostText] = useState({
    title: "",
    description: "",
    post_type: "text",
    media: [],
    category: "",
    post_tags: "",
    visibility: "",
  });
  const [openVideoDialog, setOpenVideoDialog] = useState(false);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const dispatch = useDispatch();

  const handlePostSubmit = () => {
    dispatch(createPost(postText)).unwrap();
    setPostText({
      title: "",
      description: "",
      post_type: "text",
      media: [],
      category: "",
      post_tags: "",
      visibility: "",
    });
    setOpenVideoDialog(false);
  };

  const { user } = useSelector((state) => state.auth);
    const [postVisibility, setPostVisibility] = useState("public");
    const [isSelectOpen, setIsSelectOpen] = useState(false);
  const capitalizeFirstLetter = (val) => {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
  };

  const toggleVisibility = () => {
    setIsSelectOpen(!isSelectOpen);
  };

  const selectVisibility = (visibility) => {
    setPostVisibility(visibility);
    setPostText({...postText , visibility : visibility})
    setIsSelectOpen(false);
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow mb-4">
      <form onSubmit={handlePostSubmit}>
        <div className="flex items-center justify-start mb-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0">
            {user?.profile_img_url && <img src={user?.profile_img_url} className="rounded-full" alt="*" />}
          </div>
          <div className="ml-3">
            <h3 className="font-bold text-sm">{user?.username ? capitalizeFirstLetter(user?.username) : "Username"}</h3>
            <div className="flex items-center text-gray-600 text-xs">
              <div className="relative">
                <button
                  type="button"
                  onClick={toggleVisibility}
                  className="flex items-center justify-between h-6 w-fit px-2 py-1 text-xs rounded"
                >
                  {postVisibility === "public" ? (
                    <Earth size={16} />
                  ) : postVisibility === "followers" ? (
                    <UserRoundCheck size={16} />
                  ) : (
                    <EarthLock size={16} />
                  )}
                  <span className="ml-1">
                    {capitalizeFirstLetter(postVisibility)}
                  </span>
                  {isSelectOpen ? (
                    <ChevronRight size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </button>

                {isSelectOpen && (
                  <div className="absolute top-full left-0 mt-1 w-24 bg-white border border-gray-300 rounded shadow-lg z-10">
                    <ul>
                      <li
                        className="px-2 py-1 text-xs hover:bg-gray-100 cursor-pointer"
                        onClick={() => selectVisibility("public")}
                      >
                        Public
                      </li>
                      <li
                        className="px-2 py-1 text-xs hover:bg-gray-100 cursor-pointer"
                        onClick={() => selectVisibility("followers")}
                      >
                        Followers
                      </li>
                      <li
                        className="px-2 py-1 text-xs hover:bg-gray-100 cursor-pointer"
                        onClick={() => selectVisibility("private")}
                      >
                        Private
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center mb-3">
          <input
            type="text"
            value={postText.title}
            onChange={(e) =>
              setPostText({ ...postText, title: e.target.value })
            }
            className="ml-2 p-2 w-full bg-gray-50 rounded-full text-sm focus:outline-none"
            placeholder="What's on your mind ?"
          />
        </div>

        {/* Video Upload Dialog - Overlay with rgba background */}
        <CreateVideo
          openVideoDialog={openVideoDialog}
          setOpenVideoDialog={setOpenVideoDialog}
          user={user}
        />
        <CreateImage
          openImageDialog={openImageDialog}
          setOpenImageDialog={setOpenImageDialog}
          user={user}
        />

        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <div className="flex space-x-1">
            <button
              type="button"
              className="flex items-center px-3 py-1.5 text-sm text-teal-600 hover:bg-gray-100 rounded-md"
              onClick={() => setOpenImageDialog(!openImageDialog)}
            >
              <Image size={18} className="mr-2" />
              <span className="hidden sm:inline">Post</span>
            </button>
            <button
              type="button"
              className="flex items-center px-3 py-1.5 text-sm text-teal-600 hover:bg-gray-100 rounded-md"
              onClick={() => setOpenVideoDialog(!openVideoDialog)}
            >
              <Video size={18} className="mr-2" />
              <span className="hidden sm:inline">Video</span>
            </button>
            <button
              type="button"
              className="flex items-center px-3 py-1.5 text-sm text-teal-600 hover:bg-gray-100 rounded-md"
              onClick={() => setOpenVideoDialog(!openVideoDialog)}
            >
              <Heart size={18} className="mr-2" />
              <span className="hidden sm:inline">Reel</span>
            </button>
            <button
              type="button"
              className="flex items-center px-3 py-1.5 text-sm text-teal-600 hover:bg-gray-100 rounded-md"
            >
              <BarChart size={18} className="mr-2" />
              <span className="hidden sm:inline">Poll</span>
            </button>
            <button
              type="button"
              className="flex items-center px-3 py-1.5 text-sm text-teal-600 hover:bg-gray-100 rounded-md"
            >
              <Smile size={18} className="mr-2" />
              <span className="hidden sm:inline">Emoji</span>
            </button>
          </div>
          <button
            type="submit"
            disabled={!postText.title.trim()}
            className={`px-4 py-1.5 rounded-full text-sm font-bold ${
              postText.title.trim()
                ? "bg-teal-500 text-white"
                : "bg-neutral-300 text-neutral-600 cursor-not-allowed"
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
