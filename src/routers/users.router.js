import { Router } from "express";
import {signIn, signUp} from "../controllers/users.controller.js";
import multer from "multer";

const usersRouter = Router();
const upload = multer();

usersRouter.post("/sign-up", upload.single('profilePicture'), signUp)
usersRouter.post("/login", signIn)

export default usersRouter;
