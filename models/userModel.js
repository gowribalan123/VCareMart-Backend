import mongoose , {Schema} from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema({
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
        type: Number,
        required: true,
    },
    profilepic: {
        type: String,
        default: "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg",
    },
    dob:{
      type:Date,
      required:true,  
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
    created_at:{
      type:Date,
      default: Date.now,

    }
});
// Pre-save hook to hash the password 
//userSchema.pre("save", async function (next)
 //{ 
 /// if (this.isModified("password") || this.isNew) 
 //   { const salt = await bcrypt.genSalt(10); 
   //   this.password = await bcrypt.hash
     // (this.password, salt);
   //  } next(); 
  //  });
export const User = mongoose.model("User", userSchema);