import { cloudinaryInstance } from "../config/cloudinaryConfig.js";  
import mongoose from 'mongoose';
import {SubCategory  } from "../models/subcategoryModel.js";  
import {Product} from '../models/productModel.js'
import {Seller} from '../models/sellerModel.js'
import {Category} from '../models/categoryModel.js'
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
        const newsubCategory = new SubCategory({  
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
        const subcategory = await SubCategory.find();  
        return res.json({ data: subcategory, message: "SubCategory fetched successfully" });  
    } catch (error) {  
        console.error("Error fetching categories:", error);  
        return res.status(500).json({ message: "Internal server error" });  
    }  
};  

export const getsubCategoryDetails = async (req, res) => {  
    try {
        const { subcategoryId } = req.params; // Destructure subcategory name from request parameters
        console.log(subcategoryId);

        // Use the correct query to find the subcategory by name
        const subcategoryDetails = await SubCategory.findById(subcategoryId) 
        //.populate('category') // Populate category
      ///  .populate('seller');  // Populate seller
      
       /// const products = await Product.find({ subcategoryId });
       const categories = await Category.find();
        if (!subcategoryDetails) {
            return res.status(404).json({ message: "SubCategory not found" }); // Handle case where subcategory doesn't exist
        }

        res.status(200).json({ message: "SubCategory details fetched", data: subcategoryDetails,categories});
    } catch (error) {
        console.error("Error fetching subcategory details:", error); // Use console.error for error logging
        res.status(error.status || 500).json({ error: error.message || "Internal server error" });
    }
};
