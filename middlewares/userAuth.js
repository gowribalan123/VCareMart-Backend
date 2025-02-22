import jwt from "jsonwebtoken";

export const userAuth = (req, res, next) => {
    try {
        const { token } = req.cookies ;
        // Uncomment if you want to support Bearer tokens in headers
          //token = req.headers['authorization']?.split(' ')[1];
    
        
        if (!token) {
            return res.status(401).json({ message: "User not authorized", success: false });
        }

        const tokenVerified = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (!tokenVerified) {
            return res.status(401).json({ message: "User not authorized", success: false });
        }

        req.user = tokenVerified;
        next();
    } catch (error) {
        const errorMessage = error.message || "User authorization failed";
        return res.status(401).json({ message: errorMessage, success: false });
    }
};
