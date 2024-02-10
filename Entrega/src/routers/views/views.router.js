import { Router } from 'express';
/*import ProductManager from '../ProductManager.js';*/
import ProductsManager from '../../controllers/products.controller.js';
import productModel from '../../dao/models/product.model.js';
import { buildResponsePaginated, __dirname, authMiddleware, verifyToken } from '../../utils/utils.js';

const router = Router();

/*//Instancia de ProductManager
const pm = new ProductManager(path.join(__dirname,'./products.json'));*/

router.get('/', async (req, res) => {
  try {
    if (!req.user) {
      return res.redirect('/login');
    }
    const user = {
      ...req.user,
      isAdmin : req.user.role === 'admin'
    }
    const products = await ProductsManager.get();
    //formating data
    const templateData = {
      title: 'Products List',
      products: products.map(product => ({ ...product.toObject() })),
    };
    //render
    if ( req.user.role === 'admin' ){
      res.render('productsAdmin', templateData, user)
    }
    res.render('index', templateData);
  } catch (error) {
    res.render('error', { title : 'Error Page', errorMessage: error.message });
  }
});

router.get('/products', authMiddleware('jwt'), async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, search } = req.query;
    //validate login
    if (!req.user) {
      return res.redirect('/login');
    }
    const user = {
      ...req.user,
      isAdmin : req.user.role === 'admin'
    }
    console.log(user);
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

router.get('/restore-password-email', async (req, res) =>{
  res.render('restore-pw-email', {title : 'Restore Password'})
});

router.get('/restore-password', async (req, res) => {
  const { token } = req.query;
  try {
    const payload = await verifyToken(token);
    const email = payload.email;
    res.render('restore-pw', { title : 'Restore Password', email , repeated : false })
  } catch (error) {
    res.render('restore-pw-email', {title : 'Restore Password', expired : true})
  }
});

//LoggerTest

router.get('/loggerTest', (req, res) => {
  req.logger.debug('Testing Logger Level (debug)');
  req.logger.http('Testing Logger Level (http)');
  req.logger.info('Testing Logger Level (info)');
  req.logger.warning('Testing Logger Level (warning)');
  req.logger.error('Testing Logger Level (error)');
  req.logger.fatal('Testing Logger Level (fatal)');
  res.send('Loggers Tested');
});

export default router;