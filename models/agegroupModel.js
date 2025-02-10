import mongoose, { Schema } from "mongoose";  

const agegroupSchema = new Schema({  
   
    age_group: {  
        type: String,  
        required: true,  
        minLength: 1,  
        maxLength: 100,  
        unique: true,  
    },  
   

seller: { type: mongoose.Types.ObjectId, ref: "Seller" },
}, 
{ timestamps: true }
);  

export const Agegroup = mongoose.model("Agegroup", agegroupSchema);