import express from "express";
import dotenv from "dotenv";
import connectDB  from "../db/connectDb"
import { urlencoded } from "body-parser";
import cookieParser from "cookie-parser";
import userRoute from "../routes/userRoute";
import postRoutes from "../routes/postRoutes";
import {v2 as cloudinary} from "cloudinary";

dotenv.config();
connectDB();



const app = express();


const PORT = process.env.PORT || 5000;


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

app.use(express.json({limit: "50mb"}));
app.use(urlencoded({extended: true}));
app.use(cookieParser());


app.use("/api/users", userRoute);
app.use("/api/posts", postRoutes);

app.get("/", (req, res) => {
    res.send("Hello World");
})

app.listen(PORT, ()=> console.log(`Server running on http://localhost:${PORT}`));