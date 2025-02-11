import e from "express";
import { userLogin, userLogout, userProfile,updateUserProfile, userSignup, userforgotPassword,userchangePassword,userAccountDeActivate,checkUser,userAccountActivate,deleteUser,viewProducts ,addToCart , viewCart,checkOut,orderHistory} from "../controllers/userControllers.js";
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
  router.get("/check-user", userAuth,checkUser);

   //delete-user
   router.delete("/delete",userAuth, deleteUser);

   // view Product
   router.get("/product",userAuth, viewProducts);
   //add To Cart
    router.post("/add-to-cart", userAuth, addToCart);
    //view cart
   router.get("/get-cart", userAuth, viewCart);
   //check out
  router.post("/checkout", userAuth, checkOut);
   //order history
   router.get("/myOrders", userAuth, orderHistory);
   
   
export { router as userRouter };