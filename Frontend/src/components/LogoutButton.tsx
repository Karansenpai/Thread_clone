import { Button } from "@chakra-ui/react"
import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import {FiLogOut} from "react-icons/fi"
import {BASE_URL} from "../config"
const LogoutButton = () => {

  const setUser = useSetRecoilState(userAtom)
  const showToast = useShowToast();
  const handleLogout = async() => {
    try{
        
        //fetch
        const res = await fetch(`${BASE_URL}/api/users/logout`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await res.json();
        if(data.error){
          showToast("Error", data.error, "error")
          return;
        }
        localStorage.removeItem("user-threads");
        setUser([]);
    }

    catch(e){
        showToast("Error", (e as Error).message, "error");
    }
  }
  return  (
    <Button
        position = {"fixed"}
        top = {"30px"}
        right = {"30px"}
        size = {"sm"}
        onClick={handleLogout}
    >

        <FiLogOut size={20}/>
    </Button>
  )
}

export default LogoutButton