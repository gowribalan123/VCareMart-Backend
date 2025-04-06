import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

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
        match: /.+\@.+\..+/ // Email format validation
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    phone: {
        type: String,
        // Optional: add regex validation for phone format
    },
    image: {
        type: String,
        default: "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg",
    },
    dob: {
        type: Date,
    },
    role: {
        type: String,
        required: true,
        enum: ["admin", "seller"],
        default: "seller",
    },
    shippingaddress: {
        type: String,
    },
    noofproducts: {
        type: Number,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

sellerSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

export const Seller = mongoose.model("Seller", sellerSchema);