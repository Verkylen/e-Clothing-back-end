import { Router } from "express";
import {signIn, signUp, getCart} from "../controllers/users.controller.js";
import validateUser from "../middlewares/validateUser.middleware.js";
import multer from "multer";

const usersRouter = Router();
const upload = multer();

usersRouter.post("/sign-up", upload.single('profilePicture'), signUp);
usersRouter.post("/login", signIn);
usersRouter.get("/cart", validateUser, getCart)

export default usersRouter;
