import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
} from "@chakra-ui/react";

import { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import usePreviewImage from "../hooks/usePreviewImage";
import useShowToast from "../hooks/useShowToast";
import {BASE_URL} from "../config"
export default function UpdateProfilePage() {
  const [user, setUser] = useRecoilState(userAtom);

  const [inputs, setInputs] = useState({
    name: user.name,
    username: user.username,
    email: user.email,
    bio: user.bio,
    password: "",
  });

  const showToast = useShowToast();

  const [updating, setUpdating] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(updating) return;
    setUpdating(true);

    try {

      const res = await fetch(`${BASE_URL}/api/users/update/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...inputs, profilePic: imgUrl }),
      });

      const data = await res.json();

      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      showToast("Success", "Profile updated successfully", "success");
      setUser(data);

      localStorage.setItem("user-threads", JSON.stringify(data));
    } catch (err) {
      showToast("Error", (err as Error).message, "error");
    } finally{
      setUpdating(false);
    }
  };

  const { handleImageChange, imgUrl } = usePreviewImage();

  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <form onSubmit={handleSubmit}>
      <Flex align={"center"} justify={"center"} my={6}>
        <Stack
          spacing={4}
          w={"full"}
          maxW={"md"}
          bg={useColorModeValue("white", "gray.dark")}
          rounded={"xl"}
          boxShadow={"lg"}
          p={6}
        >
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
            User Profile Edit
          </Heading>
          <FormControl id="userName">
            <Stack direction={["column", "row"]} spacing={6}>
              <Center>
                <Avatar
                  size="xl"
                  boxShadow={"md"}
                  src={imgUrl || user.profilePic}
                />
              </Center>
              <Center w="full">
                <Button w="full" onClick={() => fileRef.current?.click()}>
                  Change Avatar
                </Button>
                <Input
                  type="file"
                  hidden
                  ref={fileRef}
                  onChange={handleImageChange}
                />
              </Center>
            </Stack>
          </FormControl>
          <FormControl>
            <FormLabel>Full name</FormLabel>
            <Input
              placeholder="John Doe"
              value={inputs.name}
              onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
              _placeholder={{ color: "gray.500" }}
              type="text"
            />
          </FormControl>
          <FormControl>
            <FormLabel>User name</FormLabel>
            <Input
              placeholder="johndoe"
              value={inputs.username}
              onChange={(e) =>
                setInputs({ ...inputs, username: e.target.value })
              }
              _placeholder={{ color: "gray.500" }}
              type="text"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Email address</FormLabel>
            <Input
              placeholder="your-email@example.com"
              value={inputs.email}
              onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
              _placeholder={{ color: "gray.500" }}
              type="email"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Bio</FormLabel>
            <Input
              placeholder="Your bio."
              value={inputs.bio}
              onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
              _placeholder={{ color: "gray.500" }}
              type="text"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              placeholder="password"
              value={inputs.password}
              onChange={(e) =>
                setInputs({ ...inputs, password: e.target.value })
              }
              _placeholder={{ color: "gray.500" }}
              type="password"
            />
          </FormControl>
          <Stack spacing={6} direction={["column", "row"]}>
            <Button
              bg={"red.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "red.500",
              }}
            >
              Cancel
            </Button>
            <Button
              bg={"green.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "green.500",
              }}
              type="submit"
              isLoading={updating}
            >
              Submit
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </form>
  );
}
