import { Router } from 'express';
/*import path from 'path';
import ProductManager from '../ProductManager.js';*/
import { emit } from '../../socket.js';
import ProductsManager from '../../controllers/products.controller.js';
import { buildResponsePaginated, uploader, __dirname, authMiddleware, authRole, generateProducts } from '../../utils/utils.js';
import EnumsError from '../../utils/EnumsError.js';
import { CustomError } from '../../utils/CustomError.js';
import { generatorProductError ,productIdError } from '../../utils/CauseMessageError.js';


const router = Router();

/*//Instancia de ProductManager
const pm = new ProductManager(path.join(__dirname,'./products.json'));*/

router.get( '/products', async (req, res) =>{
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
    res.status(200).json(buildResponsePaginated({ ...result, sort, search }));
});

router.get( '/products/:pid', async (req, res) =>{
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
        res.send(product);
    } catch (error) {
        res.status(500).send({error : error.message});
    }
});

router.post( '/products', authMiddleware('jwt'), authRole(['admin']), uploader.array('thumbnails') ,async (req, res, next) => {
    try {
        const { body } = req
        const { 
            code,
            title,
            description,
            price,
            stock,
            type,
         } = body
         if (
            !code ||
            !title ||
            !description ||
            !price ||
            !stock ||
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
        res.send(createdProduct);
    } catch (error) {
        next(error)
    }
});

router.put( '/products/:pid', authMiddleware('jwt'), authRole(['admin']), async (req, res) => {
    const { pid } = req.params;
    const { body } = req;
    try {
        const product = await ProductsManager.updateById(pid, body);
        res.send(product);
    } catch (error) {
        res.status(500).send({error : error.message});
    }
});

router.delete( '/products/:pid', authMiddleware('jwt'), authRole(['admin']), async (req, res) => {
    const { pid } = req.params;
    try {
        const deletedProduct = await ProductsManager.getById(pid);
        await ProductsManager.deleteById(pid);
        emit('productDeleted', deletedProduct.code);
        res.send(deletedProduct);
    } catch (error) {
        res.status(500).send({error : error.message});
    }
});

router.get( '/mockingproducts', authMiddleware('jwt'), authRole(['admin']), async (req, res) => {
    try {
        const products = await generateProducts(50);
        res.send(products);
    } catch (error) {
        res.status(500).send({error : error.message});
    }
});

export default router;