import e from "express";
import {addToWishlist, removeFromWishlist, getWishlist, getProductsInWishlist } from "../controllers/wishlistControllers.js";

import { userAuth } from "../middlewares/userAuth.js";
//import { upload } from "../middlewares/multer.js";


const router = e.Router();

 
router.get("/get-wishlist",userAuth,getWishlist);
 
router.post("/add-wishlist", userAuth, addToWishlist);
router.delete("/delete-wishlist",userAuth,removeFromWishlist);
 router.get("/wishlist/:userId/product/:productId",userAuth,getProductsInWishlist);
export { router as wishlistRouter };