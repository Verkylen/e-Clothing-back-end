import dotenv from "dotenv";
import jsonwebtoken from "jsonwebtoken";
import { usersCollection } from "../database/db.js"

dotenv.config();

export default async function validateUser(req, res, next) {
    try {
        let sessionId = req.headers.authorization;
        sessionId = sessionId.replace("Bearer ", "");
        const user = jsonwebtoken.verify(sessionId, process.env.JWT_KEY);
        const requiredUser = await usersCollection.findOne({email: user.email});
        res.locals.user = requiredUser;
    }
    catch(e) {
        return res.status(500).send(e.message);
    }
    next();
}