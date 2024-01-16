import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import Actions from "./Actions";
import React, { useState } from "react";


type CommentProps = {
  comment: string;
  createdAt: string;
  username: string;
  userAvatar: string;
  likes: number;
};

const Comment: React.FC<CommentProps> = ({comment,createdAt,userAvatar,username,likes}) => {
  const [liked, setLiked] = useState<boolean>(false);

  return (
    <>
      <Flex gap={4} py={2} my={2} w={"full"}>
        <Avatar src={userAvatar} size="sm" />
        <Flex gap={1} w={"full"} flexDirection={"column"}>
          <Flex w="full" justifyContent={"space-between"} alignItems={"center"}>
            <Text fontSize={"sm"} fontWeight={"bold"}>
              {username}
            </Text>

            <Flex gap={2} alignItems={"center"}>
              <Text fontSize={"sm"} color="gray.light">
                {createdAt}
              </Text>

              <BsThreeDots />
            </Flex>
          </Flex>

          <Text>{comment}</Text>
          <Actions liked={liked} setLiked={setLiked} />

          <Text fontSize={"sm"} color="gray.light">
            {likes + (liked ? 1 : 0)} likes
          </Text>
        </Flex>
      </Flex>

      <Divider />
    </>
  );
};

export default Comment;
