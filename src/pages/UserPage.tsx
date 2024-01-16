import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";

const UserPage = () => {
  const [user, setUser] = useState(null);

  const { username } = useParams();

  const showToast = useShowToast();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/profile/${username}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setUser(data);
      } catch (err) {
        showToast("Error", (err as Error).message, "error");
      } finally {
        setLoading(false);
      }
    };

    getUser();
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
      <UserPost
        likes={1200}
        replies={81}
        postImage="/post1.png"
        postTitle="Let's talk about threads."
      />
      <UserPost
        likes={451}
        replies={11}
        postImage="/post2.png"
        postTitle="Nice Tutorial."
      />
      <UserPost
        likes={321}
        replies={421}
        postImage="/post3.png"
        postTitle="Yo dude X sucks."
      />
      <UserPost likes={1100} replies={48} postTitle="This is my first thread" />
    </>
  );
};

export default UserPage;
