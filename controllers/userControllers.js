import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/token.js";

export const userSignup = async (req, res, next) => {
    try {
        console.log("hitted");

        const { name, email, password, phone, dob,shippingaddress,billingaddress,profilepic,created_at } = req.body;

        if (!name || !email || !password || !phone || !dob || !shippingaddress || !billingaddress) {
            return res.status(400).json({ message: "all fields are required" });
        }

        const isUserExist = await User.findOne({ email });

        if (isUserExist) {
            return res.status(400).json({ message: "user already exist" });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

     

        const userData = new User({ name, email, password: hashedPassword, phone,dob,shippingaddress,billingaddress, profilepic,created_at });
        await userData.save();

        const token = generateToken(userData._id);
        res.cookie("token", token);
// Exclude password from the response 
 //const userResponse = userData.toObject();
  //delete userResponse.password;
    
      return res.json({ data: userData, message: "user account created" });
       
     // return res.json({ data: userData, message: "user account created" });

    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};

export const userLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "all fields are required" });
        }

        const userExist = await User.findOne({ email });

        if (!userExist) {
            return res.status(404).json({ message: "user does not exist" });
        }

        const passwordMatch = bcrypt.compareSync(password, userExist.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: "user not authenticated" });
        }

        const token = generateToken(userExist._id,'user');
        res.cookie("token", token);

        return res.json({ data: userExist, message: "user login success" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};

export const userProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const userData = await User.findById(userId).select("-password");
        return res.json({ data: userData, message: "user profile fetched" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};
export const userforgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        const userData = await User.findOne({ email });

        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate a reset token and send it via email (implementation not shown)
        const resetToken = generateToken(User._id);
        // Send resetToken via email to the user (implementation not shown)

        return res.json({ message: "Password reset link sent to your email" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};

export const userchangePassword = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }


        const userData = await User.findById(userId);

        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        const passwordMatch = bcrypt.compareSync(oldPassword, userData.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Old password is incorrect" });
        }

        userData.password = bcrypt.hashSync(newPassword, 10);
        await userData.save();

        return res.json({ message: "Password changed successfully" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};

export const userAccountDeActivate = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const userData = await User.findById(userId).select("-password");
        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        userData.isActive=false
        await userData.save();
        return res.json({ data: userData, message: "User account deactivated successfully" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};


export const userAccountActivate = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const userData = await User.findById(userId).select("-password");

        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        userData.isActive = true;
        await userData.save();

        return res.json({ message: "User account activated successfully" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};



export const checkUser = async (req, res, next) => {
    try {
        const { email } = req.body;

        const userData = await User.findOne({ email });

        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.json({ message: "User exists" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};

export const updateUserProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;// Get user ID from URL parameter
        const { name, email, phone, dob, shippingaddress, billingaddress, profilepic } = req.body;

        const userData = await User.findById(userId);

        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        userData.name = name || userData.name;
        userData.email = email || userData.email;
        userData.phone = phone || userData.phone;
        userData.dob = dob || userData.dob;
        userData.shippingaddress = shippingaddress || userData.shippingaddress;
        userData.billingaddress = billingaddress || userData.billingaddress;
        userData.profilepic = profilepic || userData.profilepic;

        const updatedUser = await userData.save();
         

        // Exclude password from the response
        const userResponse = updatedUser.toObject();
        delete userResponse.password;


        return res.json({ data: userResponse, message: "User profile updated successfully" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};


export const userLogout = async (req, res, next) => {
    try {
        res.clearCookie("token");

        return res.json({ message: "user logout success" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};



export const deleteUser = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const userData = await User.findById(userId).select("-password");

        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

      await userData.remove();

        return res.json({ message: "User account deleted successfully" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};
