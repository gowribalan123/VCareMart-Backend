import e from "express";
import { addProductToCart, getCart, removeProductFromCart,updateQuantity } from "../controllers/cartControllers.js";
import { userAuth } from "../middlewares/userAuth.js";

const router = e.Router();

router.get("/get-cart", userAuth, getCart);
router.post("/add-to-cart",userAuth,addProductToCart);
router.delete("/remove-from-cart",userAuth,removeProductFromCart);
router.put("/update-quantity",userAuth,updateQuantity);

export { router as cartRouter };