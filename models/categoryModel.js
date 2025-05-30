import mongoose, { Schema } from "mongoose";  

const categorySchema = new Schema({  
   
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
        minLength: 5,  
        maxLength: 300,  
    },  
    
   
    image: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaLGtEd0MJro4X9wDmT2vrvLT-HjKkyyWVmg&s",
    }
, 


seller: { 
    type: mongoose.Types.ObjectId, 
    ref: "User" 
},
//seller: { type: mongoose.Types.ObjectId, ref: "Seller" },
}, 
{ timestamps: true }
);  

export const Category = mongoose.model("Category", categorySchema);