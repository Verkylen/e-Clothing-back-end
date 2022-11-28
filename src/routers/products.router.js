import { Router } from "express";
import { getCategory, getProducts } from "../controllers/products.controller.js";

const productsRouter = Router();

productsRouter.get("/products", getProducts);
productsRouter.get("/products/:category", getCategory);


export default productsRouter;
