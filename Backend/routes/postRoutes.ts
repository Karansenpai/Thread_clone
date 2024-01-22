import express from "express";
import {getFeedPost,replyToPost,getPost,createPost, deletePost,likeUnlikePost,getUserPosts} from "../controller/postController";
import protectRoute from "../middleware/protecRoute";

const router = express.Router();

router.get("/feed", protectRoute, getFeedPost);
router.get("/:id", getPost);
router.get("/user/:username", getUserPosts);
router.post("/create",protectRoute,createPost);
router.delete("/:id", protectRoute, deletePost);
router.put("/like/:id", protectRoute, likeUnlikePost);
router.put("/reply/:id", protectRoute, replyToPost)

export default router;