import { Router } from 'express';
/*import path from 'path';
import ProductManager from '../ProductManager.js';*/
import { __dirname } from '../utils.js';
import ProductsManager from '../dao/Products.manager.js';

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