import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import usersRouter from "./routers/users.router.js"

dotenv.config();

const app = express();
const router = express.Router();

router.use(usersRouter)

app.use(express.json());
app.use(cors())
app.use(router)

app.listen(process.env.PORT || 5000)
