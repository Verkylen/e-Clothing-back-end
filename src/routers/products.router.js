import { Router } from "express";
import { getCategory, getProducts, addToCart, deleteFromCart } from "../controllers/products.controller.js";
import validateUser from "../middlewares/validateUser.middleware.js";

const productsRouter = Router();

productsRouter.get("/products", getProducts);
productsRouter.get("/products/:category", getCategory);
productsRouter.post("/products/:id", validateUser, addToCart);
productsRouter.delete("/products/:id", validateUser, deleteFromCart);

export default productsRouter;
