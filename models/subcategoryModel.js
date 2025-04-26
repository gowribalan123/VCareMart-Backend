import mongoose from "mongoose";  

const { Schema } = mongoose;

const subcategorySchema = new Schema({  
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
        minLength: 10,  
        maxLength: 300,  
    },  
    categoryId: {
        type: mongoose.Types.ObjectId,
        ref: "Category",
        required: true,
        index: true, // Index for faster queries
    },
    image: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaLGtEd0MJro4X9wDmT2vrvLT-HjKkyyWVmg&s",
    },
    seller: { 
        type: mongoose.Types.ObjectId, 
        ref: "User",
    },
}, { timestamps: true });  

export const SubCategory = mongoose.model("SubCategory", subcategorySchema);
