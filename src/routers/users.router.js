import { Router } from "express";
import signUp from "../controllers/users.controller.js";

const usersRouter = Router();

usersRouter.post("/sign-up", signUp)

export default usersRouter;
