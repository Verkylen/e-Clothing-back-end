import { usersCollection } from "../database/db.js";
import { newUserSchema, userSchema } from "../schemas/users.schemas.js"
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
dotenv.config();

export async function signUp(req, res) {
    try {
        if(!req.file)
            return res.status(422).send("Coloque uma foto de perfil válida")

        const user = {
            ...req.body,
            "profilePicture": req.file
        };
        console.log(req);

        const validation = newUserSchema.validate(user);        
        console.log(user);
        if(validation.error)
            return res.status(422).send(validation.error.message);
    
        const previousUser = await usersCollection.findOne({"email": user.email});
        if(previousUser)
            return res.status(403).send("Email de usuário já cadastrado. Faça login.")

        delete user.repeatPassword;
        user.password = await bcrypt.hash(req.body.password, 10);
        usersCollection.insertOne({...user, "cart": [], "liked": []});
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

        const token = jsonwebtoken.sign({"email": requiredUser.email}, process.env.JWT_KEY, {expiresIn: (user.keepLogged ? "1000d" : "1h")});
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

export async function getCart(req, res) {
    try {
        const user = res.locals.user;
        console.log(user)
        res.send(user.cart);
    }
    catch(e) {
        res.status(500).send(e.message);
        console.log(e.message);
    }
}