//fetch-all-users
//inactivate-user
//fetch-all-seller
import e from "express";
import {adminLogin, adminLogout, adminProfile, adminSignup,adminForgotPassword ,
    adminChangePassword,userAccountDeActivate,checkAdmin,userAccountActivate,deleteAdmin,createCategory
    } from "../controllers/adminControllers.js";
 
import { userAuth } from "../middlewares/userAuth.js";
import { upload } from "../middlewares/multer.js";

import bcrypt from "bcrypt";
import {User } from "../models/userModel.js";
import {Admin } from "../models/adminModel.js";
import { generateToken } from "../utils/token.js";

const router = e.Router();

//signup
router.post("/signup", adminSignup);

//login
router.post("/login", adminLogin);

//profile
router.get("/profile", userAuth, adminProfile);

//logout
router.get("/logout", userAuth, adminLogout);

//profile-update
//router.post("/updateprofile", adminAuth, updateAdminProfile);

//forgot-password
router.post("/forgot-password", adminForgotPassword);

//change-password
router.put("/change-password", userAuth, adminChangePassword);

//account-deactivate
router.put("/account-deactivate", userAuth, userAccountDeActivate);

//check-admin
router.get("/check-admin",userAuth, checkAdmin);
 
//account-activate
 router.put("/account-activate", userAuth, userAccountActivate);

 //delete admin
 router.delete("/delete", userAuth, deleteAdmin);

 //create category
 router.post("/create-category",userAuth, upload.single('image'),createCategory);
 //add product
 //router.post("/products", adminAuth, addProduct);
 
 //update product
 //router.put("/products/:productId", adminAuth, updateProduct);

 //delete product
 //router.delete("/products/:productId", adminAuth, deleteProduct);

 //view orders
 //router.get("/orders", adminAuth, viewOrders);

 //update order status
 //router.put("/orders/:orderId", adminAuth, updateOrderStatus);

export { router as adminRouter };