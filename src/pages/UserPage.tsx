import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";

import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";
import Post from "../components/Post";
import mongoose from "mongoose";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useRecoilState } from "recoil";
import postAtom from "../atoms/postAtom";


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

const UserPage = () => {
  const {user, loading} = useGetUserProfile();
  const { username } = useParams();

  const showToast = useShowToast();



  // const [posts, setPosts] = useState<PostType[]>([]);
  const [posts, setPosts] = useRecoilState(postAtom);

  const [fetching, setFetching] = useState(true);  

  useEffect(() => {


    const getPosts = async () => {
      setFetching(true);
      try{

        const res = await fetch(`/api/posts/user/${username}`);
        const data = await res.json();
        if(data.error){
          showToast("Error", data.error, "error");
          return;
        }
        setPosts(data);

      }
      catch(err){
        showToast("Error", (err as Error).message, "error");
      } finally {
        setFetching(false);
      }
    }

    getPosts();
  }, [username, showToast]);

  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (!user && !loading) {
    return <h1>User not found</h1>;
  }

  if (!user) return null;

  return (
    <>
      <UserHeader user={user} />
      {!fetching && posts.length === 0 && <h1>User has not Posts</h1>}
      {fetching && (
        <Flex justifyContent={"center"} my={12}>
          <Spinner size="xl" />
        </Flex>
      )}
      
      {posts.map((post) => (
        <Post key={post._id.toString()} post={post} postedBy={post.postedBy}/>
      ))}
    </>
  );
};

export default UserPage;
