import { Router } from 'express';
/*import path from 'path';
import ProductManager from '../ProductManager.js';*/
import { emit } from '../../socket.js';
import ProductsManager from '../../controllers/products.controller.js';
import { buildResponsePaginated, uploader, __dirname, authMiddleware, authRole, generateProducts } from '../../utils/utils.js';
import EnumsError from '../../utils/EnumsError.js';
import { CustomError } from '../../utils/CustomError.js';
import { generatorProductError ,productIdError } from '../../utils/CauseMessageError.js';
import UsersService from '../../services/users.service.js';
import { logger } from '../../config/logger.js';


const router = Router();

/*//Instancia de ProductManager
const pm = new ProductManager(path.join(__dirname,'./products.json'));*/

router.get( '/products', authMiddleware('jwt'), async (req, res) =>{
    const { limit = 10, page = 1, sort, search } = req.query;
    // sort esta asociado al campo price. Ademas los posibles valores son asc y desc
    // search esta asociado al campo type
    const criteria = {};
    const options = { limit, page };
    if (sort) { 
        options.sort = { price: sort };
    }
    if (search) {
        criteria.type = search;
    }
    //const result = await productModel.paginate(criteria, options);
    const result = await ProductsManager.getPaginatedProducts(criteria, options);
    logger.debug(`User ${req.user.email} asked for a list of ${result.lenght} products`);
    res.status(200).json(buildResponsePaginated({ ...result, sort, search }));
});

router.get( '/products/:pid', authMiddleware('jwt'), async (req, res) =>{
    const { pid } = req.params;
    if (!parseInt(pid, 10)) {
        CustomError.create({
            name: 'Invalid product id format',
            cause: productIdError(pid),
            message: 'There was an error while getting the product by id',
            code: EnumsError.INVALID_PARAMS_ERROR,
        });
    }
    try {
        const product = await ProductsManager.getById(pid);
        logger.debug(`User ${req.user.email} asked for the product: ${product.title}`);
        res.status(200).send({ status: 'success', payload : product });
        //view
        //res.send(product);
    } catch (error) {
        res.status(500).send({error : error.message});
    }
});

router.post( '/products', authMiddleware('jwt'), authRole(['admin', 'premium']), uploader.array('thumbnails') ,async (req, res, next) => {
    try {
        const { body } = req
        const { 
            code,
            title,
            description,
            price,
            stock,
            type,
            owner,
            isAdmin
         } = body
         if (
            !code ||
            !title ||
            !description ||
            !price ||
            !stock ||
            !isAdmin ||
            !type
        ) {
            CustomError.create({
                name: 'Invalid data product',
                cause: generatorProductError({
                    code,
                    title,
                    description,
                    price,
                    stock,
                    type,
                    owner,
                    isAdmin
                }),
                message: 'There was an error while creating the product',
                code: EnumsError.BAD_REQUEST_ERROR,
              })
        }
        const files = req.files;
        const imgPath = '/img';
        const filesPaths = files.map( file => file.path );
        const defaultPath = `/img/default-product.jpg`;
        let thumbnails = [];
        if (filesPaths) {
            thumbnails.push(defaultPath);
        } else {
            thumbnails = filesPaths.map(filePath => filePath.replace(/\\/g, '/').replace(/.*img/, imgPath))
        }
        const newProduct = {
            ...body,
            thumbnails
        }
        const createdProduct = await ProductsManager.create(newProduct);
        emit('productAdded', createdProduct);
        logger.debug(`User ${req.user.email} created the product: ${createdProduct.title}`);
        res.status(200).send({ status : 'success', payload : createdProduct})
        //view
        //res.send(createdProduct);
    } catch (error) {
        next(error)
    }
});

router.put( '/products/:pid', authMiddleware('jwt'), authRole(['admin', 'premium']), async (req, res) => {
    const { pid } = req.params;
    const data = req.body;
    try {
        const product = await ProductsManager.updateById(pid, data);
        logger.debug(`User ${req.user.email} updated the product: ${product.title}`);
        res.status(200).send({ status: 'success', payload : product });
        //view
        //res.send(product);
    } catch (error) {
        res.status(500).send({error : error.message});
    }
});

/*router.delete( '/products/:pid/user/:uid', authMiddleware('jwt'), authRole(['admin', 'premium']), async (req, res) => {
    const { pid } = req.params;
    const { uid } = req.params;
    try {
        const user = await UsersService.getById(uid);
        if (user.role === 'premium') {
            const deletedProduct = await ProductsManager.getById(pid);
            if (user._id = deletedProduct.owner.id) {
                await ProductsManager.deleteById(deletedProduct.id);
                emit('productDeleted', deletedProduct.code);
                res.send(deletedProduct)
            }
            throw new Error('You cant delete a product that you did not create')
        }
        const deletedProduct = await ProductsManager.getById(pid);
        await ProductsManager.deleteById(pid);
        emit('productDeleted', deletedProduct.code);
        res.send(deletedProduct);
    } catch (error) {
        res.status(500).send({error : error.message});
    }
});*/
router.delete('/products/:pid/user/:uid', authMiddleware('jwt'), authRole(['admin', 'premium']), async (req, res) => {
    const { pid, uid } = req.params;
    try {
        console.log('router');
        console.log('pid', pid, 'uid', uid);
        const user = await UsersService.getById(uid);
        const deletedProduct = await ProductsManager.getById(pid);   
        if (!deletedProduct) {
            throw new Error('Product not found');
        }
        if (user.role === 'premium') {
            if ( user._id.toString() !== deletedProduct.owner.id.toString() ) {
                throw new Error('You cannot delete a product that you did not create');
            }
        }
        await ProductsManager.deleteById(pid);
        emit('productDeleted', deletedProduct.code);
        logger.debug(`User ${user.email} deleted the product: ${deletedProduct.title}`);
        res.status(200).send({ status: 'success', payload : deletedProduct });
        //view
        //res.send(deletedProduct);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.get( '/mockingproducts', authMiddleware('jwt'), authRole(['admin', 'premium']), async (req, res) => {
    try {
        const products = await generateProducts(50);
        logger.debug(`User ${req.user.email} asked for mocking products`);
        res.send(products);
    } catch (error) {
        res.status(500).send({error : error.message});
    }
});

export default router;