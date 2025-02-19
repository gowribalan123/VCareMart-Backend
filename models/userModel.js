import mongoose , {Schema} from "mongoose";

const addressSchema = new mongoose.Schema({
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
});

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    confirmPassword: { type: String, required: true }, // Typically not stored, just for validation
    phone: { type: String, required: true }, // If phone is necessary
    dob: { type: Date }, // If date of birth is necessary
    shippingaddress: { type: addressSchema, required: true },
    billingaddress: { type: addressSchema, required: true },
    remember: { type: Boolean, default: false },
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);

 
