import { cloudinaryInstance } from "../config/cloudinaryConfig.js";  
import mongoose from 'mongoose';
import { Product } from "../models/productModel.js";  
//import { Category } from "../models/categoryModel.js";  
//import { SubCategory } from "../models/SubCategoryModel.js";  



// Create a new product  
export const createProduct = async (req, res, next) => {  
    try {  
        
        // Ensure user is authenticated and get seller ID  
        if (!req.seller || !req.seller.id) {  
             
            return res.status(401).json({ message: 'User not authenticated' });  
        }  
    // Destructure fields from the request body  

        const { name, description, categoryid ,subcategoryid, age_group,size, color, price, stock, weight, rating,seller} = req.body;  
       

        

 
//req.file=image;

  // const { id } = req.user;
        // Check if the required fields are present  
        if (!name || !description ||!categoryid|| !subcategoryid || !age_group || !size|| !color || !price || !stock ||!weight || !rating) {  
            return res.status(400).json({ message: "All fields are required" });  
        }  
       const sellerId=req.seller.id;
    
    
        // Handle file upload to Cloudinary  
        let uploadResult;  
        if (req.file) {  
            uploadResult = await cloudinaryInstance.uploader.upload(req.file.path);  
            console.log("Upload result:", uploadResult);  
            
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
           //image,
            seller:sellerId
            // Correct usage of seller ID  
        });  
        const savedProduct = await newProduct.save();  
        return res.status(201).json({ data: savedProduct, message: "Product created successfully" });  
    } catch (error) {  
        console.error("Error creating product:", error);  
        return res.status(500).json({ message: "Internal server error" });  
    }  
};

// Get all products  
export const getAllProducts = async (req, res) => {  
    try {  
        const products = await Product.find();  
        return res.json({ data: products, message: "Products fetched successfully" });  
    } catch (error) {  
        console.error("Error fetching products:", error);  
        return res.status(500).json({ message: "Internal server error" });  
    }  
};  

// Get a single product by ID  
export const getProductDetails = async (req, res) => {  
    try {
        const { productId } = req.params; // Destructure productId from request parameters
    
        const productDetails = await Product.findById(productId)
       .populate("seller") // Fetch product and populate seller
       // .populate("category")
       // .populate("subcategory")
        

        const categories = await Category.find();
        const subcategories = await SubCategory.find();

        if (!productDetails) {
            return res.status(404).json({ message: "Product not found" }); // Handle case where product doesn't exist
        }
    
        res.status(200).json({ message: "Product details fetched", data: productDetails ,categories,subcategories});
    } catch (error) {
        console.error("Error fetching product details:", error); // Use console.error for error logging
        res.status(error.status || 500).json({ error: error.message || "Internal server error" });
    }
};    





// Update a product  
export const updateProduct = async (req, res) => {  
    
        try {  
            const productId = req.params.productId;  
            
            const updatedData = req.body;  
    
            // Validate the product ID format
            if (!mongoose.Types.ObjectId.isValid(productId)) {
                return res.status(400).json({ message: "Invalid product ID" });
            }
    
            // Validate updatedData if necessary
            if (!updatedData.name) {
                return res.status(400).json({ message: "Product name is required" });
            }
    
            // Handle image upload if a new one is provided
            if (req.file) {  
                try {
                    const uploadResult = await cloudinaryInstance.uploader.upload(req.file.path);  
                    updatedData.image = uploadResult.url;  
                } catch (uploadError) {
                    console.error("Error uploading image:", uploadError);
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
            console.error("Error updating product:", error);  
            return res.status(500).json({ message: "Internal server error" });  
        }  
    };
    

// Delete a product  
export const deleteProduct = async (req, res) => {  
    try {  
        const productId = req.params.productId; // Ensure the URL has the :id parameter  
        const deletedProduct = await Product.findByIdAndDelete(productId);  

        if (!deletedProduct) {  
            return res.status(404).json({ message: "Product not found" });  
        }  

        return res.json({ message: "Product deleted successfully" });  
    } catch (error) {  
        console.error("Error deleting product:", error);  
        return res.status(500).json({ message: "Internal server error" });  
    }  
};

// Get products by subcategory ID
export const getProductBySubCategory = async (req, res) => {
    try {
        // Ensure subcategoryid is provided in the request parameters
        const { subcategoryid } = req.params;

        if (!subcategoryid) {
            return res.status(400).json({ message: "Subcategory ID is required" });
        }

        // Validate the subcategory ID format
        if (!mongoose.Types.ObjectId.isValid(subcategoryid)) {
            return res.status(400).json({ message: "Invalid subcategory ID format" });
        }

        // Find products by subcategory ID
        const products = await Product.find({ subcategoryid })
       //  .populate("subcategory"); // Populate subcategory details

        if (!products.length) {
            return res.status(404).json({ message: "No products found for this subcategory" });
        }

        return res.status(200).json({ message: "Products fetched successfully", data: products });
    } catch (error) {
        console.error("Error fetching products by subcategory:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


// Get products by category ID
export const getProductByCategory = async (req, res) => {
    try {
        // Ensure categoryid is provided in the request parameters
        const { categoryid } = req.params;

        if (!categoryid) {
            return res.status(400).json({ message: "category ID is required" });
        }

        // Validate the category ID format
        if (!mongoose.Types.ObjectId.isValid(categoryid)) {
            return res.status(400).json({ message: "Invalid category ID format" });
        }

        // Find products by category ID
        const products = await Product.find({ categoryid })
       //  .populate("category"); // Populate category details

        if (!products.length) {
            return res.status(404).json({ message: "No products found for this category" });
        }

        return res.status(200).json({ message: "Products fetched successfully", data: products });
    } catch (error) {
        console.error("Error fetching products by category:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};