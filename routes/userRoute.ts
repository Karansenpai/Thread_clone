import express from "express";
import { getUserProfile, updateUser,followUnfollowUser , logoutUser ,loginUser, singupUser } from "../controller/userController";
import protectRoute from "../middleware/protecRoute";

const router = express.Router();

router.get("/profile/:query", getUserProfile);
router.post("/signup", singupUser );
router.post("/login", loginUser );
router.post("/logout", logoutUser)
router.post("/follow/:id",protectRoute,followUnfollowUser);
router.put("/update/:id",protectRoute,updateUser);


export default router;