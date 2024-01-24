import { atom } from "recoil";


const defaultUserThreads = "[]"; 
const userAtom = atom({
    key: "userAtom",
    
    default: JSON.parse(localStorage.getItem("user-threads") || defaultUserThreads)
})

export default userAtom;