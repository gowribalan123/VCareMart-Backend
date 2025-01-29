import e from "express";
import { addReview, deleteReview, getAverageRating, getProductReviews } from "../controllers/reviewControllers.js";
import { userAuth } from "../middlewares/userAuth.js";

const router = e.Router();

router.post("/add-review", userAuth, addReview);
router.get("/get-product-reviews",getProductReviews);
router.delete('/delete-review',userAuth,deleteReview);
router.get('/get-avg-rating',getAverageRating);


export { router as reviewRouter };