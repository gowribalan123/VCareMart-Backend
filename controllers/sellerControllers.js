import { User } from "../models/userModel.js";
import {Seller}from "../models/sellerModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/token.js";
import { Product } from "../models/productModel.js";  
import mongoose from "mongoose";
import { cloudinaryInstance } from "../config/cloudinaryConfig.js";  

//const NODE_ENV = process.env.NODE_ENV;








// Seller Signup
export const sellerSignup = async (req, res) => {
    try {
        const { name, email, password,  dob, noofproducts, shippingaddress, phone, created_at } = req.body;

        // Validate input fields
        if (!name || !email || !password ) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const isSellerExist = await Seller.findOne({ email });
        if (isSellerExist) {
            return res.status(400).json({ message: "Seller already exists" });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        const sellerData = new Seller({ name, email, password: hashedPassword,   created_at });
        await sellerData.save();
 
       // const token = generateToken(sellerData._id);

     //   res.cookie("token", token, {
         //   sameSite: NODE_ENV === "production" ? "None" : "Lax",
          //  secure: NODE_ENV === "production",
           // httpOnly: true,
       // });

    // Exclude password from the response
    const sellerResponse = sellerData.toObject();
    delete sellerResponse.password;

    const token = generateToken(sellerData._id)

    return res.status(200).json({ message: "Seller Registration succesfull", sellerResponse, token })
} catch (error) {
    console.log(error);
    res.status(error.status || 500).json({ error: error.message || "Internal server error" })
}
}

// Seller Login
export const sellerLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
 
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const sellerExist = await Seller.findOne({ email });
        if (!sellerExist) {
            return res.status(404).json({ message: "Seller does not exist" });
        }
        
        
       // console.log(sellerExist,password);
            // const passwordMatch = bcrypt.compareSync(password, sellerExist.password);
const passwordMatch=bcrypt.compareSync(password,sellerExist.password);
        console.log(password,sellerExist.password,passwordMatch);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Seller not authenticated" });
        }
 
       

       // res.cookie("token", token, {
          //  sameSite: NODE_ENV === "production" ? "None" : "Lax",
          //  secure: NODE_ENV === "production",
          //  httpOnly: true,
       // });

       const sellerObject = sellerExist.toObject()
       delete sellerObject.password
        //{
         //  const { password, ...userDataWithoutPassword } = userExist._doc;
         //  return res.json({ data: userDataWithoutPassword, message: "user login success" });

         const token = generateToken(sellerExist._id)

         return res.status(200).json({ message: "Login succesfull", sellerObject, token })
      // }
   } catch (error) {
       return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
   }
};


// Seller Profile
export const sellerProfile = async (req, res,next) => {
           try {
              
            const { email } = req.body;
         // console.log(seller);
                  const sellerData = await Seller.findOne({ email }).select("-password");
                  return res.json({ data: sellerData , message: "Seller profile fetched" });
              } catch (error) {
                  return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
              }
};

