import express from "express";
import {getFeedPost,replyToPost,getPost,createPost, deletePost,likeUnlikePost} from "../controller/postController";
import protectRoute from "../middleware/protecRoute";

const router = express.Router();

router.get("/feed", protectRoute, getFeedPost);
router.get("/:id", getPost);
router.post("/create",protectRoute,createPost);
router.delete("/:id", protectRoute, deletePost);
router.post("/like/:id", protectRoute, likeUnlikePost);
router.post("/reply/:id", protectRoute, replyToPost)

export default router;