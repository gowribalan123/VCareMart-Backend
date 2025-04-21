import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const adminSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxLength: 50,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minLength: 3,
        maxLength: 30,
        match: /.+\@.+\..+/ // Email format validation
    },
    password: {
        type: String,
        required: true,
        minLength: 3,
    },
   
    role: {
        type: String,
        required: true,
        default:"admin"
        
    },
  
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

 

export const Admin = mongoose.model("Admin", adminSchema);