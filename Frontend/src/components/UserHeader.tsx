import {
  Avatar,
  Box,
  Button,
  Flex,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { useToast } from "@chakra-ui/react";
import { useState } from "react";
import userAtom from "../atoms/userAtom";
import { useRecoilValue } from "recoil";
import { Link as RouterLink } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import mongoose from "mongoose";
import {BASE_URL} from "../config"

type userType = {
  _id?: mongoose.Types.ObjectId;
  name: string;
  username: string;
  profilePic: string;
  followers: string[];
  following: string[];
  posts?: string[];
  bio: string;
};



type currentUserType = {
  _id: string;
  name: string;
  username: string;
  bio: string;
  profilePic: string;
};



const UserHeader = ({ user }: { user: userType }) => {
  const toast = useToast();

  const showToast = useShowToast();

  const currentUser: currentUserType = useRecoilValue(userAtom);

  const [updating , setUpdating] = useState(false);

  const [following, setFollowing] = useState(
    user.followers.includes(currentUser?._id)
  );

  const copyUrl = (): void => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      toast({
        description: "Copied to clipboard",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    });
  };

  const handleFollowUnfollow = async () => {

    if(!currentUser){
      showToast("Error","Please login first","error");
      return;
    }

    if(updating) return;
    
    setUpdating(true);

    try {
      const res = await fetch(`/api/users/follow/${user._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      if(following){
        showToast("Success", "Unfollowed successfully", "success");
        user.followers.pop();
      } else{
        showToast("Success", "Followed successfully", "success");
        user.followers.push(currentUser?._id.toString());
      }
      setFollowing(!following);

    } catch (err) {
      showToast("Error", (err as Error).message, "error");
    } finally{
      setUpdating(false)
    }
  };
  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text fontSize={"2xl"} fontWeight={"bold"}>
            {user.name}
          </Text>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"xs"}>{user.username}</Text>
            <Text
              fontSize={"xs"}
              bg={"gray.dark"}
              color={"gray.light"}
              p={1}
              borderRadius={"full"}
            >
              Thread.net
            </Text>
          </Flex>
        </Box>
        <Box>
          {user.profilePic && (
            <Avatar
              name={user.name}
              src={user.profilePic}
              size={{
                base: "md",
                md: "xl",
              }}
            />
          )}

          {!user.profilePic && (
            <Avatar
              name={user.name}
              src="https://bit.ly/broken-link"
              size={{
                base: "md",
                md: "xl",
              }}
            />
          )}
        </Box>
      </Flex>

      <Text>{user.bio}</Text>

      {currentUser?._id === user._id?.toString() && (
        <Link as={RouterLink} to="/update">
          <Button size={"sm"}>Update Profile</Button>
        </Link>
      )}

      {currentUser?._id !== user._id?.toString() && (
        <Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}>
          {following ? "Unfollow" : "Follow"}
        </Button>
      )}

      <Flex width={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"}>{user.followers.length} Follower</Text>
          <Box w="1" h="1" bg={"gray.light"} borderRadius={"full"}></Box>
          <Link color={"gray.light"}>instagram.com</Link>
        </Flex>
        <Flex gap={2}>
          <Box className="icon-container">
            <BsInstagram size={24} cursor={"pointer"} />
          </Box>
          <Box className="icon-container">
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor={"pointer"} />
              </MenuButton>
              <Portal>
                <MenuList bg={"gray.dark"}>
                  <MenuItem bg={"gray.dark"} onClick={copyUrl}>
                    Copy link
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>

      <Flex w={"full"}>
        <Flex
          flex={1}
          borderBottom={"1.5px solid white"}
          justifyContent={"center"}
          pb={"3"}
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}>Threads</Text>
        </Flex>
        <Flex
          flex={1}
          borderBottom={"1px solid gray"}
          justifyContent={"center"}
          color={"gray.light"}
          pb={"3"}
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}>Replies</Text>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default UserHeader;
