import e from "express";
import { getProductDetails, getAllProducts, createProduct, deleteProduct,updateProduct } from "../controllers/productControllers.js";

import { sellerAuth } from "../middlewares/sellerAuth.js";
import { upload } from "../middlewares/multer.js";


const router = e.Router();

router.get("/product-details/:productId", getProductDetails);
router.get("/get-all-products", getAllProducts);
// create product
router.post("/create-product", sellerAuth, upload.single('image'), createProduct);
router.put("/update-product/:productId",sellerAuth,upload.single('image'),updateProduct);
router.delete("/delete-product/:productId",deleteProduct);


export { router as productRouter };