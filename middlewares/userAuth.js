import jwt from "jsonwebtoken";

export const userAuth = (req, res, next) => {
    try {
        // Retrieve token from cookies or headers
        const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];

        // If you want to support localStorage, this part should be handled on the client-side
        // Local storage access is not available on the server-side
        // const getTokenFromLocalStorage = localStorage.getItem("user")
        //     ? JSON.parse(localStorage.getItem("user")).token
        //     : null;

        // Use token from cookies or headers
        if (!token) {
            return res.status(401).json({ message: "User not authorized", success: false });
        }

        // Verify the token
        const tokenVerified = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (!tokenVerified) {
            return res.status(401).json({ message: "User not authorized", success: false });
        }

        // Attach user information to the request object
        req.user = tokenVerified;
        next();
    } catch (error) {
        const errorMessage = error.message || "User authorization failed";
        return res.status(401).json({ message: errorMessage, success: false });
    }
};