// Seller Forgot Password
export const sellerForgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const sellerData = await Seller.findOne({ email });

        if (!sellerData) {
            return res.status(404).json({ message: "Seller not found" });
        }

        // Generate a reset token and send it via email (implementation not shown)
        const resetToken = generateToken(sellerData._id); // Adjust as needed
        // Send resetToken via email to the seller (implementation not shown)

        return res.json({ message: "Password reset link sent to your email" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};

// Seller Change Password
export const sellerChangePassword = async (req, res) => {
    try {
        const sellerId = req.seller.id;
        const { oldPassword, newPassword } = req.body;

        const sellerData = await Seller.findById(sellerId);
        if (!sellerData) {
            return res.status(404).json({ message: "Seller not found" });
        }

        const passwordMatch = bcrypt.compareSync(oldPassword, sellerData.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Old password is incorrect" });
        }

        sellerData.password = bcrypt.hashSync(newPassword, 10);
        await sellerData.save();

        return res.json({ message: "Password changed successfully" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};

// Seller Account Deactivation
export const sellerAccountDeActivate = async (req, res) => {
    try {
        const sellerId = req.seller.id;
        const sellerData = await Seller.findById(sellerId).select("-password");

        if (!sellerData) {
            return res.status(404).json({ message: "Seller not found" });
        }

        sellerData.isActive = false;
        await sellerData.save();
        return res.json({ data: sellerData, message: "Seller account deactivated successfully" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};

// Seller Account Activation
export const sellerAccountActivate = async (req, res) => {
    try {
        const sellerId = req.seller.id;
        const sellerData = await Seller.findById(sellerId).select("-password");

        if (!sellerData) {
            return res.status(404).json({ message: "Seller not found" });
        }

        sellerData.isActive = true;
        await sellerData.save();
        return res.json({ message: "Seller account activated successfully" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};

// Check Seller Authorization
export const checkSeller = async (req, res) => {
    try {
        res.json({ success: true, message: "Seller authorized" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};

// Update Seller Profile
export const updateSellerProfile = async (req, res) => {
    try {
        const sellerId = req.seller.id;
        const { name, email, phone, dob, shippingaddress, profilepic, noofproducts } = req.body;

        const sellerData = await Seller.findById(sellerId);
        if (!sellerData) {
            return res.status(404).json({ message: "Seller not found" });
        }

        sellerData.name = name || sellerData.name;
        sellerData.email = email || sellerData.email;
        sellerData.phone = phone || sellerData.phone;
        sellerData.dob = dob || sellerData.dob;
        sellerData.shippingaddress = shippingaddress || sellerData.shippingaddress;
        sellerData.image = profilepic || sellerData.image;
        sellerData.noofproducts = noofproducts || sellerData.noofproducts;

        const updatedSeller = await sellerData.save();
        const sellerResponse = updatedSeller.toObject();
        delete sellerResponse.password;

        return res.json({ data: sellerResponse, message: "Seller profile updated successfully" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};

// Seller Logout
export const sellerLogout = async (req, res) => {
    try {
        res.clearCookie("token", {
            sameSite: NODE_ENV === "production" ? "None" : "Lax",
            secure: NODE_ENV === "production",
            httpOnly: true,
        });

        res.json({ success: true, message: "Seller logged out" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};

// Delete Seller Account
export const deleteSeller = async (req, res) => {
    try {
        const sellerId = req.seller.id;
        const sellerData = await Seller.findById(sellerId).select("-password");

        if (!sellerData) {
            return res.status(404).json({ message: "Seller not found" });
        }

        await sellerData.remove();
        return res.json({ message: "Seller account deleted successfully" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};

// Create a New Product
export const createProduct = async (req, res) => {  
    try {  
        if (!req.seller || !req.seller.id) {  
            return res.status(401).json({ message: 'Seller not authenticated' });  
        }  

        const { name, description, categoryid, subcategoryid, age_group, size, color, price, stock, weight, rating } = req.body;  

        // Check if all required fields are present  
        if (!name || !description || !categoryid || !subcategoryid || !age_group || !size || !color || !price || !stock || !weight || !rating) {  
            return res.status(400).json({ message: "All fields are required" });  
        }  

        const sellerId = req.seller.id;
        let uploadResult;  

        // Handle file upload to Cloudinary  
        if (req.file) {  
            uploadResult = await cloudinaryInstance.uploader.upload(req.file.path);  
        } else {  
            return res.status(400).json({ message: "File is required" });  
        }  

        // Create a new product  
        const newProduct = new Product({  
            name,  
            description,  
            categoryid,
            subcategoryid,
            age_group,
            size,  
            color,  
            price,  
            stock,  
            weight,  
            rating,  
            image: uploadResult.url,  
            seller: sellerId  
        });  

        const savedProduct = await newProduct.save();  
        return res.status(201).json({ data: savedProduct, message: "Product created successfully" });  
    } catch (error) {  
        return res.status(500).json({ message: "Internal server error" });  
    }  
};

// Delete a Product  
export const deleteProduct = async (req, res) => {  
    try {  
        const productId = req.params.productId;  
        const deletedProduct = await Product.findByIdAndDelete(productId);  

        if (!deletedProduct) {  
            return res.status(404).json({ message: "Product not found" });  
        }  

        return res.json({ message: "Product deleted successfully" });  
    } catch (error) {  
        return res.status(500).json({ message: "Internal server error" });  
    }  
};

// Update a Product  
export const updateProduct = async (req, res) => {  
    try {  
        const productId = req.params.productId;  
        const updatedData = req.body;  

        // Validate the product ID format
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        // Handle image upload if a new one is provided
        if (req.file) {  
            try {
                const uploadResult = await cloudinaryInstance.uploader.upload(req.file.path);  
                updatedData.image = uploadResult.url;  
            } catch (uploadError) {
                return res.status(500).json({ message: "Image upload failed" });
            }
        }  

        // Find and update the product
        const updatedProduct = await Product.findByIdAndUpdate(productId, updatedData, { new: true });  

        if (!updatedProduct) {  
            return res.status(404).json({ message: "Product not found" });  
        }  

        return res.json({ data: updatedProduct, message: "Product updated successfully" });  
    } catch (error) {  
        return res.status(500).json({ message: "Internal server error" });  
    }  
};
