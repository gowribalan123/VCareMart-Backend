import mongoose , {Schema} from "mongoose";

const sellerSchema = new Schema({
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
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    phone: {
        type: String,
        required: true,
    },
    profiePic: {
        type: String,
        default: "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg",
    },
    dob:{
      type:Date,
      required:true,  
    },
    role:{
        type:String,
        //required:true,  
        enum: ["admin", "seller"],
        default: "seller",
      },
      shippingaddress:{
        type:String,
        required:true,  
      },
      billingaddress:{
        type:String,
        required:true,  
      },
    isActive: {
        type: Boolean,
        default: true,
    },
});

export const Seller = mongoose.model("Seller", sellerSchema);