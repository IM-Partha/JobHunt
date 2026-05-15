import express from "express";
import { Login, Logout, Register, Updateprofile, toggleSaveJob } from "../controller/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/multer.js";

const userRouter = express.Router();

userRouter.route("/register").post(singleUpload,Register);
userRouter.route("/login").post(Login);
userRouter.route("/logout").get(Logout);
userRouter.route("/profile/update").post(isAuthenticated,singleUpload, Updateprofile);
userRouter.route("/save-job/:id").post(isAuthenticated, toggleSaveJob);

export default userRouter;
