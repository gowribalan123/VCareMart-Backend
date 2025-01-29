import e from "express";
import { userLogin, userLogout, userProfile,updateUserProfile, userSignup, userforgotPassword,userchangePassword,userAccountDeActivate,checkUser,userAccountActivate,deleteUser } from "../controllers/userControllers.js";
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
 
 //account-activate
 router.put("/account-activate", userAuth, userAccountActivate);

 //check-user
  router.get("/check-user", checkUser);

   //delete-user
   router.delete("/delete", deleteUser);

   //router.get("/products", viewProducts);
   //router.post("/cart", userAuth, addToCart);
   //router.get("/cart", userAuth, viewCart);
   //router.post("/checkout", userAuth, checkout);
   //router.get("/orders", userAuth, orderHistory);
   
   
export { router as userRouter };