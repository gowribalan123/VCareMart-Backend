import { Seller } from "../models/sellerModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/token.js";

import { Product } from "../models/productModel.js";  
const NODE_ENV = process.env.NODE_ENV;

export const sellerSignup = async (req, res, next) => {
    try {
      //  console.log("hitted");

       //const { name, email, password, phone, dob,shippingaddress,image,noofproducts,role,created_at } = req.body;
       const { name, email, password,role,dob,noofproducts,shippingaddress,phone,created_at } = req.body;
        if (!name || !email || !password|| !role ||!dob||!noofproducts||!shippingaddress||!phone) {
            return res.status(400).json({ message: "all fields are required" });
        }

        const isSellerExist = await Seller.findOne({ email });

        if (isSellerExist) {
            return res.status(400).json({ message: "seller already exist" });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

     

        const sellerData = new Seller({ name, email, password: hashedPassword,role,dob,noofproducts,shippingaddress,phone,created_at });
        await sellerData.save();

        const token = generateToken(sellerData._id);
       // res.cookie("token", token);
// Exclude password from the response 
 //const sellerResponse = sellerData.toObject();
  //delete sellerResponse.password;
  res.cookie("token", token, {
    sameSite: NODE_ENV === "production" ? "None" : "Lax",
    secure: NODE_ENV === "production",
    httpOnly: NODE_ENV === "production",
});
      res.json({ success: true , message: "seller account created" });
       
     // return res.json({ data: sellerData, message: "seller account created" });

    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};

export const sellerLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "all fields are required" });
        }

        const sellerExist = await Seller.findOne({email});

        if (!sellerExist) {
            return res.status(404).json({ message: "seller does not exist" });
        }

        const passwordMatch = bcrypt.compareSync(password, sellerExist.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: "seller not authenticated" });
        }

        const token = generateToken(sellerExist._id,'seller');
        //res.cookie("token", token);
        res.cookie("token", token, {
            sameSite: NODE_ENV === "production" ? "None" : "Lax",
            secure: NODE_ENV === "production",
            httpOnly: NODE_ENV === "production",
        });
        return res.json({ success: true,  message: "seller login success" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};

export const sellerProfile = async (req, res, next) => {
    try {
      //  const sellerId = req.seller.id;
      const { seller } =req;

        const sellerData = await Seller.findById(seller.id).select("-password");
        console.log("sellerdata",sellerData);

        //return res.json({ success:true , message: "Seller profile fetched" ,sellerData});
        return res.json({ data: sellerData , message: "Seller profile fetched" ,sellerData});
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};
export const sellerForgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        const sellerData = await Seller.findOne({ email });

        if (!sellerData) {
            return res.status(404).json({ message: "seller not found" });
        }

        // Generate a reset token and send it via email (implementation not shown)
        const resetToken = generateToken(Seller._id);
        // Send resetToken via email to the seller (implementation not shown)

        return res.json({ message: "Password reset link sent to your email" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};

export const sellerChangePassword = async (req, res, next) => {
    try {
        const sellerId = req.seller.id;
        const { oldPassword, newPassword } = req.body;

        const sellerData = await Seller.findById(sellerId);

        if (!sellerData) {
            return res.status(404).json({ message: "Seller not found" });
        }

        const passwordMatch = bcrypt.compareSync(oldPassword, sellerData.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Old password is incorrect" });
        }

        sellerData.password = bcrypt.hashSync(newPassword, 10);
        await sellerData.save();

        return res.json({ message: "Password changed successfully" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};


export const sellerAccountDeActivate = async (req, res, next) => {
    try {
        const sellerId = req.seller.id;

        const sellerData = await Seller.findById(sellerId).select("-password");
        if (!sellerData) {
            return res.status(404).json({ message: "seller not found" });
        }

        sellerData.isActive=false
        await sellerData.save();
        return res.json({ data: sellerData, message: "seller account deactivated successfully" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};
export const sellerAccountActivate = async (req, res, next) => {
    try {
        const sellerId = req.seller.id;

        const sellerData = await Seller.findById(sellerId).select("-password");

        if (!sellerData) {
            return res.status(404).json({ message: "User not found" });
        }

        sellerData.isActive = true;
        await sellerData.save();

        return res.json({ message: "User account activated successfully" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};

export const checkSeller = async (req, res, next) => {
    try {
        //const { email } = req.body;

        //const sellerData = await Seller.findOne({ email });

        //if (!sellerData) {
          //  return res.status(404).json({ message: "seller not found" });
        //}

        res.json({ success : true , message: "seller authorized" });
    } catch (error) {
        console.log(error);
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};

export const updateSellerProfile = async (req, res, next) => {
    try {
        const sellerId = req.seller.id;// Get seller ID from URL parameter
        const { name, email, phone, dob, shippingaddress, billingaddress, profilepic,noofproducts } = req.body;

        const sellerData = await Seller.findById(sellerId);

        if (!sellerData) {
            return res.status(404).json({ message: "seller not found" });
        }

        sellerData.name = name || sellerData.name;
        sellerData.email = email || sellerData.email;
        sellerData.phone = phone || sellerData.phone;
        sellerData.dob = dob || sellerData.dob;
        sellerData.shippingaddress = shippingaddress || sellerData.shippingaddress;
      //  sellerData.billingaddress = billingaddress || sellerData.billingaddress;
        sellerData.image = profilepic || sellerData.image;
        sellerData.noofproducts=noofproducts || sellerData.noofproducts;

        const updatedseller = await sellerData.save();
         

        // Exclude password from the response
        const sellerResponse = updatedseller.toObject();
        delete sellerResponse.password;


        return res.json({ data: sellerResponse, message: "seller profile updated successfully" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};


export const sellerLogout = async (req, res, next) => {
    try {
        res.clearCookie("token", {
            sameSite: NODE_ENV === "production" ? "None" : "Lax",
            secure: NODE_ENV === "production",
            httpOnly: NODE_ENV === "production",
        });

     res.json({ success : true , message: "seller logged out" });
    } catch (error) {
        console.log(error);

        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};
export const deleteSeller = async (req, res, next) => {
    try {
        const sellerId = req.seller.id;

        const sellerData = await Seller.findById(sellerId).select("-password");

        if (!sellerData) {
            return res.status(404).json({ message: "Seller not found" });
        }

        await sellerData.remove();

        return res.json({ message: "Seller account deleted successfully" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};


// Create a new product  
export const createProduct = async (req, res, next) => {  
    try {  
        
        // Ensure user is authenticated and get seller ID  
        if (!req.seller || !req.seller.id) {  
             
            return res.status(401).json({ message: 'Seller not authenticated' });  
        }  
    // Destructure fields from the request body  

        const { name, description, categoryid ,subcategoryid, age_group,size, color, price, stock, weight, rating,seller} = req.body;  
       

        

 
//req.file=image;

  // const { id } = req.user;
        // Check if the required fields are present  
        if (!name || !description ||!categoryid|| !subcategoryid || !age_group || !size|| !color || !price || !stock ||!weight || !rating) {  
            return res.status(400).json({ message: "All fields are required" });  
        }  
       const sellerId=req.seller.id;
    
    
        // Handle file upload to Cloudinary  
        let uploadResult;  
        if (req.file) {  
            uploadResult = await cloudinaryInstance.uploader.upload(req.file.path);  
            console.log("Upload result:", uploadResult);  
            
        } else {  
            return res.status(400).json({ message: "File is required" });  
        }  

         
        // Create a new product  
        const newProduct = new Product({  
            name,  
            description,  
            categoryid,
            subcategoryid,
            age_group,
            size,  
            color,  
            price,  
            stock,  
            weight,  
            rating,  
            
           image: uploadResult.url,  
           //image,
            seller:sellerId
            // Correct usage of seller ID  
        });  
        const savedProduct = await newProduct.save();  
        return res.status(201).json({ data: savedProduct, message: "Product created successfully" });  
    } catch (error) {  
        console.error("Error creating product:", error);  
        return res.status(500).json({ message: "Internal server error" });  
    }  
};
// Delete a product  
export const deleteProduct = async (req, res) => {  
    try {  
        const productId = req.params.productId; // Ensure the URL has the :id parameter  
        const deletedProduct = await Product.findByIdAndDelete(productId);  

        if (!deletedProduct) {  
            return res.status(404).json({ message: "Product not found" });  
        }  

        return res.json({ message: "Product deleted successfully" });  
    } catch (error) {  
        console.error("Error deleting product:", error);  
        return res.status(500).json({ message: "Internal server error" });  
    }  
};


// Update a product  
export const updateProduct = async (req, res) => {  
    
        try {  
            const productId = req.params.productId;  
            
            const updatedData = req.body;  
    
            // Validate the product ID format
            if (!mongoose.Types.ObjectId.isValid(productId)) {
                return res.status(400).json({ message: "Invalid product ID" });
            }
    
            // Validate updatedData if necessary
            if (!updatedData.name) {
                return res.status(400).json({ message: "Product name is required" });
            }
    
            // Handle image upload if a new one is provided
            if (req.file) {  
                try {
                    const uploadResult = await cloudinaryInstance.uploader.upload(req.file.path);  
                    updatedData.image = uploadResult.url;  
                } catch (uploadError) {
                    console.error("Error uploading image:", uploadError);
                    return res.status(500).json({ message: "Image upload failed" });
                }
            }  
    
            // Find and update the product
            const updatedProduct = await Product.findByIdAndUpdate(productId, updatedData, { new: true });  
    
            if (!updatedProduct) {  
                return res.status(404).json({ message: "Product not found" });  
            }  
    
            return res.json({ data: updatedProduct, message: "Product updated successfully" });  
        } catch (error) {  
            console.error("Error updating product:", error);  
            return res.status(500).json({ message: "Internal server error" });  
        }  
    };
    
