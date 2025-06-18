import { Product } from "../models/productModel.js";
import { ShippingAddress } from "../models/shippingaddressModel.js";
import mongoose from 'mongoose';
export const addaddress = async (req, res) => {
    try {
        const { shippingaddress } = req.body;

        // Check if shippingAddress is defined
        if (!shippingaddress) {
            return res.status(400).json({ message: "Shipping address is required" });
        }

        const { street, city, state, zipCode, country } = shippingaddress; // Now it's safe to destructure
        const userId = req.user.id;

        // Create a new shipping address object
        const newAddress = {
            userId,
            street,
            city,
            state,
            zipCode,
            country
        };

        // Use upsert to create or update the address based on userId
        const savedAddress = await ShippingAddress.findOneAndUpdate(
            { userId },
            newAddress,
            { new: true, upsert: true }
        );

        return res.status(201).json({ data: savedAddress, message: "Shipping address added/updated successfully" });
      //  clearFields: true // Indicate that fields should be cleared
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
 

export const getaddress = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming user ID is available in req.user

        // Find the shipping address by userId
        const address = await ShippingAddress.findOne({ userId });

        if (!address) {
            return res.status(404).json({ message: "Shipping address not found" });
        }

        return res.status(200).json({  message: "Shipping address retrieved successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
 

export const deleteaddress = async (req, res) => {
    try {
       // const { addressId } = req.params; // Get addressId from request parameters
        const userId = req.user.id; // Assuming user ID is available in req.user

        // Find and delete the shipping address
       // const deletedAddress = await ShippingAddress.findOneAndDelete({ _id: addressId, userId });
       const deletedAddress = await ShippingAddress.findOneAndDelete({ userId });
        if (!deletedAddress) {
            return res.status(404).json({ message: "Shipping address not found or you do not have permission to delete it" });
        }

        return res.status(200).json({ message: "Shipping address deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
