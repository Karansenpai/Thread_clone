import { atom } from 'recoil';
import mongoose from 'mongoose';



type replyType ={
    userId: mongoose.Schema.Types.ObjectId,
    text: string,
    userProfilePic:string,
    username: string,
  }
  
interface PostType {
    _id: mongoose.Types.ObjectId;
    postedBy: mongoose.Types.ObjectId;
    text: string;
    createdAt: string;
    likes: string[];
    replies: replyType[];
    updatedAt: string;
    img?: string;
}


const postAtom = atom({
    key: 'postAtom',
    default: [] as PostType[],
});

export default postAtom;