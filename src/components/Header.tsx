import { Link, Flex, Image, useColorMode, Button } from "@chakra-ui/react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { FiLogOut } from "react-icons/fi";
import useLogout from "../hooks/useLogout";
import { authScreenAtom } from "../atoms/authAtom";

const Header = () => {
  const user = useRecoilValue(userAtom);
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const logout = useLogout();

  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Flex justifyContent={"space-between"} mt={6} mb={12}>
      {user.length !== 0 && (
        <Link as={RouterLink} to="/">
          <AiFillHome size={24} />
        </Link>
      )}

      {user.length === 0 && (
        <Link as={RouterLink} to ={"/auth"} onClick={
          () => setAuthScreen("login")
        }>
          Login
        </Link>
      )}

      <Image
        cursor={"pointer"}
        alt="logo"
        w={6}
        src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
        onClick={toggleColorMode}
      />

      {user.length !== 0 && (
        <Flex alignItems={"center"} gap ={4}>
          <Link as={RouterLink} to={`/${user.username}`}>
            <RxAvatar size={24} />
          </Link>
          <Button size={"xs"} onClick={logout}>
            <FiLogOut size={20} />
          </Button>
        </Flex>
      )}

      {user.length === 0 && (
        <Link as={RouterLink} to ={"/auth"} onClick={
          () => setAuthScreen("signup")
        }>
          Sign Up
        </Link>
      )}
    </Flex>
  ); 
};

export default Header;
