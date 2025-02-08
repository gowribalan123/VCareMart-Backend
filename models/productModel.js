import mongoose, { Schema } from "mongoose";  

const productSchema = new Schema({  
    subcategoryid: {  
        type: mongoose.Types.ObjectId,  
        ref: "subcategory",  
        required: true, // Ensure seller is required  
    }  ,
    name: {  
        type: String,  
        required: true,  
        minLength: 3,  
        maxLength: 100,  
        unique: true,  
    },  
    description: {  
        type: String,  
        required: true,  
        minLength: 20,  
        maxLength: 300,  
    },  
    price: {  
        type: Number,  
        required: true,  
        min: 0, // Ensure price is non-negative  
    },  
    agegroupid: {  
        type: mongoose.Types.ObjectId,  
        ref: "agegroup",  
        required: true, // Ensure agegroup is required  
    }  ,
    color: {  
        type: String,  
        required: true,  
    },  
    stock: {  
        type: Number,  
        required: true,  
        min: 0, // Ensure stock is non-negative  
    },  
    weight: {  
        type: String,  
        required: true,  
        min: 0, // Ensure weight is non-negative  
    },  
    rating: {  
        type: Number,  
        required: true,  
        default:0,
        min: 0, // Ensure rating is non-negative  
        max: 5,  // Assuming a 5-star rating system  
    },  
    image: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaLGtEd0MJro4X9wDmT2vrvLT-HjKkyyWVmg&s",
    }
, 
seller: { type: mongoose.Types.ObjectId, ref: "Seller" },
}, 
{ timestamps: true }
);  

export const Product = mongoose.model("Product", productSchema);