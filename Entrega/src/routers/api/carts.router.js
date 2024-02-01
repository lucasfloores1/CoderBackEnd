import { Router } from 'express';
/*import path from 'path';
import CartManager from '../CartManager.js';
import ProductManager from '../ProductManager.js';
import { __dirname } from '../utils.js';*/
import CartsManager from '../../controllers/carts.controller.js';
import ProductsManager from '../../controllers/products.controller.js';
import TicketManager from '../../controllers/tickets.controller.js'
import { authMiddleware, authRole } from '../../utils/utils.js';

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

router.get( '/carts/:cid',  authMiddleware('jwt'), async (req, res) => {
    const { cid } = req.params
    try {
        const cart = await CartsManager.getById(cid);
        res.send(cart);
    } catch (error) {
        res.status(500).send({error : error.message});
    }
});

router.post( '/carts/:cid/products/:pid', authMiddleware('jwt'), authRole(['user']), async (req, res) => {
    const { cid } = req.params;
    const { pid } = req.params;
    //Validate pid and cid
    try {
        const product = await ProductsManager.getById(pid);
        const cart = await CartsManager.getById(cid);
        const updatedCart = await CartsManager.addProductToCart( cart.id, product.id );
        res.send(updatedCart);
    } catch (error) {
        res.status(500).send({error : error.message});
    }
});

router.delete( '/carts/:cid/products/:pid', authMiddleware('jwt'), async (req, res) => {
    const { cid } = req.params;
    const { pid } = req.params;
    //validate and delete
    try {
        const product = await ProductsManager.getById(pid);
        const cart = await CartsManager.getById(cid);
        console.log(product, cart);
        const updatedCart = await CartsManager.deleteProductFromCart( cart.id, product.id );
        res.send(updatedCart);
    } catch (error) {
        res.status(500).send({error : error.message});
    }    
});

router.delete( '/carts/:cid', authMiddleware('jwt'), async (req, res) => {
    const { cid } = req.params;
    //validate and delete
    try {
        const cart = await CartsManager.getById(cid);
        const updatedCart = await CartsManager.deleteAllProductsFromCart( cart.id );
        res.send(updatedCart);
    } catch (error) {
        res.status(500).send({error : error.message});
    }    
});

router.put( '/carts/:cid/products/:pid', authMiddleware('jwt'), async (req, res) => {
    const { cid } = req.params;
    const { pid } = req.params;
    const { quantity } = req.body
    //validate and delete
    try {
        const product = await ProductsManager.getById(pid);
        const cart = await CartsManager.getById(cid);
        const updatedCart = await CartsManager.updateQuantityOfProdcut( cart.id, product.id, quantity );
        res.send(updatedCart);
    } catch (error) {
        res.status(500).send({error : error.message});
    }  

});

router.post('/carts/:cid/purchase', authMiddleware('jwt'), authRole(['user']), async (req, res) => {
    const { cid } = req.params;
    //validate and purchase
    try {
        const ticket = await TicketManager.create(cid, req.user.email);
        res.send(ticket);
    } catch (error) {
        res.status(500).send({error : error.message});
    }
});

export default router;