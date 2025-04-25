import e from "express";
import {  getAllAgegroup, createAgegroup,getAgegroupDetails} from "../controllers/agegroupControllers.js";

import { userAuth } from "../middlewares/userAuth.js";

const router = e.Router();

 
router.get("/get-all-agegroup", getAllAgegroup);
// create product
router.post("/create-agegroup", userAuth, createAgegroup);

 
router.get("/agegroup-details/:id", getAgegroupDetails);


export { router as agegroupRouter };