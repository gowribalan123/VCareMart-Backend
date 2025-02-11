
import mongoose from 'mongoose';
import {Agegroup} from "../models/agegroupModel.js";  

// Create a new agegroup  
export const createAgegroup = async (req, res, next) => {  
    try {  
        
        // Ensure user is authenticated and get seller ID  
        if (!req.seller || !req.seller.id) {  
            console.log(req.seller);
            return res.status(401).json({ message: 'User not authenticated' });  
        }  
    // Destructure fields from the request body  

        const { age_group,seller} = req.body;  
      //  console.log("image====",req.file)

        

 
//req.file=image;

  // const { id } = req.user;
        // Check if the required fields are present  
        if (!age_group ) {  
            return res.status(400).json({ message: "All fields are required" });  
        }  
       const sellerId=req.seller.id;
       

       // console.log(sellerId)
        // Create a new agegroup 
        const newAgegroup = new Agegroup({  
           age_group,
            
           
            seller:sellerId
            // Correct usage of seller ID  
        });  
        const savedAgegroup = await newAgegroup.save();  
        return res.status(201).json({ data: savedAgegroup, message: "Agegroup created successfully" });  
    } catch (error) {  
        console.error("Error creating agegroup:", error);  
        return res.status(500).json({ message: "Internal server error" });  
    }  
};

// Get all Agegroup
export const getAllAgegroup = async (req, res) => {  
    try {  
        const agegroup = await Agegroup.find();  
        return res.json({ data: agegroup, message: "Agegroup fetched successfully" });  
    } catch (error) {  
        console.error("Error fetching agegroup:", error);  
        return res.status(500).json({ message: "Internal server error" });  
    }  
};  


//get a single agegroup by name
export const getAgegroupDetails = async (req, res) => {  
    try {
        const { age_group } = req.params; // Destructure agegroup name from request parameters
    //    console.log(age_group);

        // Use the correct query to find the agegroup by name
        const agegroupDetails = await Agegroup.findOne({age_group }).populate("seller"); // Fetch specific fields and populate seller

        if (!age_group) {
            return res.status(404).json({ message: "Agegroup not found" }); // Handle case where agegroup doesn't exist
        }

        res.status(200).json({ message: "Agegroup details fetched", data: agegroupDetails });
    } catch (error) {
        console.error("Error fetching agegroup details:", error); // Use console.error for error logging
        res.status(error.status || 500).json({ error: error.message || "Internal server error" });
    }
};
