import { Router } from 'express';
import CartController from '../../controllers/carts.controller.js';
import TicketController from '../../controllers/tickets.controller.js';
import { authMiddleware, authRole } from '../../utils/utils.js';
import { logger } from '../../config/logger.js';

const router = Router();

//get by id
router.get( '/carts/:cid',  authMiddleware('jwt'), async (req, res, next) => {
    try {
        const { cid } = req.params
        const cart = await CartController.getById(cid);
        res.
            status(200).
            send({ status : 'success', payload : cart })
        //views
        //res.send(cart);
    } catch (error) {
        next(error);
    }
});

//add product
router.post( '/carts/:uid/products/:pid', authMiddleware('jwt'), authRole(['user','admin','premium']), async (req, res, next) => {
    try {
        const { uid } = req.params;
        const { pid } = req.params;
        const updatedCart = await CartController.addProductToCart( pid, uid );
        res.
            status(200).
            send({ status : 'success', payload : updatedCart, message : 'Product added'})
        //views
        //res.redirect('/products');
    } catch (error) {
        next(error);
    }
});

//delete one product
router.delete( '/carts/:cid/products/:pid', authMiddleware('jwt'), async (req, res, next) => {
    try {
        const { cid } = req.params;
        const { pid } = req.params;
        const updatedCart = await CartController.deleteProductFromCart( cid, pid );
        logger.debug(`User ${req.user.email} deleted the product ${pid} from the cart ${updatedCart._id}`);
        res.
            status(200).
            send({ status : 'success', payload : updatedCart, message : 'Product deleted'});
        //views
        //res.send(updatedCart);
    } catch (error) {
        next(error);
    }    
});

//delete all products
router.delete( '/carts/:cid', authMiddleware('jwt'), async (req, res, next) => {
    try {
        const { cid } = req.params;
        const updatedCart = await CartController.deleteAllProductsFromCart( cid );
        logger.debug(`User ${req.user.email} deleted the products from the cart ${updatedCart.id}`)
        res.
            status(200).
            send({ status : 'success', payload : updatedCart, message : 'Products deleted'});
        //views
        //res.send(updatedCart);
    } catch (error) {
        next(error);
    }    
});

//edit quantity of product
router.put( '/carts/:cid/products/:pid/user/:uid', authMiddleware('jwt'), async (req, res, next) => {
    try {
        const { cid, pid, uid } = req.params;
        const { quantity } = req.body;
        const updatedCart = await CartController.updateQuantityOfProdcut( cid, pid, quantity, uid );
        logger.debug(`User ${req.user.email} changed the quantity to ${quantity} units of the product ${pid} to the cart ${updatedCart._id}`);
        res.
            status(200).
            send({ status : 'success', payload : updatedCart, message : 'Product updated'});
        //views
        //res.send(updatedCart);
    } catch (error) {
        next(error);
    }
});

//buy
router.post('/carts/:cid/purchase', authMiddleware('jwt'), authRole(['user','admin', 'premium']), async (req, res, next) => {
    try {
        const { cid } = req.params;
        const ticket = await TicketController.create(cid, req.user.email);
        logger.debug(`User ${req.user.email} bought the cart ${cid} and got the ticket ${ticket.code}`);
        res.
            status(200).
            send({ status : 'success', payload : ticket })
        //views
        //res.redirect(`/purchase-confirmation?ticketId=${ticket.id}`)
    } catch (error) {
        next(error);
    }
});

export default router;