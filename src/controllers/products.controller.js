import { ObjectID } from "bson";
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
        const user = res.locals.user;
        
        const product = user.cart.find(value => value._id === ObjectID(productId))
        if(product) {
            product.amount += req.body.amount;
            if(product.amount <= 0)
                return res.status(403).send("Caso queira retirar o produto do carrinho, use o botão de deletar");
            user.cart.forEach(value => {if(value._id === product._id) value.amount = product.amount}) 
        }
        else {
            const newProduct = await productsCollection.findOne({_id: ObjectID(productId)});
            newProduct.amount = 1;
            user.cart.push(newProduct);
        }

        usersCollection.updateOne({_id: user._id}, {$set: user})
        res.send("OK");
    }
    catch(e) {
        res.status(500).send(e);
        console.log(e);
    }
}