import { Router } from 'express';
/*import path from 'path';
import CartManager from '../CartManager.js';
import ProductManager from '../ProductManager.js';
import { __dirname } from '../utils.js';*/
import CartsManager from '../../controllers/carts.controller.js';
import ProductsManager from '../../controllers/products.controller.js';
import TicketManager from '../../controllers/tickets.controller.js'
import { authMiddleware, authRole } from '../../utils/utils.js';
import UsersService from '../../services/users.service.js';
import UserDTO from '../../dto/user.dto.js';

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

router.post( '/carts/:uid/products/:pid', authMiddleware('jwt'), authRole(['user', 'premium']), async (req, res) => {
    const { uid } = req.params;
    const { pid } = req.params;
    //Validate pid and cid
    try {
        console.log('router params', req.params);
        const user = await UsersService.getById(uid);
        console.log('router user', user);
        const product = await ProductsManager.getById(pid);
        console.log('producto router', product);
        const updatedCart = await CartsManager.addProductToCart( user.cart._id, product.id, user._id );
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
    const { quantity } = req.body;
    const { uid } = req.query;
    //validate and delete
    try {
        const product = await ProductsManager.getById(pid);
        const cart = await CartsManager.getById(cid);
        const updatedCart = await CartsManager.updateQuantityOfProdcut( cart.id, product.id, quantity, uid );
        res.send(updatedCart);
    } catch (error) {
        res.status(500).send({error : error.message});
    }  

});

router.post('/carts/:cid/purchase', authMiddleware('jwt'), authRole(['user', 'premium']), async (req, res) => {
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