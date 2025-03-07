import mongoose, { Schema } from "mongoose";  

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
        minLength: 20,  
        maxLength: 300,  
    },  
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category", // Reference to the Category model
        required: true,
      },
   
    image: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaLGtEd0MJro4X9wDmT2vrvLT-HjKkyyWVmg&s",
    }
, 
//seller: { type: mongoose.Types.ObjectId, ref: "Seller" },
//category: { type: mongoose.Types.ObjectId, ref: "Category"},
}, 
{ timestamps: true }
);  

export const SubCategory = mongoose.model("SubCategory", subcategorySchema);
