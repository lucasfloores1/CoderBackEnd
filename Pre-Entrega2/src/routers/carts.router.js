import { Router } from 'express';
/*import path from 'path';
import CartManager from '../CartManager.js';
import ProductManager from '../ProductManager.js';
import { __dirname } from '../utils.js';*/
import CartsManager from '../dao/Carts.manager.js';
import ProductsManager from '../dao/Products.manager.js';

const router = Router();


/*//Instancia de CartManager y ProductManager
const cm = new CartManager(path.join(__dirname,'./carts.json'));
const pm = new ProductManager(path.join(__dirname,'./products.json'));*/

router.post( '/carts', async (req, res) => {
    try {
        const newCart = await CartsManager.create();
        res.send(newCart);
    } catch (error) {
        res.status(500).send({error : error.message});
    }
});

router.get( '/carts/:cid', async (req, res) => {
    const { cid } = req.params
    try {
        const cart = await CartsManager.getById(cid);
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
        const product = await ProductsManager.getById(pid);
        const cart = await CartsManager.getById(cid);
        const updatedCart = await CartsManager.addProductToCart( cart._id.toString(), product._id.toString() );
        res.send(updatedCart);
    } catch (error) {
        res.status(500).send({error : error.message});
    }
});

router.delete( '/carts/:cid/products/:pid', async (req, res) => {
    const { cid } = req.params;
    const { pid } = req.params;
    //validate and delete
    try {
        const product = await ProductsManager.getById(pid);
        const cart = await CartsManager.getById(cid);
        const updatedCart = await CartsManager.deleteProductFromCart( cart._id.toString(), product._id.toString() );
        res.send(updatedCart);
    } catch (error) {
        res.status(500).send({error : error.message});
    }    
});

router.delete( '/carts/:cid', async (req, res) => {
    const { cid } = req.params;
    //validate and delete
    try {
        const cart = await CartsManager.getById(cid);
        const updatedCart = await CartsManager.deleteAllProductsFromCart( cart._id.toString() );
        res.send(updatedCart);
    } catch (error) {
        res.status(500).send({error : error.message});
    }    
});

router.put( '/carts/:cid/products/:pid', async (req, res) => {
    const { cid } = req.params;
    const { pid } = req.params;
    const { quantity } = req.body
    //validate and delete
    try {
        const product = await ProductsManager.getById(pid);
        const cart = await CartsManager.getById(cid);
        const updatedCart = await CartsManager.updateQuantityOfProdcut( cart._id.toString(), product._id.toString(), quantity );
        res.send(updatedCart);
    } catch (error) {
        res.status(500).send({error : error.message});
    }  

});

export default router;