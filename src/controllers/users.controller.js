import { usersCollection } from "../database/db.js";
import { newUserSchema, userSchema } from "../schemas/users.schemas.js"
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
dotenv.config();

export async function signUp(req, res) {
    try {
        if(!req.file)
            res.status(422).send("Coloque uma foto de perfil válida")

        const user = {
            ...req.body,
            "profilePicture": req.file
        };

        const validation = newUserSchema.validate(user);        
        console.log(user);
        if(validation.error)
            return res.status(422).send(validation.error.message);
    
        const previousUser = await usersCollection.findOne({"email": user.email});
        if(previousUser)
            res.status(403).send("Email de usuário já cadastrado. Faça login.")

        delete user.repeatPassword;
        user.password = await bcrypt.hash(req.body.password, 10);
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
        if(!requiredUser || !bcrypt.compare(user.password, requiredUser.password))
            return res.status(403).send("Os dados não batem com nenhum usuário. Cheque os campos e tente novamente");
        
        delete requiredUser.password;
        delete requiredUser._id;

        const token = jsonwebtoken.sign(requiredUser, process.env.JWT_KEY, {expiresIn: (user.keepLogged ? "365 days" : "1h")});
        console.log(user);
        res.send({
            "username": requiredUser.username,
            "profilePicture": requiredUser.profilePicture,
            "sessionId": token
        })
        
    }
    catch(e) {
        res.status(500).send(e.message);
    }
}