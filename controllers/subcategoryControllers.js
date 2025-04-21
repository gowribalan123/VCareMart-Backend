import { cloudinaryInstance } from "../config/cloudinaryConfig.js";  
import mongoose from 'mongoose';
import { SubCategory } from "../models/subcategoryModel.js";  
import { User } from '../models/userModel.js';  
import { Category } from '../models/categoryModel.js';

// Create a new Subcategory  
export const createSubCategory = async (req, res, next) => {  
    try { 
        const {  name, description, categoryId,userId } = req.body;  

        // Validate categoryId
        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({ message: "Invalid category ID" });
        }

        const userData = await User.findById(userId);
        
        if (!userId || !userData) {  
            return res.status(401).json({ message: 'User not authenticated or not found' });  
        }  

        if (!categoryId || !name || !description) {  
            return res.status(400).json({ message: "All fields are required" });  
        }  

        let uploadResult;  
        if (req.file) {  
            uploadResult = await cloudinaryInstance.uploader.upload(req.file.path);  
        } else {  
            return res.status(400).json({ message: "File is required" });  
        }  

        // Use the categoryId directly from the request
        const newSubCategory = new SubCategory({  
            name,  
            description,
            categoryId: categoryId, // Use the provided categoryId
            image: uploadResult.url,  
            seller: userData._id
        });  

        const savedSubCategory = await newSubCategory.save();  
        return res.status(201).json({ data: savedSubCategory, message: "Subcategory created successfully" });  
    } catch (error) {  
        console.error("Error creating subcategory:", error);  
        return res.status(500).json({ message: "Internal server error" });  
    }  
};

// Get all products  
export const getAllSubCategory = async (req, res) => {  
    try {  
        const subcategory = await SubCategory.find();  
        return res.json({ data: subcategory, message: "SubCategory fetched successfully" });  
    } catch (error) {  
        console.error("Error fetching categories:", error);  
        return res.status(500).json({ message: "Internal server error" });  
    }  
}; 
 export const getSubCategoryDetails = async (req, res) => {  
    try {
        const { subcategoryId } = req.params; // Extract subcategoryId from request parameters
        
        // Fetch subcategory details and populate related fields
        const subcategoryDetails = await SubCategory.findById(subcategoryId)
           // .populate('categoryId')
          //  .populate('seller');  
        
        // Check if subcategory was found
        if (!subcategoryDetails) {
            return res.status(404).json({ message: "SubCategory not found" });
        }

        // Respond with the subcategory details
        res.status(200).json({ message: "SubCategory details fetched", data: subcategoryDetails });
    } catch (error) {
        console.error("Error fetching subcategory details:", error);
        res.status(error.status || 500).json({ error: error.message || "Internal server error" });
    }
};
export const getSubCategoryByCategory = async (req, res) => {  
    try {
        const { categoryId } = req.body; // Extract categoryId from request body

        // Check if categoryId is provided
        if (!categoryId) {
            return res.status(400).json({ message: "categoryId is required" });
        }

        // Fetch subcategories for the given categoryId
        const subcategoryDetails = await SubCategory.find({ categoryId })
           // .populate('categoryId') // Populate category details if needed
           // .populate('seller'); // Populate seller details if needed

        // Check if subcategories were found
        if (!subcategoryDetails || subcategoryDetails.length === 0) {
            return res.status(404).json({ message: "No subcategories found for this category" });
        }

        // Respond with the subcategory details
        res.status(200).json({ message: "Subcategories fetched successfully", data: subcategoryDetails });
    } catch (error) {
        console.error("Error fetching subcategory details:", error);
        res.status(error.status || 500).json({ error: error.message || "Internal server error" });
    }
};