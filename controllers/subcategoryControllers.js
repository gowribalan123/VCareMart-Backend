import { cloudinaryInstance } from "../config/cloudinaryConfig.js";  
import mongoose from 'mongoose';
import {subCategory  } from "../models/subCategoryModel.js";  

// Create a new category  
export const createsubCategory = async (req, res, next) => {  
    try {  
        
        // Ensure user is authenticated and get seller ID  
        if (!req.seller || !req.seller.id) {  
           // console.log(req.seller);
            return res.status(401).json({ message: 'User not authenticated' });  
        }  
    // Destructure fields from the request body  

        const { category_id ,name, description,seller} = req.body;  
       //// console.log("image====",req.file)

        

 
//req.file=image;

  // const { id } = req.user;
        // Check if the required fields are present  
        if (!category_id || !name || !description ) {  
            return res.status(400).json({ message: "All fields are required" });  
        }  
       const sellerId=req.seller.id;
     //   console.log("Uploaded file:", req.file);  
    
        // Handle file upload to Cloudinary  
        let uploadResult;  
        if (req.file) {  
            uploadResult = await cloudinaryInstance.uploader.upload(req.file.path);  
       //     console.log("Upload result:", uploadResult);  
            
        } else {  
            return res.status(400).json({ message: "File is required" });  
        }  

        //console.log(sellerId)
        // Create a new category  
        const newsubCategory = new subCategory({  
            name,  
            description,
            category_id,  
           
            
           image: uploadResult.url,  
           //image,
            seller:sellerId
            // Correct usage of seller ID  
        });  
        const savedsubCategory = await newsubCategory.save();  
        return res.status(201).json({ data: savedsubCategory, message: "subCategory created successfully" });  
    } catch (error) {  
        console.error("Error creating subcategory:", error);  
        return res.status(500).json({ message: "Internal server error" });  
    }  
};

// Get all products  
export const getAllsubCategory = async (req, res) => {  
    try {  
        const subcategory = await subCategory.find();  
        return res.json({ data: subcategory, message: "SubCategory fetched successfully" });  
    } catch (error) {  
        console.error("Error fetching categories:", error);  
        return res.status(500).json({ message: "Internal server error" });  
    }  
};  
