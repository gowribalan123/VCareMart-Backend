import e  from "express";

import {userRouter} from "./userRoutes.js";
//import {sellerRouter} from "./sellerRoutes.js";
import {productRouter} from "./productRoutes.js";
import { adminRouter } from "./adminRoutes.js";
import {agegroupRouter} from "./agegroupRoutes.js";
import {categoryRouter} from "./categoryRoutes.js";
import {subcategoryRouter} from "./subcategoryRoutes.js";
//import {productdetailsRouter} from "./productdetailsRoutes.js";
import {cartRouter} from "./cartRoutes.js";
import {reviewRouter} from "./reviewRoutes.js";
import {orderRouter}  from "./orderRoutes.js";
import {paymentRouter} from "./paymentRoutes.js";

const router=e.Router();

router.use("/user",userRouter);
//router.use("/seller",sellerRouter);
router.use("/admin",userRouter);
router.use("/product",productRouter);
router.use("/order",orderRouter);
router.use("/agegroup",agegroupRouter);
router.use("/category",categoryRouter);
router.use("/subcategory",subcategoryRouter);
//router.use("/productdetails",productdetailsRouter);
router.use("/cart",cartRouter);
router.use("/review",reviewRouter);
router.use("/payment",paymentRouter);


export {router as apiRouter};