import e from "express";
import {  getAllSubCategory, createSubCategory,getSubCategoryDetails,getSubCategoryByCategory,deleteSubCategory} from "../controllers/subcategoryControllers.js";

import { userAuth } from "../middlewares/userAuth.js";
import { upload } from "../middlewares/multer.js";


const router = e.Router();

 
router.get("/get-all-subcategory", getAllSubCategory);
// create product
router.post("/create-subcategory", userAuth, upload.single('image'), createSubCategory);
router.get("/get-subcategory-by-category", getSubCategoryByCategory);
router.get("/subcategory-details/:subcategoryId", getSubCategoryDetails);
router.delete("/subcategory-delete/:subcategoryId",userAuth, deleteSubCategory);
export { router as subcategoryRouter };