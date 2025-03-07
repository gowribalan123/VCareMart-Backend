import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/token.js";
import { Product } from "../models/productModel.js";  
import { cloudinaryInstance } from "../config/cloudinaryConfig.js";  

const NODE_ENV = process.env.NODE_ENV;

 

export const userSignup = async (req, res, next) => {
    try {
        const { 
            name, 
            email, 
            password,
            image,
         //   phone, 
         //   dob,
         //shippingaddress
        } = req.body;

        // Validate required fields
        if (!name || !email || !password ) {
            return res.status(400).json({ message: "All fields are required" });
        }

        ///Handle file upload to Cloudinary  
      // let uploadResult;  
      // if (req.file) {  
       //    uploadResult = await cloudinaryInstance.uploader.upload(req.file.path);  
     // } else {  
      //     return res.status(400).json({ message: "File is required" });  
      //  }  

        // Check if user already exists
        const isUserExist = await User.findOne({ email });
        if (isUserExist) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Create a new user instance
        const userData = new User({ 
            name, 
            email, 
            password: hashedPassword, 
          //  phone, 
          //  dob, 
          //shippingaddress
        image
         //  image: uploadResult.url,  
        });

        // Save user data to the database
        await userData.save();

        // Generate a token for the user
        const token = generateToken(userData._id);

        // Set cookie with the token
        res.cookie("token", token, {
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
        });

        // Exclude password from the response
        const userResponse = userData.toObject();
        delete userResponse.password;

        return res.status(201).json({ data: userResponse, message: "User account created" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};


export const userLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "all fields are required" });
        }

        const userExist = await User.findOne({ email });

        if (!userExist) {
            return res.status(404).json({ message: "user does not exist" });
        }

        const passwordMatch = bcrypt.compareSync(password, userExist.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: "user not authenticated" });
        }

        const token = generateToken(userExist._id,'user');
        //res.cookie("token", token);

        res.cookie("token", token, {
            sameSite: NODE_ENV === "production" ? "None" : "Lax",
            secure: NODE_ENV === "production",
            httpOnly: NODE_ENV === "production",
        });  
         // delete userExist._doc.password;
         {
            const { password, ...userDataWithoutPassword } = userExist._doc;
            return res.json({ data: userDataWithoutPassword, message: "user login success" });
        }
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};

