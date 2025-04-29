import { cloudinaryInstance } from "../config/cloudinaryConfig.js";  
import mongoose from 'mongoose';
import {Category } from "../models/categoryModel.js";  
import { User } from "../models/userModel.js"; 
export const createCategory = async (req, res, next) => {
    try {
        const { name, description, userId } = req.body;
        
        // Check if user is authenticated
        if (!userId) {
            return res.status(401).json({ message: 'User is not authenticated' });
        }

        const userData = await User.findById(userId);
        if (!userData) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check for required fields
        if (!name || !description || !userId) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Handle file upload to Cloudinary
        if (!req.file) {
            return res.status(400).json({ message: "File is required" });
        }

        const uploadResult = await cloudinaryInstance.uploader.upload(req.file.path);

        // Create a new category
        const newCategory = new Category({
            name,
            description,
            image: uploadResult.url,
            seller: userId
        });

        const savedCategory = await newCategory.save();
        return res.status(201).json({ data: savedCategory, message: "Category created successfully" });
    } catch (error) {
        console.error("Error creating category:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
//delete category
export const deleteCategory = async (req, res) => {
    try {
        const { categoryId } = req.params

        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({ error: "Invalid category id" })
        }

        await Category.findByIdAndDelete(categoryId)
        return res.status(200).json("Category deleted successfully")
    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ error: error.message || "Internal server error" })
    }
}


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
        const { categoryId } = req.params; // Destructure category name from request parameters
        console.log(categoryId);

        // Use the correct query to find the category by name
        const categoryDetails = await Category.findById(categoryId).populate("seller"); // Fetch specific fields and populate seller

        if (!categoryDetails) {
            return res.status(404).json({ message: "Category not found" }); // Handle case where category doesn't exist
        }

        res.status(200).json({ message: "Category details fetched", data: categoryDetails });
    } catch (error) {
        console.error("Error fetching category details:", error); // Use console.error for error logging
        res.status(error.status || 500).json({ error: error.message || "Internal server error" });
    }
};
