import e from "express";
////import { sellerLogin, sellerLogout, sellerProfile, sellerSignup } from "../controllers/sellerControllers.js";
//import { sellerAuth } from "../middlewares/sellerAuth.js";

const router = e.Router();

//signup
//router.post("/signup", sellerSignup);

//login
//router.put("/login", sellerLogin);

//profile
//router.get("/profile", sellerAuth, sellerProfile);

//logout
//router.get("/logout", sellerAuth, sellerLogout);

//profile-update
//forgot-password
//change-password
//account-deactivate


//check-seller

export { router as sellerRouter };