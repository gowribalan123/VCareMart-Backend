import jwt from "jsonwebtoken";
//import { User } from "../models/userModel.js";

export const userAuth = (req, res, next) => {
    try {
       const { token } = req.cookies;
      //const token = req.headers['authorization']?.split(' ')[1]; // Assuming Bearer token

        if (!token) {
            return res.status(401).json({ message: "user not autherised", success: false });
        }

        const tokenVerified = jwt.verify(token, process.env.JWT_SECRET_KEY);
        
        if (!tokenVerified) {
            return res.status(401).json({ message: "user not autherised", success: false });
        }

        req.user = tokenVerified;

        next();
    } catch (error) {
        return res.status(401).json({ message: error.message || "user autherization failed", success: false });
    }
};