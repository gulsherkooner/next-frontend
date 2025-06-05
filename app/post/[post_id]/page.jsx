"use client";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import ImageView from "../../components/postComponents/ImageView";
import VideoView from "../../components/postComponents/VideoView";
import MobileNav from "../../components/MobileNav";
import Header from "../../components/Header";
import { Sidebar } from "lucide-react";

const Page = () => {
  const { post_id } = useParams();
  const [menu, setMenu] = useState(false);
  const post = useSelector((state) =>
    state.posts.posts.find((p) => String(p.post_id) === String(post_id))
  );

  // const post = {
  //   // url: [
  //   //   "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  //   // ],
  //   url:["https://dl.dropboxusercontent.com/scl/fi/gmpepgrf1l2jdfuhhmalb/1747669090771-face1.jpg?rlkey=ydjm8cqu8q2d68gnkklwwiqdf",
  //     "https://dl.dropboxusercontent.com/scl/fi/n6alx5qaec22dc5iuad8m/1747579673851-IMG20250515091650.jpg?rlkey=rcg8g1jlb35ngdq49s7mt6txc",
  //     "https://dl.dropboxusercontent.com/scl/fi/gmpepgrf1l2jdfuhhmalb/1747669090771-face1.jpg?rlkey=ydjm8cqu8q2d68gnkklwwiqdf",
  //     "https://dl.dropboxusercontent.com/scl/fi/n6alx5qaec22dc5iuad8m/1747579673851-IMG20250515091650.jpg?rlkey=rcg8g1jlb35ngdq49s7mt6txc"
  //   ],
  //   post_type: "carousal",
  //   post_id: post_id,
  //   user: {
  //     username: "test_user",
  //     profile_img_url:
  //       "https://dl.dropboxusercontent.com/scl/fi/wtexqjy6mzyb9jtd9f6sw/1747490724449-Untitled-10000.png?rlkey=kv42oc75hx78sqrpcd7hqp62h&raw=1",
  //   },
  //   created_at: "2023-10-01T12:00:00Z",
  //   description:
  //     "This is a sample post description for testing purposes. It can be quite long, so we will truncate it if necessary to fit the design.",
  //   likes_count: 100,
  //   comments_count: 5,
  //   title: "Sample Post Title",
  // };

  return (
    <div className="bg-gray-100 min-h-screen pb-14 md:pb-0 w-full">
      <Header setMenu={setMenu} menu={menu} />
      <Sidebar setMenu={setMenu} menu={menu} />
      {post?.post_type === "video" ? (
        <VideoView post={post} />
      ) : post?.post_type === "image" ? (
        <ImageView post={post} image={true} />
      ) : (
        <ImageView post={post} image={false} />
      )}
      <MobileNav />
    </div>
  );
};

export default Page;
