import { Router } from 'express';
import { emit } from '../../socket.js';
import ProductController from '../../controllers/products.controller.js';
import { buildResponsePaginated, uploader, __dirname, authMiddleware, authRole, generateProducts, getPaginatedOpts, BodyProductSetter } from '../../utils/utils.js';
import { logger } from '../../config/logger.js';
import { BodyProductValidator } from '../../middlewares/body-product-validator.js';


const router = Router();

router.get( '/products', authMiddleware('jwt'), async (req, res, next) =>{
    try {
        const { limit = 10, page = 1, sort, search } = req.query;
        const data = getPaginatedOpts(limit, page, sort, search);
        const result = await ProductController.getPaginatedProducts(data.criteria, data.options);
        logger.debug(`User ${req.user.email} asked for a list of ${result.totalDocs} products`);
        res.
            status(200).
            json( buildResponsePaginated( { ...result, sort, search } ) );        
    } catch (error) {
        next(error);
    }
});

router.get( '/products/:pid', authMiddleware('jwt'), async (req, res, next) =>{
    try {
        const { pid } = req.params;
        const product = await ProductController.getById(pid);
        logger.debug(`User ${req.user.email} asked for the product: ${product.title}`);
        res.
            status(200).
            send({ status: 'success', payload : product });
        //view
        //res.send(product);
    } catch (error) {
        next(error);
    }
});

router.post( '/products', authMiddleware('jwt'), authRole(['admin', 'premium']), uploader.array('thumbnails'), BodyProductValidator, async (req, res, next) => {
    try {
        const product = await BodyProductSetter( req );
        const createdProduct = await ProductController.create(product);
        emit('productAdded', createdProduct);
        logger.debug(`User ${req.user.email} created the product: ${createdProduct.title}`);
        res.
            status(200).
            send({ status : 'success', payload : createdProduct})
        //view
        //res.send(createdProduct);
    } catch (error) {
        next(error)
    }
});

router.put( '/products/:pid', authMiddleware('jwt'), authRole(['admin', 'premium']), async (req, res, next) => {
    try {
        const { pid } = req.params;
        const data = req.body;
        const product = await ProductController.updateById(pid, data);
        logger.debug(`User ${req.user.email} updated the product: ${product.title}`);
        res.
            status(200).
            send({ status: 'success', payload : product });
        //view
        //res.send(product);
    } catch (error) {
        next(error);
    }
});

router.delete('/products/:pid/user/:uid', authMiddleware('jwt'), authRole(['admin', 'premium']), async (req, res, next) => {
    try {
        const { pid, uid } = req.params;
        await ProductController.deleteById(pid, uid);
        res.
            status(200).
            send({ status: 'success' });
        //view
        //res.send(deletedProduct);
    } catch (error) {
        next(error);
    }
});

router.get( '/mockingproducts', authMiddleware('jwt'), authRole(['admin', 'premium']), async (req, res, next) => {
    try {
        const products = await generateProducts(50);
        logger.debug(`User ${req.user.email} asked for mocking products`);
        res.send(products);
    } catch (error) {
        next(error);
    }
});

export default router;