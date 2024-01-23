import {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom';
import useShowToast from './useShowToast';
import mongoose from 'mongoose';
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


const defaultUser = {
  name: "",
  username: "",
  profilePic: "",
  bio: "",
  followers: [],
  following: [],
};


const useGetUserProfile = () => {

  const [user,setUser] = useState<userType>(defaultUser);
  const [loading, setLoading] = useState(false);

  const {username} = useParams();
  const showToast = useShowToast();


  useEffect(()=>{
    const getUser = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/users/profile/${username}`);
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

  },[username])

  return {user, loading}
    
}

export default useGetUserProfile