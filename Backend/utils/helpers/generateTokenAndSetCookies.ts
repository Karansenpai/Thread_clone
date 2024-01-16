import jwt from "jsonwebtoken";
import { Response } from "express";
import {Types} from "mongoose";


const generateAndSetCookie = async (userId: Types.ObjectId, res:Response) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET || "", {
        expiresIn: "15d",
    })

    res.cookie("jwt", token, {
        httpOnly: true, // client side js can't access the cookie
        maxAge: 1000 * 60 * 60 * 24 * 15, // 15 days
        sameSite: "strict",
    });

    return token;
}

export {generateAndSetCookie};