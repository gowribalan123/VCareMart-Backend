import e  from "express";
import {userRouter} from "./userRoutes.js";
import {sellerRouter} from "./sellerRoutes.js";


const router=e.Router();

router.use("/user",userRouter);
router.use("/seller",sellerRouter);


export {router as apiRouter};