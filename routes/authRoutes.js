import express from "express";
import Signup from "../controllers/authController.js/signup.js";
import Signin from "../controllers/authController.js/signin.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { searchUsersByEmail } from "../controllers/authController.js/search.js";
import fetchUserDetails from "../controllers/authController.js/fetch.js";
import deleteTo from "../controllers/authController.js/deleteTo.js";
import addTo from "../controllers/authController.js/addTo.js";
import Signout from "../controllers/authController.js/signout.js";
import GAuth from "../controllers/googleAuth/auth.js";
import GAuthCallback from "../controllers/googleAuth/googleAuthCallBack.js";

const authRouter = express.Router();
authRouter.post("/signup", Signup);
authRouter.post("/signin", Signin);
authRouter.get("/search", authMiddleware, searchUsersByEmail);
// authRouter.get("/search",searchUsersByEmail);
authRouter.get("/fetch", authMiddleware, fetchUserDetails);
authRouter.post("/delete", authMiddleware, deleteTo);
authRouter.post("/add", authMiddleware, addTo);
authRouter.get("/logout",Signout);
// google auth routes
authRouter.get("/auth/google",GAuth);
authRouter.post("/google/callback",GAuthCallback);

export default authRouter;
