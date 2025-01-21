import e from "express";
import { userLogin, userLogout, userProfile,updateUserProfile, userSignup, userforgotPassword,userchangePassword,userAccountDeActivate,checkUser } from "../controllers/userControllers.js";
import { userAuth } from "../middlewares/userAuth.js";

const router = e.Router();

//signup
router.post("/signup", userSignup);

//login
router.put("/login", userLogin);

//profile
router.get("/profile", userAuth, userProfile);

//profile-update 
router.post("/updateprofile", userAuth, updateUserProfile);
//router.post("/updateprofile/:_id", userAuth, updateUserProfile);




//logout
router.get("/logout", userAuth, userLogout);

//forgot-password 
router.post("/forgot-password", userforgotPassword); 

//change-password 
router.put("/change-password", userAuth, userchangePassword);

//account-deactivate
 router.put("/account-deactivate", userAuth, userAccountDeActivate); 
 
 //check-user
  router.get("/check-user", checkUser);


export { router as userRouter };