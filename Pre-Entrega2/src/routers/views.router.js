import { Router } from 'express';
import path from 'path';
/*import ProductManager from '../ProductManager.js';*/
import { __dirname } from '../utils.js';
import ProductsManager from '../dao/Products.manager.js';
import productModel from '../models/product.model.js';
import { buildResponsePaginated } from '../utils.js';

const router = Router();

/*//Instancia de ProductManager
const pm = new ProductManager(path.join(__dirname,'./products.json'));*/

router.get('/', async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect('/login');
    }
    const user = {
      ...req.session.user,
      isAdmin : req.session.user.role === 'admin'
    }
    const products = await ProductsManager.get();
    //formating data
    const templateData = {
      title: 'Products List',
      products: products.map(product => ({ ...product.toObject() })),
    };
    console.log(templateData.products);
    //render
    if ( req.session.user.role === 'admin' ){
      res.render('productsAdmin', templateData, user)
    }
    res.render('index', templateData);
  } catch (error) {
    res.render('error', { title : 'Error Page', errorMessage: error.message });
  }
});

router.get('/products', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, search } = req.query;
    //validate login
    if (!req.user) {
      return res.redirect('/login');
    }
    const dataUser = {
      ...req.user,
      isAdmin : req.user.role === 'admin'
    }
    const user = dataUser._doc;
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
    //render
    if ( req.user.role === 'admin' ){
      return res.render('productsAdmin', {title: 'Admin Products Table', ...data, user})
    }
     return res.render('products', { title: 'Products List', ...data , user });
  } catch (error) {
    return res.render('error', { title : 'Error Page', errorMessage: error.message })
  }
});

router.get('/realtimeproducts', async (req, res) => {
  try {
    const products = await ProductsManager.get();
    const templateData = {
      title: 'LIVE Products List',
      products: products.map(product => ({ ...product.toObject() })),
    };
    res.render('realtimeproducts', templateData);
  } catch (error) {
    res.render('error', { title : 'Error Page', errorMessage: error.message })
  }
});

router.get('/chat', async (req, res) =>{
  res.render('chat', { title : 'Chat ecommerce' });
});

router.get('/login', async (req, res) =>{
  res.render('login', { title : 'Log-In' });
});

router.get('/register', async (req, res) =>{
  res.render('register', { title : 'Register' });
});

router.get('/restore-password', async (req, res) =>{
  res.render('restore-pw', { title : 'Restore Password' });
});

export default router;