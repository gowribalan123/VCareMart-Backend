import e from "express";
import { addaddress,getaddress,deleteaddress} from "../controllers/addressControllers.js";
import { userAuth } from "../middlewares/userAuth.js";

const router = e.Router();

router.post("/add-shippingaddress", userAuth, addaddress);
router.get("/get-shippingaddress", userAuth, getaddress);
router.delete("/delete-shippingaddress", userAuth, deleteaddress);


export { router as shippingaddressRouter };