import { Admin } from "../models/adminModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/token.js";
import {Category } from "../models/categoryModel.js";  
import { cloudinaryInstance } from "../config/cloudinaryConfig.js";  
const NODE_ENV = process.env.NODE_ENV;

export const adminSignup = async (req, res, next) => {
    try {
      //  console.log("hitted");

       //const { name, email, password,role,created_at } = req.body;
       const { name, email, password,role, created_at } = req.body;
        if (!name || !email || !password|| !role ) {
            return res.status(400).json({ message: "all fields are required" });
        }

        const isAdminExist = await Admin.findOne({ email });

        if (isAdminExist) {
            return res.status(400).json({ message: "admin already exist" });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

     

        const adminData = new Admin({ name, email, password: hashedPassword,role,created_at });
        await adminData.save();

        const token = generateToken(adminData._id);
       // res.cookie("token", token);
// Exclude password from the response 
 //const sellerResponse = sellerData.toObject();
  //delete sellerResponse.password;
  res.cookie("token", token, {
    sameSite: NODE_ENV === "production" ? "None" : "Lax",
    secure: NODE_ENV === "production",
    httpOnly: NODE_ENV === "production",
});
    //  res.json({ success: true , message: "Admin account created" });
       
     return res.json({ data: adminData, message: "admin account created" });

    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};

export const adminLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "all fields are required" });
        }

        const adminExist = await Admin.findOne({email});

        if (!adminExist) {
            return res.status(404).json({ message: "Admin does not exist" });
        }

        const passwordMatch = bcrypt.compareSync(password, adminExist.password);
     //   console.log(password,adminExist.password,passwordMatch);
        if (!passwordMatch) {
            return res.status(401).json({ message: "admin not authenticated" });
        }

        const token = generateToken(adminExist._id,'admin');
        //res.cookie("token", token);
        res.cookie("token", token, {
            sameSite: NODE_ENV === "production" ? "None" : "Lax",
            secure: NODE_ENV === "production",
            httpOnly: NODE_ENV === "production",
        });
        return res.json({ success: true,  message: "admin login success" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};

export const adminProfile = async (req, res, next) => {
    try {
    // const adminId = req.admin.id;
    const { admin } =req;

        const adminData = await Admin.findById(admin.id).select("-password");
        return res.json({ data: adminData , message: "Admin profile fetched" ,adminData});
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};
export const adminForgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        const adminData = await Admin.findOne({ email });

        if (!adminData) {
            return res.status(404).json({ message: "admin not found" });
        }

        // Generate a reset token and send it via email (implementation not shown)
        const resetToken = generateToken(Admin._id);
        // Send resetToken via email to the seller (implementation not shown)

        return res.json({ message: "Password reset link sent to your email" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};

export const adminChangePassword = async (req, res, next) => {
    try {
        const adminId = req.admin.id;
        const { oldPassword, newPassword } = req.body;

        const adminData = await Admin.findById(adminId);

        if (!adminData) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const passwordMatch = bcrypt.compareSync(oldPassword, adminData.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Old password is incorrect" });
        }

        adminData.password = bcrypt.hashSync(newPassword, 10);
        await adminData.save();

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
            return res.status(404).json({ message:"user not found" });
        }

        userData.isActive=false
        await userData.save();
        return res.json({ data: userData, message: "user account deactivated successfully" });
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

export const checkAdmin = async (req, res, next) => {
    try {
        //const { email } = req.body;

        //const adminData = await Seller.findOne({ email });

        //if (!adminData) {
          //  return res.status(404).json({ message: "admin not found" });
        //}

        res.json({ success : true , message: "admin authorized" });
    } catch (error) {
        console.log(error);
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};


export const adminLogout = async (req, res, next) => {
    try {
        res.clearCookie("token", {
            sameSite: NODE_ENV === "production" ? "None" : "Lax",
            secure: NODE_ENV === "production",
            httpOnly: NODE_ENV === "production",
        });

     res.json({ success : true , message: "admin logged out" });
    } catch (error) {
        console.log(error);

        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};
export const deleteAdmin = async (req, res, next) => {
    try {
        const adminId = req.admin.id;

        const adminData = await Admin.findById(adminId).select("-password");

        if (!adminData) {
            return res.status(404).json({ message: "Admin not found" });
        }

        await adminData.deleteOne();

        return res.json({ message: "Admin account deleted successfully" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};

// Create a new category  
export const createCategory = async (req, res, next) => {  
    try {  
        
        // Ensure user is authenticated and get seller ID  
        if (!req.admin || !req.admin.id) {  
            console.log(req.admin);
            return res.status(401).json({ message: 'Admin not authenticated' });  
        }  
    // Destructure fields from the request body  

        const { name, description,admin} = req.body;  
        console.log("image====",req.file)

        

 
//req.file=image;

  // const { id } = req.user;
        // Check if the required fields are present  
        if (!name || !description ) {  
            return res.status(400).json({ message: "All fields are required" });  
        }  
       const adminId=req.admin.id;
      //  console.log("Uploaded file:", req.file);  
    
        // Handle file upload to Cloudinary  
        let uploadResult;  
        if (req.file) {  
            uploadResult = await cloudinaryInstance.uploader.upload(req.file.path);  
        //    console.log("Upload result:", uploadResult);  
            
        } else {  
            return res.status(400).json({ message: "File is required" });  
        }  

 
        // Create a new category  
        const newCategory = new Category({  
            name,  
            description,  
           
            
           image: uploadResult.url,  
           //image,
            admin:adminId
            // Correct usage of seller ID  
        });  
        const savedCategory = await newCategory.save();  
        return res.status(201).json({ data: savedCategory, message: "Category created successfully" });  
    } catch (error) {  
        console.error("Error creating category:", error);  
        return res.status(500).json({ message: "Internal server error" });  
    }  
};
