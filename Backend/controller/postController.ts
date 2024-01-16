import { Request, Response } from 'express';
import User from '../models/userModel';
import Post from '../models/postModal';

const createPost = async (req: Request, res: Response) => {
    try{
        
        const userId = req.headers.userId;

        const {postedBy, text, img} = req.body;

        if(!postedBy || !text){
            return res.status(400).json({error: "postedBy and text are required"});
        }

        const user = await User.findById(postedBy);

        if(!user){
            return res.status(400).json({error: "User not found"});
        }
        
        if(user._id.toString() !== userId){
            return res.status(400).json({error: "User not authorized"});
        }

        const maxLength = 500;

        if(text.length > maxLength){
            return res.status(400).json({error: `Text must be less than ${maxLength} characters`});
        }

        const newPost = new Post({postedBy, text, img});
        
        await newPost.save();

        res.status(201).json({message: "Post created successfully", post: newPost});


    }
    catch(err){
        res.status(500).json({error: (err as Error).message})
        console.log((err as Error).message)
    }
}

const getPost = async (req: Request, res: Response) => {


    try{

        const post = await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({error: "Post not found"});
        }
        res.status(200).json({post});

    }

    catch(e){
        res.status(500).json({error: (e as Error).message})
        console.log((e as Error).message)
    
    }

}

const deletePost = async( req: Request, res: Response) => {

    try{

        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({error: "Post not found"});
        }

        if(post.postedBy.toString() !== req.headers.userId){
            return res.status(400).json({error: "User not authorized"});
        }

        await Post.findByIdAndDelete(req.params.id);
        
        res.status(200).json({message: "Post deleted successfully"});


    }

    catch(e){
        res.status(500).json({error: (e as Error).message})
        console.log((e as Error).message)
    
    }


}

const likeUnlikePost = async(req: Request, res: Response) => {
    try{

        const {id:postId} = req.params;
        const userId = req.headers.userId;

        if(typeof userId !== "string"){
            return res.status(400).json({error: "User not authorized"});
        }


        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({error: "Post not found"});
        }

        
        const userLikedpost = post.likes.includes(userId);
        if(userLikedpost){
            //unlike post
            await Post.findByIdAndUpdate(postId, {$pull: {likes: userId}});
            res.status(200).json({message: "Post unliked successfully"});
        }
        else{
            //like post
            await Post.findByIdAndUpdate(postId, {$push: {likes: userId}});
            res.status(200).json({message: "Post liked successfully"});
        }
    }

    catch(e){
        res.status(500).json({error: (e as Error).message})
        console.log((e as Error).message)
    
    }


}

const replyToPost = async(req: Request, res: Response) => {
    try{

        const {text} = req.body;
        const {id:postId} = req.params;
        const userId = req.headers.userId;
        
        if(!userId){
            return res.status(400).json({error: "User not authorized"});
        }

        const user = await User.findById(userId);



        const id = user?._id;
        const userProfilePic = user?.profilePic;
        const username = user?.username;

        if(!text){
            return res.status(400).json({errore: "Text is required"});
        }

        const post = await Post.findById(postId);

   
        if(!post){
            return res.status(404).json({error: "Post not found"});
        }

        const reply = {userId:id, text , userProfilePic, username}

        post.replies.push(reply);

        await post.save();

        res.status(200).json({message: "Reply added successfully", post});
    }
    catch(err){
        res.status(500).json({error: (err as Error).message})
        console.log((err as Error).message)
    
    }
}

const getFeedPost = async(req: Request, res: Response) => {
    try{

        const userId = req.headers.userId;
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({error: "User not found"});
        }

        const following = user.following;

        const feedPosts = await Post.find({postedBy: {$in: following}}).sort({createdAt: -1});

        res.status(200).json({feedPosts});

    }

    catch(e){
        res.status(500).json({error: (e as Error).message})
        console.log((e as Error).message)
    
    }
}
export  {getFeedPost,replyToPost,likeUnlikePost, createPost, getPost, deletePost};