export const userProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const userData = await User.findById(userId).select("-password");
        return res.json({ data: userData, message: "user profile fetched" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};
export const userforgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        const userData = await User.findOne({ email });

        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate a reset token and send it via email (implementation not shown)
        const resetToken = generateToken(User._id);
        // Send resetToken via email to the user (implementation not shown)

        return res.json({ message: "Password reset link sent to your email" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};

export const userchangePassword = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }


        const userData = await User.findById(userId);

        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        const passwordMatch = bcrypt.compareSync(oldPassword, userData.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Old password is incorrect" });
        }

        userData.password = bcrypt.hashSync(newPassword, 10);
        await userData.save();

        return res.json({ message: "Password changed successfully" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};

export const userAccountDeActivate = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const userData = await User.findById(userId).select("-password");
        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        userData.isActive=false
        await userData.save();
        return res.json({ data: userData, message: "User account deactivated successfully" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};


export const userAccountActivate = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const userData = await User.findById(userId).select("-password");

        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        userData.isActive = true;
        await userData.save();

        return res.json({ message: "User account activated successfully" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};



export const checkUser = async (req, res, next) => {
    try {
        //const { email } = req.body;

        //const userData = await User.findOne({ email });

      //  if (!userData) {
          //  return res.status(404).json({ message: "User not found" });
      //  }

       // return res.json({ message: "User exists" });
       return res.json({ message: "user autherized" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};
export const updateUserProfile = async (req, res, next) => {  
    try {  
        const userId = req.user.id; // Get user ID from the authenticated request  

        // Destructure the body, omitting profilepic for now  
        const { name,phone ,email,dob,shippingaddress,image} = req.body;  

        // Step 1: Find the user  
        const userData = await User.findById(userId);  

        if (!userData) {  
            return res.status(404).json({ message: "User not found" });  
        }  

        // Step 2: Prepare an update object  
        const updatedData = {  
            name: name || userData.name,  
           email: email || userData.email,  
            phone: phone || userData.phone,  
            dob: dob || userData.dob,  
            shippingaddress: shippingaddress || userData.shippingaddress,  
           // billingaddress: billingaddress || userData.billingaddress  
           
        };  

        // Step 3: Handle image upload if a new one is provided  
        if (req.file) {  
            try {  
                const uploadResult = await cloudinaryInstance.uploader.upload(req.file.path);  
                updatedData.image = uploadResult.url; // Set the profile pic URL in updatedData  
            } catch (uploadError) {  
                console.error("Error uploading image:", uploadError);  
                return res.status(500).json({ message: "Image upload failed" });  
            }  
        }  

        // Step 4: Update the user  
        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true });  

        // Step 5: Prepare the response, excluding the password  
        const userResponse = updatedUser.toObject();  
        delete userResponse.password; // Ensure password is not sent back in the response  

        return res.json({ data: userResponse, message: "User profile updated successfully" });  
    } catch (error) {  
        console.error(error); // Log the error for debugging  
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });  
    }  
};
 

export const addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;

        // Validate input
        if (!productId || !quantity) {
            return res.status(400).json({ message: "Product ID and quantity are required" });
        }

        const userData = await User.findById(userId);
        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the product is already in the cart
        const existingItemIndex = userData.cart.findIndex(item => item.productId.toString() === productId);
        if (existingItemIndex > -1) {
            // Update the quantity if the product is already in the cart
            userData.cart[existingItemIndex].quantity += quantity;
        } else {
            // Add new item to the cart
            userData.cart.push({ productId, quantity });
        }

        await userData.save();
        return res.json({ message: "Product added to cart", cart: userData.cart });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal server error" });
    }
};
 

export const checkOut = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find the user and populate their cart
        const userData = await User.findById(userId).populate('cart.productId'); // Assuming cart items reference Product model

        if (!userData || !userData.cart.length) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        // Here you would typically integrate with a payment gateway
        // For example, using Stripe:
        // const paymentIntent = await stripe.paymentIntents.create({
        //     amount: calculateTotal(userData.cart), // Implement calculateTotal to sum cart items
        //     currency: 'usd', // Change as needed
        // });

        // Simulating payment processing
        const paymentSuccess = true; // Replace with actual payment success check

        if (!paymentSuccess) {
            return res.status(500).json({ message: "Payment processing failed" });
        }

        // Create an order record (you may have an Order model)
        const order = {
            userId: userId,
            items: userData.cart,
            totalAmount: calculateTotal(userData.cart), // Implement this function
            createdAt: new Date(),
        };

        // Save the order to the user's orders array or a separate Orders collection
        userData.orders.push(order);
        userData.cart = []; // Clear the cart after checkout
        await userData.save();

        return res.json({ message: "Checkout successful", order });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal server error" });
    }
};

// Helper function to calculate total amount
const calculateTotal = (cart) => {
    return cart.reduce((total, item) => {
        return total + item.productId.price * item.quantity; // Assuming productId has a price field
    }, 0);
};




export const viewCart = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find the user and populate their cart with product details
        const userData = await User.findById(userId).populate('cart.productId'); // Assuming cart items reference Product model

        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        // Return the cart items
        return res.json({ cart: userData.cart, message: "Cart retrieved successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal server error" });
    }
};

export const viewProducts = async (req, res) => {
    try {
        // Fetch all products from the database
        const products = await Product.find();

        if (!products.length) {
            return res.status(404).json({ message: "No products available" });
        }

        // Return the list of products
        return res.json({ products, message: "Products retrieved successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal server error" });
    }
};


export const orderHistory = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find the user and populate their orders with product details
        const userData = await User.findById(userId).populate('orders.items.productId'); // Assuming orders reference Product model

        if (!userData || !userData.orders.length) {
            return res.status(404).json({ message: "No order history found" });
        }

        // Return the user's order history
        return res.json({ orders: userData.orders, message: "Order history retrieved successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal server error" });
    }
};
export const userLogout = async (req, res, next) => {
    try { 
      //  res.clearCookie("token");
      res.clearCookie("token", {
        sameSite: NODE_ENV === "production" ? "None" : "Lax",
        secure: NODE_ENV === "production",
        httpOnly: NODE_ENV === "production",
    }); 

        return res.json({ message: "user logout success" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};



export const deleteUser = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const userData = await User.findById(userId).select("-password");

        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

      await userData.remove();

        return res.json({ message: "User account deleted successfully" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};
