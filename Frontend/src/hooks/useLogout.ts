import { useSetRecoilState } from 'recoil';
import useShowToast from './useShowToast';
import userAtom from '../atoms/userAtom';
import {BASE_URL} from "../config"

const useLogout = () => {

    const setUser = useSetRecoilState(userAtom); 
    const showToast = useShowToast();
    const logout = async() => {
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
    return logout;
}

export default useLogout