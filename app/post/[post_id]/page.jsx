"use client";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ImageView from "../../components/postComponents/ImageView";
import VideoView from "../../components/postComponents/VideoView";
import MobileNav from "../../components/MobileNav";
import Header from "../../components/Header";
import { fetchPublicPosts } from "../../features/posts/postsSlice";

const Page = () => {
  const { post_id } = useParams();
  const [menu, setMenu] = useState(false);
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.posts);

  // Find the post in the store initially (may be undefined)
  const initialPost = useSelector((state) =>
    state.posts.posts.find((p) => String(p.post_id) === String(post_id))
  );
  const [post, setPost] = useState(initialPost);

  useEffect(() => {
    // If post is not found or has no url, fetch posts and set it
    if (!post || !post.url || post.url.length === 0) {
      dispatch(fetchPublicPosts()).then(() => {
        const found = posts.find(
          (p) => String(p.post_id) === String(post_id)
        );
        setPost(found);
      });
    } else {
      setPost(post);
    }
    // eslint-disable-next-line
  }, [post_id, dispatch, posts]);

  return (
    <div className="bg-gray-100 min-h-screen pb-14 md:pb-0 w-full">
      <Header setMenu={setMenu} menu={menu} />
      {/* <Sidebar setMenu={setMenu} menu={menu} /> */}
      {!post ? (
        <div className="flex justify-center items-center h-96 text-gray-500">
          Loading...
        </div>
      ) : post?.post_type === "video" ? (
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
