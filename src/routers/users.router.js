import { Router } from "express";
import {signIn, signUp} from "../controllers/users.controller.js";

const usersRouter = Router();

usersRouter.post("/sign-up", signUp)
usersRouter.post("/login", signIn)

export default usersRouter;
