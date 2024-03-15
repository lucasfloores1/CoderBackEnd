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
import { logger } from '../../config/logger.js';

const router = Router();


/*//Instancia de CartManager y ProductManager
const cm = new CartManager(path.join(__dirname,'./carts.json'));
const pm = new ProductManager(path.join(__dirname,'./products.json'));*/

//deprecated because every user owns a cart
/*router.post( '/carts', async (req, res) => {
    try {
        const newCart = await CartsManager.create();
        res.status(200).send(newCart);
    } catch (error) {
        res.status(500).send({error : error.message});
    }
});*/

//get by id
router.get( '/carts/:cid',  authMiddleware('jwt'), async (req, res) => {
    const { cid } = req.params
    try {
        console.log(cid);
        const cart = await CartsManager.getById(cid);
        res.status(200).send({ status : 'success', payload : cart})
        //views
        //res.send(cart);
    } catch (error) {
        res.status(500).send({error : error.message});
    }
});
//add product
router.post( '/carts/:uid/products/:pid', authMiddleware('jwt'), authRole(['user','admin','premium']), async (req, res) => {
    const { uid } = req.params;
    const { pid } = req.params;
    //Validate pid and uid
    try {
        const user = await UsersService.getById(uid);
        const product = await ProductsManager.getById(pid);
        const updatedCart = await CartsManager.addProductToCart( user.cart._id, product.id, user._id );
        logger.debug(`User ${user.email} added the product ${product.title} to the cart ${user.cart._id}`)
        res.status(200).send({ status : 'success', payload : updatedCart})
        //views
        //res.redirect('/products');
    } catch (error) {
        res.status(500).send({error : error.message});
    }
});
//delete one product
router.delete( '/carts/:cid/products/:pid', authMiddleware('jwt'), async (req, res) => {
    const { cid } = req.params;
    const { pid } = req.params;
    //validate and delete
    try {
        const product = await ProductsManager.getById(pid);
        const cart = await CartsManager.getById(cid);
        const updatedCart = await CartsManager.deleteProductFromCart( cart.id, product.id );
        logger.debug(`User ${req.user.email} deleted the product ${product.title} from the cart ${updatedCart._id}`);
        res.status(200).send({ status : 'success', payload : updatedCart})
        //views
        //res.send(updatedCart);
    } catch (error) {
        res.status(500).send({error : error.message});
    }    
});
//delete all products
router.delete( '/carts/:cid', authMiddleware('jwt'), async (req, res) => {
    const { cid } = req.params;
    //validate and delete
    try {
        const cart = await CartsManager.getById(cid);
        const updatedCart = await CartsManager.deleteAllProductsFromCart( cart.id );
        logger.debug(`User ${req.user.email} deleted the products from the cart ${updatedCart.id}`)
        res.status(200).send({ status : 'success', payload : updatedCart})
        //views
        //res.send(updatedCart);
    } catch (error) {
        res.status(500).send({error : error.message});
    }    
});
//edit quantity of product
router.put( '/carts/:cid/products/:pid/user/:uid', authMiddleware('jwt'), async (req, res) => {
    const { cid } = req.params;
    const { pid } = req.params;
    const { quantity } = req.body;
    const { uid } = req.params;
    //validate and delete
    try {
        const product = await ProductsManager.getById(pid);
        const cart = await CartsManager.getById(cid);
        const updatedCart = await CartsManager.updateQuantityOfProdcut( cart.id, product.id, quantity, uid );
        logger.debug(`User ${req.user.email} added ${quantity} units of the product ${product.title} to the cart ${updatedCart._id}`);
        res.status(200).send({ status : 'success', payload : updatedCart})
        //views
        //res.send(updatedCart);
    } catch (error) {
        res.status(500).send({error : error.message});
    }  

});
//buy
router.post('/carts/:cid/purchase', authMiddleware('jwt'), authRole(['user','admin', 'premium']), async (req, res) => {
    const { cid } = req.params;
    //validate and purchase
    try {
        const ticket = await TicketManager.create(cid, req.user.email);
        logger.debug(`User ${req.user.email} bought the cart ${cid} and got the ticket ${ticket.code}`);
        res.status(200).send({ status : 'success', payload : ticket})
        //views
        //res.redirect(`/purchase-confirmation?ticketId=${ticket.id}`)
    } catch (error) {
        res.status(500).send({error : error.message});
    }
});

export default router;