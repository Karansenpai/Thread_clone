import {
  Avatar,
  Flex,
  Image,
  Text,
  Box,
  Divider,
  Button,
  Spinner,
} from "@chakra-ui/react";
import Actions from "../components/Actions";
import Comment from "../components/Comment";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useNavigate, useParams } from "react-router-dom";
import mongoose from "mongoose";
import { formatDistanceToNow } from "date-fns";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { DeleteIcon } from "@chakra-ui/icons";

type replyType = {
  userId: mongoose.Schema.Types.ObjectId;
  text: string;
  userProfilePic: string;
  username: string;
};

type PostProps = {
  _id: mongoose.Types.ObjectId;
  postedBy: mongoose.Types.ObjectId;
  text: string;
  createdAt: string;
  likes: string[];
  replies: replyType[];
  updatedAt: string;
  img?: string;
};

type currentUserType = {
  _id: string;
  name: string;
  username: string;
  bio: string;
  profilePic: string;
};

const PostPage = () => {
  const { user, loading } = useGetUserProfile();
  const [post, setPost] = useState<PostProps>({} as PostProps);
  const showToast = useShowToast();
  const currentUser: currentUserType = useRecoilValue(userAtom);
  const { pid } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await fetch(`/api/posts/${pid}`);
        const data = await res.json();

        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setPost(data);
      } catch (err) {
        showToast("Error", (err as Error).message, "error");
      }
    };
    getPost();
  }, [pid, showToast]);

  const handleDeletePost = async () => {  
    try{
      if(!window.confirm("Are you sure you want to delete this post?")) return;

      const res = await fetch(`/api/posts/${post._id}`,{
        method: "DELETE",
      });

      const data = await res.json();
      if(data.error){
        showToast("Error",data.error,"error");
      }
      showToast("Success","Post deleted successfully","success");
      navigate(`/${user?.username}`);


    } 
    catch(err){
      showToast("Error", (err as Error).message, "error");
    }
  }

  if (user.name.length === 0 && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar src={user?.profilePic} size={"md"} name={"Mark-Zuckerberg"} />

          <Flex>
            <Text fontSize={"sm"} fontWeight={"bold"}>
              {user?.username}
            </Text>
            <Image src={"/verified.png"} w="4" h={4} ml={4} />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <Text
            fontSize={"xs"}
            width={36}
            textAlign={"right"}
            color={"gray.light"}
          >
            {post.createdAt && formatDistanceToNow(new Date(post.createdAt))}{" "}
            ago
          </Text>

          {currentUser?._id === user._id?.toString() && (
            <DeleteIcon 
            cursor = {"pointer"} 
            onClick={handleDeletePost} />
          )}
        </Flex>
      </Flex>

      <Text my={3}>{post?.text}</Text>

      {post?.img && (
        <Box
          borderRadius={6}
          overflow={"hidden"}
          border={"1px solid"}
          borderColor={"gray.light"}
        >
          <Image src={post?.img} w={"full"} />
        </Box>
      )}

      <Flex gap={3} my={3}>
        <Actions Post={post} />
      </Flex>

      <Divider my={4} />

      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>👋</Text>

          <Text color={"gray.light"}>Get the App to like, reply and post</Text>
        </Flex>
        <Button> Get </Button>
      </Flex>

      <Divider my={4} />

      {post.replies?.map((reply) => (
         <Comment
         key = {reply.userId.toString()}
         reply = {reply}
         lastreply = {reply?.userId === post.replies[post.replies.length - 1]?.userId}
       />
      )
      )}
     
    </>
  );
};

export default PostPage;
