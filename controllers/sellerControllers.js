import { Seller } from "../models/sellerModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/token.js";


const NODE_ENV = process.env.NODE_ENV;

export const sellerSignup = async (req, res, next) => {
    try {
      //  console.log("hitted");

        const { name, email, password, phone, dob,shippingaddress,billingaddress,profilepic,noofproducts,role,created_at } = req.body;

        if (!name || !email || !password || !phone || !dob || !shippingaddress || !billingaddress|| !noofproducts) {
            return res.status(400).json({ message: "all fields are required" });
        }

        const isSellerExist = await Seller.findOne({ email });

        if (isSellerExist) {
            return res.status(400).json({ message: "seller already exist" });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

     

        const sellerData = new Seller({ name, email, password: hashedPassword, phone,dob,shippingaddress,billingaddress, profilepic,noofproducts,role,created_at });
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
      const { user } =req;

        const userData = await Seller.findById(user.id).select("-password");
        return res.json({ success:true , message: "user profile fetched" ,userData});
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
        sellerData.billingaddress = billingaddress || sellerData.billingaddress;
        sellerData.profilepic = profilepic || sellerData.profilepic;
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

     res.json({ success : true , message: "user logged out" });
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
