import e from "express";

import { getProductDetails, getAllProducts, createProduct, deleteProduct,updateProduct,getProductBySubCategoryName ,getProductByCategory,getProductBySubCategory,getAllProductsBySeller} from "../controllers/productControllers.js";

import { userAuth } from "../middlewares/userAuth.js";
import { upload } from "../middlewares/multer.js";



const router = e.Router();

router.get("/product-details/:productId", getProductDetails);
router.get("/get-product-by-subcategory/:subcategoryid",getProductBySubCategory);
router.get("/get-product-by-subcategoryname/:subcategoryNames",getProductBySubCategoryName);
router.get("/get-product-by-category/:categoryid",getProductByCategory);
router.get("/get-all-products", getAllProducts);
//view products by seller
router.get("/get-all-products-by-seller/:seller",userAuth,getAllProductsBySeller);

// create product

router.post("/create-product", userAuth, upload.single('image'), createProduct);

router.put("/update-product/:productId",userAuth,upload.single('image'),updateProduct);
router.delete("/delete-product/:productId",userAuth,deleteProduct);


export { router as productRouter };