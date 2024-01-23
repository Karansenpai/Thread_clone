import { Request, Response, NextFunction } from "express";
import  jwt  from "jsonwebtoken";

const protectRoute = async(req: Request, res: Response, next: NextFunction) => {
    try {

        
        const token = req.cookies.jwt;
        console.log(token);
        if (!token) {
            return res.status(401).json({ message: "You need to be logged in" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "");


        if(!decoded){
            return res.status(403).json({message: "Invalid token"})
        }

        if( typeof decoded === "string"){
            return res.status(403).json({message: "Invalid token"})
        }

        req.headers["userId"] = decoded.userId; 
        next();
    }
    catch (err) {
        res.status(500).json({ message: (err as Error).message });
        console.log("Error in message: ", (err as Error).message);
    }
} 

export default protectRoute;

