import { ObjectID } from "bson";
import { application } from "express";
import { productsCollection, usersCollection } from "../database/db.js";

export async function getProducts(req, res) {
    try {
        const search = req.query.search;
        const products = await productsCollection.find({}).toArray();
        if(!search)
            return res.send(products)

        const sendProducts = products.filter(value => value.name.indexOf(search) > -1)
        res.send(sendProducts);
    }
    catch(e) {
        res.status(500).send(e);
        console.log(e)
    }
}

export async function getCategory(req, res) {
    try {
        let search = req.query.search;
        const category = req.params.category;

        const products = await productsCollection.find({category: category}).toArray();
        if(!search)
            return res.send(products)

        search = search.toLowerCase();
        console.log(search)

        const sendProducts = products.filter(value => value.name.toLowerCase().indexOf(search) > -1)
        res.send(sendProducts);
    }
    catch(e) {
        res.status(500).send(e);
        console.log(e);
    }
}

export async function addToCart(req, res) {
    try {
        
        const productId = req.params.id;
        const details = req.body;
        const user = res.locals.user;

        const requiredProduct = await productsCollection.findOne({_id : ObjectID(productId)});
        const userHasProduct = user.cart.findIndex(value => {
            return value._id === ObjectID(productId) &&
                   value.color === details.color &&
                   value.size === details.size
        })
        console.log("Hi")
        if(userHasProduct !== -1) {
            user.cart[userHasProduct].amount += details.amount;
            if(user.cart[userHasProduct].amount <= 0) 
                return res.status(401).send("Caso queira deletar o produto, use o botão de delete.");
        }
        else {
            user.cart.push({
                ...requiredProduct,
                ...details
            })
        }

        await usersCollection.updateOne({_id: user._id}, {$set: user});
        res.send("OK");
    }
    catch(e) {
        console.log(e)
        res.status(500).send(e);
    }

}