import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            min:3,
            maxLength: 50,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            minLength: 3,
            maxLength: 30,
        },
        password: {
            type: String,
            required: true,
            minLength: 3,
        },
      
          
       phone: {
           type: String,
        //  required: true,
       },
       dob:{
        type:Date,
//  required: true,
       },
       shippingaddress:{
        type:String,
        //  required: true,
       },
       noofproducts:{
        type:String,
       },
       image :  {
                type: String,
               
                default: "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg",
               
                },
      role: {
                    type: String,
                    enum: ["seller", "admin"],
                    default: "user"
                },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

export const User = mongoose.model("User", userSchema);
 