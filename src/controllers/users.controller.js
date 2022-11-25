import { usersCollection } from "../database/db.js";
import newUserSchema from "../schemas/users.schemas.js"

export default function signUp(req, res) {
    try {
        const user = req.body;
        const validation = newUserSchema.validate(user);
        console.log(validation)
        if(validation.error)
            return res.status(422).send(validation.error.message);
        usersCollection.insertOne(user);
        res.send("OK")
    }
    catch(e) {
        console.log("Oi")
        res.status(500).send(e.message);
    }
}