
import jwt from "jsonwebtoken";




export const sellerAuth = (req, res, next) => {
    try {
       // const { token } = req.cookies;
// Retrieve token from cookies or headers
   // const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];

 const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({ message: "seller not autherised , Please login.", success: false });
        }

        const tokenVerified = jwt.verify(token, process.env.JWT_SECRET_KEY);
        
        if (!tokenVerified) {
            return res.status(401).json({ message: "seller not autherised", success: false });
        }
        
        if(tokenVerified.role != 'seller' ){
            return res.status(401).json({ message: "seller not autherised", success: false });
        }

        req.seller = tokenVerified;
        

        next();
    } catch (error) {
        return res.status(401).json({ message: error.message || "seller autherization failed", success: false });
    }
};

