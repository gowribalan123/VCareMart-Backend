import e from "express";
import {  getAllsubCategory, createsubCategory} from "../controllers/subcategoryControllers.js";

import { sellerAuth } from "../middlewares/sellerAuth.js";
import { upload } from "../middlewares/multer.js";


const router = e.Router();

 
router.get("/get-all-subcategory", getAllsubCategory);
// create product
router.post("/create-subcategory", sellerAuth, upload.single('image'), createsubCategory);


export { router as subcategoryRouter };