import { productsCollection } from "../database/db.js";

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