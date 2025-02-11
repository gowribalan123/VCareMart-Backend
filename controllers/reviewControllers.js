import { Product } from "../models/productModel.js";
import { Review } from "../models/reviewModel.js";
import mongoose from 'mongoose';

export const addReview = async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;
        const userId = req.user.id;

        // Validate if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (rating > 5 || rating <= 1) {
            return res.status(400).json({ message: "Please provide a proper rating" });
        }

        // Create or update the review
        const review = await Review.findOneAndUpdate(
            { userId, productId },
             { rating, comment },
              { new: true, upsert: true }
            );

        // Optionally, you can update the product's average rating here

        res.status(201).json({ data: review, message: "review added successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};


export const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params; // Correctly destructure productId from req.params

        // Find reviews for the specified product
        const reviews = await Review.find({ productId }).populate("userId", "name").sort({ createdAt: -1 });

        // Check if any reviews were found
        if (!reviews.length) {
            return res.status(404).json({ message: "No reviews found for this product" });
        }

        // Respond with the found reviews
        res.status(200).json({ data: reviews, message: "Reviews fetched successfully" });
    } catch (error) {
        console.error("Error fetching reviews:", error); // Log the error for debugging
        res.status(500).json({ message: "Internal server error", error });
    }
};


export const deleteReview = async (req, res) => {
    try {
        const  {reviewId}  = req.params;
        const userId = req.user.id;

        const review = await Review.findOneAndDelete({ _id: reviewId, userId });

        if (!review) {
            return res.status(404).json({ message: "Review not found or not authorized" });
        }

        res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

export const getAverageRating = async (req, res) => {
    try {
        const { productId } = req.params;

        const reviews = await Review.find({ productId });

        if (!reviews.length) {
            return res.status(404).json({ message: "No reviews found for this product" });
        }
               const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

        res.status(200).json({ data : "....",averageRating, message: "avg reviews fetched" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};