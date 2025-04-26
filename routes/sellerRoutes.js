import e from "express";
import { sellerLogin, sellerLogout, sellerProfile, sellerSignup ,updateSellerProfile,sellerForgotPassword ,
    sellerChangePassword,sellerAccountDeActivate,checkSeller,sellerAccountActivate,deleteSeller,createProduct,
    updateProduct,deleteProduct
    } from "../controllers/sellerControllers.js";

import {userAuth } from "../middlewares/userAuth.js";
import {sellerAuth } from "../middlewares/sellerAuth.js";
import {adminAuth } from "../middlewares/adminAuth.js";
import { upload } from "../middlewares/multer.js";
 
 

const router = e.Router();

//signup
router.post("/signup", sellerSignup);

//login
router.post("/login", sellerLogin);

//profile
router.get("/profile",sellerAuth, sellerProfile);

//logout
router.get("/logout",sellerAuth, sellerLogout);

//profile-update
router.post("/updateprofile",sellerAuth, updateSellerProfile);

//forgot-password
router.post("/forgot-password", sellerForgotPassword);

//change-password
router.put("/change-password",sellerAuth, sellerChangePassword);

//account-deactivate
router.put("/account-deactivate",sellerAuth, sellerAccountDeActivate);

//check-seller
router.get("/check-seller",sellerAuth, checkSeller);
 
//account-activate
 router.put("/account-activate",sellerAuth, sellerAccountActivate);

 //delete seller
 router.delete("/delete",adminAuth, deleteSeller);

 //add product
router.post("/create-product",sellerAuth, upload.single('image'), createProduct);


//update product
router.put("/update-product/:productId",sellerAuth,upload.single('image'),updateProduct);

 

 //delete product
 router.delete("/products/:productId",sellerAuth, deleteProduct);

 //view orders
 //router.get("/orders",userAuth, viewOrders);

 //update order status
 //router.put("/orders/:orderId",userAuth, updateOrderStatus);

export { router as sellerRouter };