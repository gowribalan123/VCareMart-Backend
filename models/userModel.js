import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, maxLength: 50 },
    email: { type: String, required: true, unique: true, minLength: 3, maxLength: 30 }, // Changed type to String
    password: { type: String, required: true, minLength: 6 }, // Changed type to String
  //  phone: { type: Number}, // If phone is necessary
   //dob: { type: Date }, // Date of birth field added
    //image: {
      //  type: String,
        //default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaLGtEd0MJro4X9wDmT2vrvLT-HjKkyyWVmg&s",
   // },
    // remember: { type: Boolean, default: false },
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
