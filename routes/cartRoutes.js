import e from "express";
import { addProductToCart, getCart, removeProductFromCart } from "../controllers/cartControllers.js";
import { userAuth } from "../middlewares/userAuth.js";

const router = e.Router();

router.get("/get-cart/:userId", userAuth, getCart);
router.post("/add-to-cart",userAuth,addProductToCart);
router.delete("/remove-from-cart",userAuth,removeProductFromCart);


export { router as cartRouter };