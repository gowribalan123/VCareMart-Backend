import e from "express";
import { getProductDetails, getAllProducts, createProduct, deleteProduct,updateProduct ,getProductByCategory,getProductBySubCategory} from "../controllers/productControllers.js";

import { userAuth } from "../middlewares/userAuth.js";
import { upload } from "../middlewares/multer.js";



const router = e.Router();

router.get("/product-details/:productId", getProductDetails);
router.get("/get-product-by-subcategory/:subcategoryid",getProductBySubCategory);
router.get("/get-product-by-category/:categoryid",getProductByCategory);
router.get("/get-all-products", getAllProducts);
// create product

router.post("/create-product", userAuth, upload.single('image'), createProduct);
router.put("/update-product/:productId",userAuth,upload.single('image'),updateProduct);
router.delete("/delete-product/:productId",userAuth,deleteProduct);


export { router as productRouter };