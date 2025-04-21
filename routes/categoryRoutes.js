import e from "express";
import {  getAllCategory, createCategory,getCategoryDetails} from "../controllers/categoryControllers.js";

import { userAuth } from "../middlewares/userAuth.js";
import { upload } from "../middlewares/multer.js";


const router = e.Router();

 
router.get("/get-all-category", getAllCategory);
// create product
router.post("/create-category", userAuth, upload.single('image'), createCategory);

 
router.get("/category-details/:categoryId", getCategoryDetails);


export { router as categoryRouter };