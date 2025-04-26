import e from "express";
import { sellerLogin, sellerLogout, sellerProfile, sellerSignup ,updateSellerProfile,sellerForgotPassword ,
    sellerChangePassword,sellerAccountDeActivate,checkSeller,sellerAccountActivate,deleteSeller,createProduct,
    updateProduct,deleteProduct
    } from "../controllers/sellerControllers.js";

import {userAuth } from "../middlewares/userAuth.js";
import {sellerAuth } from "../middlewares/sellerAuth.js";
import { upload } from "../middlewares/multer.js";
 
 

const router = e.Router();

//signup
router.post("/signup", sellerSignup);

//login
router.post("/login", sellerLogin);

//profile
router.get("/profile",userAuth, sellerProfile);

//logout
router.get("/logout",userAuth, sellerLogout);

//profile-update
router.post("/updateprofile",userAuth, updateSellerProfile);

//forgot-password
router.post("/forgot-password", sellerForgotPassword);

//change-password
router.put("/change-password",userAuth, sellerChangePassword);

//account-deactivate
router.put("/account-deactivate",userAuth, sellerAccountDeActivate);

//check-seller
router.get("/check-seller",userAuth, checkSeller);
 
//account-activate
 router.put("/account-activate",userAuth, sellerAccountActivate);

 //delete seller
 router.delete("/delete",userAuth, deleteSeller);

 //add product
router.post("/create-product",userAuth, upload.single('image'), createProduct);


//update product
router.put("/update-product/:productId",userAuth,upload.single('image'),updateProduct);

 

 //delete product
 router.delete("/products/:productId",userAuth, deleteProduct);

 //view orders
 //router.get("/orders",userAuth, viewOrders);

 //update order status
 //router.put("/orders/:orderId",userAuth, updateOrderStatus);

export { router as sellerRouter };