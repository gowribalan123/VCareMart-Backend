import { cloudinaryInstance } from "../config/cloudinaryConfig.js";  
import mongoose from 'mongoose';
import {Category  } from "../models/categoryModel.js";  

// Create a new category  
export const createCategory = async (req, res, next) => {  
    try {  
        
        // Ensure user is authenticated and get seller ID  
        if (!req.seller || !req.seller.id) {  
            console.log(req.seller);
            return res.status(401).json({ message: 'User not authenticated' });  
        }  
    // Destructure fields from the request body  

        const { name, description,seller} = req.body;  
        console.log("image====",req.file)

        

 
//req.file=image;

  // const { id } = req.user;
        // Check if the required fields are present  
        if (!name || !description ) {  
            return res.status(400).json({ message: "All fields are required" });  
        }  
       const sellerId=req.seller.id;
      //  console.log("Uploaded file:", req.file);  
    
        // Handle file upload to Cloudinary  
        let uploadResult;  
        if (req.file) {  
            uploadResult = await cloudinaryInstance.uploader.upload(req.file.path);  
        //    console.log("Upload result:", uploadResult);  
            
        } else {  
            return res.status(400).json({ message: "File is required" });  
        }  

      //  console.log(sellerId)
        // Create a new category  
        const newCategory = new Category({  
            name,  
            description,  
           
            
           image: uploadResult.url,  
           //image,
            seller:sellerId
            // Correct usage of seller ID  
        });  
        const savedCategory = await newCategory.save();  
        return res.status(201).json({ data: savedCategory, message: "Category created successfully" });  
    } catch (error) {  
        console.error("Error creating category:", error);  
        return res.status(500).json({ message: "Internal server error" });  
    }  
};

// Get all Categories
export const getAllCategory = async (req, res) => {  
    try {  
        const category = await Category.find();  
        return res.json({ data: category, message: "Category fetched successfully" });  
    } catch (error) {  
        console.error("Error fetching categories:", error);  
        return res.status(500).json({ message: "Internal server error" });  
    }  
};  


//get a single category by name
export const getCategoryDetails = async (req, res) => {  
    try {
        const { name } = req.params; // Destructure category name from request parameters
        console.log(name);

        // Use the correct query to find the category by name
        const categoryDetails = await Category.findOne({ name }, 'name image description').populate("seller"); // Fetch specific fields and populate seller

        if (!categoryDetails) {
            return res.status(404).json({ message: "Category not found" }); // Handle case where category doesn't exist
        }

        res.status(200).json({ message: "Category details fetched", data: categoryDetails });
    } catch (error) {
        console.error("Error fetching category details:", error); // Use console.error for error logging
        res.status(error.status || 500).json({ error: error.message || "Internal server error" });
    }
};
