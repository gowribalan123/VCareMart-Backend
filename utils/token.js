import jwt from "jsonwebtoken";

export const generateToken = (id, role) => {
    try {
        // Create the token with the user ID and role
        const token = jwt.sign({ id: id, role: role || "user" }, process.env.JWT_SECRET_KEY, 
           // {
          //  expiresIn: '1h' // Optional: Set expiration time
//}
);
        return token;
    } catch (error) {
        console.error(error); // Log the error for debugging
        throw new Error(error.message || "Internal server Error"); // Throw an error to be handled by the calling function
    }
};
