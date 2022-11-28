import { Router } from "express";
import {signIn, signUp, getCart, finishBuy} from "../controllers/users.controller.js";
import validateUser from "../middlewares/validateUser.middleware.js";
import multer from "multer";

const usersRouter = Router();
const upload = multer();

usersRouter.post("/sign-up", upload.single('profilePicture'), signUp);
usersRouter.post("/login", signIn);
usersRouter.post("/finish-buy", validateUser, finishBuy);
usersRouter.get("/cart", validateUser, getCart)

export default usersRouter;
