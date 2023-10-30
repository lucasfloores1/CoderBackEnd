import { Router } from 'express';
import path from 'path';
import ProductManager from '../ProductManager.js';
import { __dirname } from '../utils.js';

const router = Router();

//Instancia de ProductManager
const pm = new ProductManager(path.join(__dirname,'./products.json'));

router.get('/', async (req, res) => {
  try {
    const products = await pm.getProducts();
    res.render('index', {title : 'Product List', products});
  } catch (error) {
    res.status(500).send({error : error.message});
  }
});

router.get('/realtimeproducts', async (req, res) => {
  try {
    const products = await pm.getProducts();
    res.render('realtimeproducts', { title: 'LIVE Products List', products });
  } catch (error) {
    res.status(500).send({error : error.message});
  }
})

export default router;