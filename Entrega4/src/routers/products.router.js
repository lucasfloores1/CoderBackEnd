import { Router } from 'express';
import path from 'path';
import { uploader } from '../utils.js';
import ProductManager from '../ProductManager.js';
import { __dirname } from '../utils.js';
import { emit } from '../socket.js';


const router = Router();

//Instancia de ProductManager
const pm = new ProductManager(path.join(__dirname,'./products.json'));

router.get( '/products', async (req, res) =>{
    const { query } = req;
    const products = await pm.getProducts();
    console.log('products:',products);
    if ( !query.limit ){
        try {
            res.send(products);
        } catch (error) {
            res.status(500).send({error : error.message});
        }
    } else {
        try {
            const filteredProdcuts = []
            let limit = parseInt(query.limit);
            if( limit > products.length ){
                limit = products.length
            }
            for (let i = 0; i < limit; i++) {
                const product = products[i];
                filteredProdcuts.push(product);
            }
            res.send(filteredProdcuts);
        } catch (error) {
            res.status(500).send({error : error.message});
        }
    }
});

router.get( '/products/:pid', async (req, res) =>{
    const { pid } = req.params;
    try {
        const product = await pm.getProductById(pid);
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
        thumbnails: filesPaths.map(filePath => filePath.replace(/\\/g, '/').replace(/.*img/, imgPath)),
    }
    try {
        const createdProduct = await pm.addProduct(newProduct);
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
        const product = await pm.updateProduct(pid, body);
        res.send(product);
    } catch (error) {
        res.status(500).send({error : error.message});
    }
});

router.delete( '/products/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        const deletedProduct = await pm.deleteProduct(pid);
        emit('productDeleted', deletedProduct.code);
        res.send(deletedProduct);
    } catch (error) {
        res.status(500).send({error : error.message});
    }
});

export default router;