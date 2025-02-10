import e from "express";
import {  getAllAgegroup, createAgegroup,getAgegroupDetails} from "../controllers/agegroupControllers.js";

import { sellerAuth } from "../middlewares/sellerAuth.js";

const router = e.Router();

 
router.get("/get-all-agegroup", getAllAgegroup);
// create product
router.post("/create-agegroup", sellerAuth, createAgegroup);

 
router.get("/agegroup-details/:id", getAgegroupDetails);


export { router as agegroupRouter };