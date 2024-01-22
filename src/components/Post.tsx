import { Avatar } from "@chakra-ui/avatar";
import { Image } from "@chakra-ui/image";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import mongoose from "mongoose";
import Actions from "./Actions";
import useShowToast from "../hooks/useShowToast";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

type replyType = {
  userId: mongoose.Schema.Types.ObjectId;
  text: string;
  userProfilePic: string;
  username: string;
};

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

type PostProps = {
  post: PostType;
  postedBy: mongoose.Types.ObjectId;
};

type userType = {
  _id?: mongoose.Types.ObjectId;
  name: string;
  username: string;
  profilePic: string;
};

const defaultUser = {
  name: "",
  username: "",
  profilePic: "",
};


type currentUserType = {
  _id: string;
  name: string;
  username: string;
  bio: string;
  profilePic: string;
};


const Post: React.FC<PostProps> = ({ post, postedBy }) => {
  const showToast = useShowToast();
  const [user, setUser] = useState<userType>(defaultUser);

  const navigate = useNavigate();

  const currentUser: currentUserType = useRecoilValue(userAtom);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch("/api/users/profile/" + postedBy);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setUser(data);
      } catch (err) {
        showToast("Error", (err as Error).message, "error");
        setUser(defaultUser);
      }
    };
    getUser();
  }, [postedBy, showToast]);

  const handleDeletePost = async (e: React.MouseEvent) => {  
    try{
      e.preventDefault();
      if(!window.confirm("Are you sure you want to delete this post?")) return;

      const res = await fetch(`/api/posts/${post._id}`,{
        method: "DELETE",
      });

      const data = await res.json();
      if(data.error){
        showToast("Error",data.error,"error");
      }
      showToast("Success","Post deleted successfully","success");


    } 
    catch(err){
      showToast("Error", (err as Error).message, "error");
    }
  }

  return (
    <Link to={`/${user.username}/post/${post._id}`}>
      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar
            size="md"
            name={user?.name}
            src={user?.profilePic}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/${user.username}`);
            }}
          />
          <Box w="1px" h={"full"} bg="gray.light" my={2}></Box>
          <Box position={"relative"} w={"full"}>
            {post.replies.length === 0 && <Text textAlign={"center"}>🥱</Text>}
            {post.replies[0] && (
              <Avatar
                size="xs"
                name={"John doe"}
                src={post.replies[0].userProfilePic}
                position={"absolute"}
                top={"0px"}
                left="15px"
                padding={"2px"}
              />
            )}

            {post.replies[1] && (
              <Avatar
                size="xs"
                name="John doe"
                src={post.replies[1].userProfilePic}
                position={"absolute"}
                bottom={"0px"}
                right="-5px"
                padding={"2px"}
              />
            )}

            {post.replies[2] && (
              <Avatar
                size="xs"
                name="John doe"
                src="https://bit.ly/prosper-baba"
                position={"absolute"}
                bottom={"0px"}
                left="4px"
                padding={"2px"}
              />
            )}
          </Box>
        </Flex>
        <Flex flex={1} flexDirection={"column"} gap={2}>
          <Flex justifyContent={"space-between"} w={"full"}>
            <Flex w={"full"} alignItems={"center"}>
              <Text
                fontSize={"sm"}
                fontWeight={"bold"}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/${user.username}`);
                }}
              >
                {user?.username}
              </Text>
              <Image src="/verified.png" w={4} h={4} ml={1} />
            </Flex>
            <Flex gap={4} alignItems={"center"}>
              <Text
                fontSize={"xs"}
                width={36}
                textAlign={"right"}
                color={"gray.light"}
              >
                
                {formatDistanceToNow(new Date(post.createdAt))}
                ago
              </Text>

              {currentUser?._id === user._id?.toString() && (
                <DeleteIcon
                onClick={handleDeletePost}/>
              )}
            </Flex>
          </Flex>

          <Text fontSize={"sm"}>{post.text}</Text>
          {post.img && (
            <Box
              borderRadius={6}
              overflow={"hidden"}
              border={"1px solid"}
              borderColor={"gray.light"}
            >
              <Image src={post.img} w={"full"} />
            </Box>
          )}

          <Flex gap={3} my={1}>
            <Actions Post={post} />
          </Flex>

        </Flex>
      </Flex>
    </Link>
  );
};

export default Post;
