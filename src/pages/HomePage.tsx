import {Flex, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import mongoose from "mongoose";


type replyType ={
  userId: mongoose.Schema.Types.ObjectId,
  text: string,
  userProfilePic:string,
  username: string,
}
interface PostType {
  _id: mongoose.Types.ObjectId;
  postedBy: mongoose.Types.ObjectId;
  text: string;
  createdAt: string;
  likes: string[];
  replies: replyType[];
  updatedAt: string;
  img?: string;
}

const HomePage = () => {
  const showToast = useShowToast();

  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getfeedPosts = async () => {
      setLoading(true);

      try {
        const res = await fetch("/api/posts/feed");
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setPosts(data);
      } catch (err) {
        showToast("Error", (err as Error).message, "error");
      } finally {
        setLoading(false);
      }
    };
    getfeedPosts();
  }, []);
  return (
    <>
      {!loading && posts.length === 0 && (
        <h1>Follow Some users to see their posts</h1>
      )}
      {loading && (
        <Flex justify={"center"}>
          <Spinner size="xl" />
        </Flex>
      )}

      {posts.map((post) => (
        <Post key = {post._id.toString()} post={post} postedBy={post.postedBy} />
        ))}
    </>
  );
};

export default HomePage;
