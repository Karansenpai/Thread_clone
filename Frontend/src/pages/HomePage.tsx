import {Flex, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import { useRecoilState } from "recoil";
import postAtom from "../atoms/postAtom";
import {BASE_URL} from "../config"

const HomePage = () => {
  const showToast = useShowToast();



  const [posts, setPosts] = useRecoilState(postAtom);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPosts([]);
    const getfeedPosts = async () => {
      setLoading(true);

      try {
        const res = await fetch(`${BASE_URL}/api/posts/feed`);
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
