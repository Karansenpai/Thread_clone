import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";

const UserPage = () => {
  return (
    <>
        <UserHeader/>
        <UserPost likes={1200} replies={81} postImage="/post1.png" postTitle="Let's talk about threads."/>
        <UserPost likes={451} replies={11} postImage="/post2.png" postTitle="Nice Tutorial."/>
        <UserPost likes={321} replies={421} postImage="/post3.png" postTitle="Yo dude X sucks."/>
        <UserPost likes={1100} replies={48} postTitle="This is my first thread"/>
    </>
  );
};

export default UserPage;
