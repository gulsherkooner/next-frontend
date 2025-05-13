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
import { useDispatch } from "react-redux";
import { createPost, fetchPublicPosts } from "../../features/posts/postsSlice";

const CreateVideo = ({ openVideoDialog, setOpenVideoDialog }) => {
  const [postTitle, setPostTitle] = useState("");
  const [postDescription, setPostDescription] = useState("");
  const [postTags, setPostTags] = useState("");
  const [postVisibility, setPostVisibility] = useState("public");
  const [postFile, setPostFile] = useState(null);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const capitalizeFirstLetter = (val) => {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
  };

  const selectVisibility = (visibility) => {
    setPostVisibility(visibility);
    setIsSelectOpen(false);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      // console.log("VideoFile:",e.target.files[0])
      setPostFile(e.target.files[0]);
    }
  };

  const toggleVisibility = () => {
    setIsSelectOpen(!isSelectOpen);
  };

  const handleVideoSubmit = async () => {
  setError(null);

  // Process tags - remove # and filter empty tags
  const processedTags = postTags
    .split(" ")
    .map((tag) => (tag.startsWith("#") ? tag.substring(1) : tag))
    .filter((tag) => tag.trim() !== "");

  // Convert video file to base64
  const mediaPromise = new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64Content = reader.result.split(",")[1];
      resolve({
        media_type: "video",
        media_name: postFile.name,
        media_content: base64Content,
      });
    };
    reader.readAsDataURL(postFile);
  });

  const media = await mediaPromise;
  const postData = {
    title: postTitle,
    description: postDescription,
    post_type: "video",
    media: [media],
    post_tags: processedTags,
    visibility: postVisibility,
  };

  try {
    await dispatch(createPost(postData)).unwrap();
    dispatch(fetchPublicPosts());
    setPostTitle("");
    setPostDescription("");
    setPostTags("");
    setPostVisibility("public");
    setPostFile(null);
    setOpenVideoDialog(false);
  } catch (err) {
    console.error("Create post error:", err);
    setError(err.message || "Failed to create post");
  }
};


  return (
    openVideoDialog && (
      <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-4 w-full max-w-lg relative">
          <button
            onClick={() => setOpenVideoDialog(false)}
            className="absolute right-2 top-2 p-1 hover:bg-gray-200 rounded-full"
          >
            <X size={18} />
          </button>

          {error && <div className="mb-3 text-red-500 text-sm">{error}</div>}
          {loading && (
            <div className="mb-3 text-gray-500 text-sm">Loading...</div>
          )}

          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
            <div className="ml-3">
              <h3 className="font-bold text-sm">Username</h3>
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

          <div className="space-y-3">
            {/* Title Input */}
            <input
              placeholder="Title"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-gray-500"
            />

            {/* Description Input */}
            <textarea
              placeholder="Tell people about your video..."
              value={postDescription}
              onChange={(e) => setPostDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm resize-none focus:outline-none focus:border-gray-500"
              rows={4}
            />

            {/* Tags Input */}
            <input
              placeholder="Add tags (separate with spaces, use # for hashtags)"
              value={postTags}
              onChange={(e) => setPostTags(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-gray-500"
            />
          </div>

          {/* Video Upload Area */}
          <div className="border border-gray-300 rounded-lg p-1 bg-gray-200 my-3">
            {postFile ? (
              <div className="flex items-center justify-between p-3 bg-gray-100 rounded">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-gray-600" />
                  <span className="text-sm truncate max-w-[220px]">
                    {postFile.name}
                  </span>
                </div>
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => setPostFile(null)}
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <label className="cursor-pointer">
                <div className="flex flex-col items-center justify-center py-12 px-4 bg-gray-200 rounded-md">
                  <div className="bg-white p-3 rounded-full mb-3">
                    <Plus className="h-5 w-5" />
                  </div>
                  <h3 className="font-medium text-sm">Drag and drop videos</h3>
                  <p className="text-gray-600 text-xs">
                    or select from computer
                  </p>
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              </label>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="bg-gray-300 text-gray-700 px-4 py-1.5 rounded-md text-sm font-medium"
              onClick={() => setOpenVideoDialog(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="bg-gray-800 text-white px-4 py-1.5 rounded-md text-sm font-medium ml-2"
              onClick={handleVideoSubmit}
              disabled={!postTitle.trim() || !postFile}
            >
              Post Video
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default CreateVideo;
