import { atom } from "recoil";


const authScreenAtom = atom({
    key: "authScreenAtom",
    default: "login",
})

export {authScreenAtom}