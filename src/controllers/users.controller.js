import { usersCollection } from "../database/db.js";
import { newUserSchema, userSchema } from "../schemas/users.schemas.js"
import jsonwebtoken from "jsonwebtoken";

export async function signUp(req, res) {
    try {
        const user = req.body;
        
        const validation = newUserSchema.validate(user);        
        if(validation.error)
            return res.status(422).send(validation.error.message);
    
        const previousUser = await usersCollection.findOne({"email": user.email});
        if(previousUser)
            res.status(403).send("Email de usuário já cadastrado. Faça login.")

        delete user.repeatPassword;
        usersCollection.insertOne(user);
        res.send("OK")
    }
    catch(e) {
        res.status(500).send(e.message);
    }
}

export async function signIn(req, res) {
    try {
        const user = req.body;

        const validation = userSchema.validate(user);
        if(validation.error)
            return res.status(422).send(validation.error.message);
        
        const requiredUser = await usersCollection.findOne({"email": user.email})
        if(!requiredUser || requiredUser.password != user.password)
            return res.status(403).send("Os dados não batem com nenhum usuário. Cheque os campos e tente novamente");
        
        delete requiredUser.password;
        delete requiredUser._id;

        const token = jsonwebtoken.sign(requiredUser, "ch1qu1nh@ gavião está com fome", {expiresIn: (user.keepLogged ? "365 days" : "1h")})
        res.send(token)
        
    }
    catch(e) {
        res.status(500).send(e.message);
    }
}