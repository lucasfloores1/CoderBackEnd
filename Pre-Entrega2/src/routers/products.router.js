import { Router } from 'express';
import { uploader } from '../utils.js';
/*import path from 'path';
import ProductManager from '../ProductManager.js';*/
import { __dirname } from '../utils.js';
import { emit } from '../socket.js';
import ProductsManager from '../dao/Products.manager.js';
import productModel from '../models/product.model.js';
import { buildResponsePaginated } from '../utils.js';


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
    const result = await productModel.paginate(criteria, options);
    res.status(200).json(buildResponsePaginated({ ...result, sort, search }));
});

router.get( '/products/:pid', async (req, res) =>{
    const { pid } = req.params;
    try {
        const product = await ProductsManager.getById(pid);
        res.send(product);
    } catch (error) {
        res.status(500).send({error : error.message});
    }
});

router.post( '/products', uploader.array('thumbnails') ,async (req, res) => {
    const { body } = req
    const files = req.files
    const imgPath = '/img';
    const filesPaths = files.map( file => file.path );
    const newProduct = {
        ...body,
        thumbnails: filesPaths.map(filePath => filePath.replace(/\\/g, '/').replace(/.*img/, imgPath)) || `/img/default-product.jpg`,
    }
    try {
        const createdProduct = await ProductsManager.create(newProduct);
        emit('productAdded', createdProduct);
        res.send(createdProduct);
    } catch (error) {
        res.status(500).send({error : error.message});
    }
});

router.put( '/products/:pid', async (req, res) => {
    const { pid } = req.params;
    const { body } = req;
    try {
        const product = await ProductsManager.updateById(pid, body);
        res.send(product);
    } catch (error) {
        res.status(500).send({error : error.message});
    }
});

router.delete( '/products/:pid', async (req, res) => {
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

export default router;