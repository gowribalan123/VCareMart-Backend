import jwt from "jsonwebtoken";

export const generateToken = (id,role)=>{
    try{
        var token =jwt.sign({id:id , role:role || "user"},process.env.JWT_SECRET_KEY);
        return token;

    }catch(error){
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || "Internal server Error" });
    }
};