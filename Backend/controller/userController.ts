import User from "../models/userModel";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { generateAndSetCookie } from "../utils/helpers/generateTokenAndSetCookies";
import {v2 as cloudinary} from "cloudinary";

const getUserProfile = async (req: Request, res: Response) => {
    const username = req.params.id;

    try {
        const user = await User.findOne({ username }).select("-password").select("-updatedAt");

        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        res.status(200).json(user);
    } catch (e) {
        res.status(500).json({error: (e as Error).message });
        console.log("Error in message: ", (e as Error).message);
    }
}

const singupUser = async(req: Request,res: Response) => {

    try{

        const {name, email,username, password} = req.body;
        const user = await User.findOne({$or:[{email}, {username}]});

        if(user){
            return res.status(400).json({error: "User already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            name,
            email,
            username,
            password: hashedPassword,
        });
        
        await newUser.save();

        if(newUser){


            generateAndSetCookie(newUser._id, res);
            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                username: newUser.username,
                bio: newUser.bio,
                profilePic: newUser.profilePic,
            });
        } else{
            res.status(400).json({error: "Invalid user data"});
        }

    }
    catch(err){
        res.status(500).json({error: (err as Error).message})
        console.log("Error in message: ", (err as Error).message)
    }

} 

const loginUser = async(req: Request,res: Response) => {
    try{
        const {username, password} = req.body;

        const user = await User.findOne({username});

        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");


        if(!user || !isPasswordCorrect){
            return res.status(400).json({error: "Invalid username or password"});
        }

        generateAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            bio: user.bio,
            profilePic: user.profilePic,
          
        })

    }
    catch(err){
        res.status(500).json({error: (err as Error).message})
        console.log("Error in message: ", (err as Error).message)
    }


}

const logoutUser = async(req: Request,res: Response) => {
    try{
        res.cookie("jwt", "", {
            maxAge: 1
        });
        res.status(200).json({message: "User logged out successfully"});
    }
    catch(err){
        res.status(500).json({error: (err as Error).message})
        console.log("Error in message: ", (err as Error).message)
    }

}

const followUnfollowUser = async(req: Request,res: Response) => {

    try{
        const {id} = req.params;
        const userId = req.headers.userId;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(userId);

        if( id === req.headers.userId){
            return res.status(400).json({error: "You can't follow/unfollow yourself"});
        }

        if(!userToModify || !currentUser){
            return res.status(400).json({error: "User not found"});
        }

        const isFollowing = currentUser.following.includes(id);

        if(isFollowing){
            //unfollow user
            await User.findByIdAndUpdate(userId, {$pull: {following: id}});
            await User.findByIdAndUpdate(id, {$pull: {followers: userId}});
            res.status(200).json({message: "User unfollowed successfully"});
        }
        else{

            //follow user
            await User.findByIdAndUpdate(userId, {$push: {following: id}});
            await User.findByIdAndUpdate(id, {$push: {followers: userId}});
            res.status(200).json({message: "User followed successfully"});
        }

    } catch(err){
        res.status(500).json({error: (err as Error).message})
        console.log("Error in message: ", (err as Error).message)
    }
}

const updateUser = async(req: Request, res: Response) => {

    const {username, name, email, password, bio} = req.body;
    let {profilePic} = req.body;
    const userId = req.headers.userId;
    try{

        let user = await User.findById(userId);
        
        if(!user){
            return res.status(400).json({error: "User not found"});
        }
        

        if(req.params.id !== userId){
            return res.status(400).json({error: "You can't update other user's profile"});
        }
        if(password){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user.password = hashedPassword;   

        }

        if(profilePic){
            if(user.profilePic){
                await cloudinary.uploader.destroy(user.profilePic.split("/").pop()?.split(".")[0] || "");
            }
            const uploadedResponse = await cloudinary.uploader.upload(profilePic);
            profilePic = uploadedResponse.secure_url;
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.username = username || user.username;
        user.profilePic = profilePic || user.profilePic;
        user.bio = bio || user.bio;


        user = await user.save();
        
        user.password = "";
        res.status(200).json(user)





    }
    catch(e){
        res.status(500).json({error: (e as Error).message})
        console.log("Error in message: ", (e as Error).message)
    }

}

export {getUserProfile,updateUser,singupUser, loginUser, logoutUser, followUnfollowUser};