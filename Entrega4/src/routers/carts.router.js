import { Router } from 'express';
import path from 'path';
import CartManager from '../CartManager.js';
import ProductManager from '../ProductManager.js';
import { __dirname } from '../utils.js';

// const { Router } = require('express');
// const path = require('path')
// const CartManager = require('../CartManager');
// const ProductManager = require('../ProductManager');

const router = Router();

//Instancia de CartManager y ProductManager
const cm = new CartManager(path.join(__dirname,'./carts.json'));
const pm = new ProductManager(path.join(__dirname,'./products.json'));

router.post( '/carts', async (req, res) => {
    try {
        const newCart = await cm.createCart();
        res.send(newCart);
    } catch (error) {
        res.status(500).send({error : error.message});
    }
});

router.get( '/carts/:cid', async (req, res) => {
    const { cid } = req.params
    try {
        const cart = await cm.getCartById(cid);
        res.send(cart);
    } catch (error) {
        res.status(500).send({error : error.message});
    }
});

router.post( '/carts/:cid/products/:pid', async (req, res) => {
    const { cid } = req.params;
    const { pid } = req.params;
    //Validate pid and cid
    try {
        const product = await pm.getProductById(pid);
        const cart = await cm.getCartById(cid);
        const updatedCart = await cm.addProductToCart( cart.id, product.id );
        res.send(updatedCart);
    } catch (error) {
        res.status(500).send({error : error.message});
    }
});

//module.exports = router;
export default router;