import e from "express";
import {  getAllCategory, createCategory,getCategoryDetails} from "../controllers/categoryControllers.js";

import { sellerAuth } from "../middlewares/sellerAuth.js";
import { upload } from "../middlewares/multer.js";


const router = e.Router();

 
router.get("/get-all-category", getAllCategory);
// create product
router.post("/create-category", sellerAuth, upload.single('image'), createCategory);

 
router.get("/category-details/:name", getCategoryDetails);


export { router as categoryRouter };