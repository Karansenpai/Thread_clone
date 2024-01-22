import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";
import mongoose from "mongoose";



type replyType = {
  userId: mongoose.Schema.Types.ObjectId;
  text: string;
  userProfilePic: string;
  username: string;
};


type CommentProps = {
  reply: replyType;
  lastreply: boolean; 
};


const Comment: React.FC<CommentProps> = ({reply,lastreply}) => {


  return (
    <>
      <Flex gap={4} py={2} my={2} w={"full"}>
        <Avatar src={reply?.userProfilePic} size="sm" />
        <Flex gap={1} w={"full"} flexDirection={"column"}>
          <Flex w="full" justifyContent={"space-between"} alignItems={"center"}>
            <Text fontSize={"sm"} fontWeight={"bold"}>
              {reply?.username}
            </Text>

           
          </Flex>

          <Text>{reply?.text}</Text>
         
        </Flex>
      </Flex>

      {lastreply ? null : <Divider my={4} />}
    </>
  );
};

export default Comment;
