import { Router } from 'express';
/*import path from 'path';
import ProductManager from '../ProductManager.js';*/
import { __dirname } from '../utils.js';
import ProductsManager from '../dao/Products.manager.js';
import productModel from '../models/product.model.js';
import { buildResponsePaginated } from '../utils.js';

const router = Router();

/*//Instancia de ProductManager
const pm = new ProductManager(path.join(__dirname,'./products.json'));*/

router.get('/', async (req, res) => {
  try {
    const products = await ProductsManager.get().lean();
    res.render('index', {title : 'Product List', products});
  } catch (error) {
    res.status(500).send({error : error.message});
  }
});

router.get('/products', async (req, res) => {
  try {
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
    const baseUrl = 'http://localhost:8080';
    const data = buildResponsePaginated({ ...result, sort, search }, baseUrl);
    res.render('products', { title: 'Products List', ...data });
  } catch (error) {
    res.status(500).send({error : error.message});
  }
});

router.get('/realtimeproducts', async (req, res) => {
  try {
    const products = await ProductsManager.get().lean();
    res.render('realtimeproducts', { title: 'LIVE Products List', products });
  } catch (error) {
    res.status(500).send({error : error.message});
  }
});

router.get('/chat', async (req, res) =>{
  res.render('chat', { title : 'Chat ecommerce' });
});

export default router;