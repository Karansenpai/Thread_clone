import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  CloseButton,
  Flex,
  FormControl,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { BsFillImageFill } from "react-icons/bs";
import usePreviewImage from "../hooks/usePreviewImage";
import { useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import postAtom from "../atoms/postAtom";
import { useParams } from "react-router-dom";

const MAX_CHARS = 500;

const CreatePost = () => {
  const showToast = useShowToast();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [postText, setPostText] = useState("");

  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImage();

  const imageRef = useRef<HTMLInputElement>(null);

  const [remainingChars, setRemainingChars] = useState(MAX_CHARS);

  const user = useRecoilValue(userAtom);

  const [loading, setLoading] = useState(false);

  const [posts, setPosts] = useRecoilState(postAtom);

  const {username} = useParams();

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputText = e.target.value;

    if (inputText.length > MAX_CHARS) {
      const truncatedText = inputText.slice(0, MAX_CHARS);
      setPostText(truncatedText);
      setRemainingChars(0);
    } else {
      setPostText(inputText);
      setRemainingChars(MAX_CHARS - inputText.length);
    }
  };

  const handleCreatePost = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postedBy: user._id,
          text: postText,
          img: imgUrl,
        }),
      });

      const data = await res.json();

      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      if (username === user.username) {
        setPosts([data, ...posts]);
      }
      showToast("Success", "Post created successfully", "success");

      onClose();
      setPostText("");
      setImgUrl("");
    } catch (err) {
      showToast("Error", (err as Error).message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        position={"fixed"}
        bottom={10}
        right={5}
        bg={useColorModeValue("gray.300", "gray.dark")}
        onClick={onOpen}
        size={{ base: "sm", sm: "md" }}
      >
        <AddIcon />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />

        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Textarea
                placeholder="Post content goes here"
                onChange={handleTextChange}
                value={postText}
              />

              <Text
                fontSize="xs"
                fontWeight={"bold"}
                textAlign={"right"}
                m={1}
                color={"gray.800"}
              >
                {remainingChars}/{MAX_CHARS}
              </Text>

              <Input
                type="file"
                hidden
                ref={imageRef}
                onChange={handleImageChange}
              ></Input>

              <BsFillImageFill
                style={{ marginLeft: "5px", cursor: "pointer" }}
                size={16}
                onClick={() => imageRef.current?.click()}
              />
            </FormControl>

            {imgUrl && (
              <Flex mt={5} w={"full"} position={"relative"}>
                <Image
                  src={imgUrl ? String(imgUrl) : undefined}
                  alt="Selected img"
                />
                <CloseButton
                  onClick={() => setImgUrl("")}
                  bg={"gray.800"}
                  position={"absolute"}
                  top={2}
                  right={2}
                />
              </Flex>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleCreatePost}
              isLoading={loading}
            >
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreatePost;
