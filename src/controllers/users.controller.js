import { usersCollection } from "../database/db.js";
import { newUserSchema, userSchema } from "../schemas/users.schemas.js"
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
const nodeoutlook = await import('nodejs-nodemailer-outlook')

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
            "email": requiredUser.email,
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

export async function finishBuy(req, res) {
    try {
        const user = res.locals.user;
        let total = 0;
        console.log(user.cart)
        nodeoutlook.sendEmail({
            auth: {
                user: process.env.SHOP_EMAIL,
                pass: process.env.SHOP_EMAIL_PASSWORD
            },
            from: 'eclothingoficial@gmail.com',
            to: user.email,
            subject: "[E-Clothing] Compra finalizada!",
            html: `
            <h1> [E-Clothing] Sua compra foi finalizada, confirme os itens </h1>
            ${user.cart.map(value => {
                total += value.price * value.amount
                return `
                <section style="display:flex">
                    <img style="width:150px; height: 150px" src=${value.image} alt=""/>
                    <div style="margin-left: 20px">
                        <p>${value.name}</p>
                        <p>Quantidade: <strong>${value.amount}</strong></p>
                        <p>Valor: <strong>${value.amount} × R$${Number(value.price).toFixed(2)} = R$${value.price * value.amount}</strong></p>
                    </div>
                </section>`
            })}
            <h2> TOTAL: R$${total}</h2>
            `,
            onError: (e) => console.log(e),
            onSuccess: (i) => console.log(i)
        });
        res.send(user.cart);
        user.cart = [];
        usersCollection.updateOne({_id: user._id}, {$set: user});
    }
    catch(e) {
        console.log(e);
        res.status(500).send(e)
    }
}