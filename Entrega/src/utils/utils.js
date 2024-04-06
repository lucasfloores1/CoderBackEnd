import multer from 'multer';
import path from 'path';
import url from 'url';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import config from '../config/config.js';
import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

export const URL_BASE = 'http://localhost:8080/api';

//dirname
const __filename = url.fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

//ticket code
export const createTicketCode = uuidv4();

//hash
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (password, user) => bcrypt.compareSync( password, user.password );

//faker (MOCKING)
const createRandomProduct = () => {
    let images = [];
    for (let index = 0; index < faker.number.int({ min: 1, max: 5 }); index++) {
        const image = faker.image.url();
        images.push(image);
    }
    return {
        id : faker.database.mongodbObjectId(),
        title : faker.commerce.productName(),
        description : faker.lorem.paragraph(),
        price : faker.commerce.price(),
        code : faker.string.alphanumeric({ length: 10 }),
        stock : faker.number.int({ min: 10, max: 70 }),
        thumbnails : images,
        type : faker.commerce.department()
    }
};

export const generateProducts = (amount) => {
    const Products = faker.helpers.multiple( createRandomProduct, { count : amount } );
    return Products;
};

//Users
export const checkLastConnection = (user) => {
    const rightNow = new Date;
    const today = new Date( rightNow.getFullYear(), rightNow.getMonth(), rightNow.getDate() );
    const last_connection = new Date(user.last_connection);
    const lastConnectionDate = new Date( last_connection.getFullYear(), last_connection.getMonth(), last_connection.getDate() );
    const timeDifference = today - lastConnectionDate;
    const pastDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    return pastDays > 2
}

//jwt
export const generateRestorePasswordToken = (email) => {
    const token = jwt.sign( {email}, config.jwt_secret, { expiresIn : '1h' } );
    return token;
};

export const generateToken = (user) => {
    const payload = {
        id : user._id,
        email : user.email,
        role : user.role,
        name : `${user.first_name} ${user.last_name}`,
        cart_id : user.cart._id,
        isAdmin : user.role === 'admin'
    }
    const token = jwt.sign( payload, config.jwt_secret, { expiresIn : '5h' } );
    return token;
};

export const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, config.jwt_secret, (error, payload) => {
            if (error) {
                reject(error);
            }
            resolve(payload);
        });
    });
};

//auth
export const authMiddleware = (strategy) => (req, res, next) =>{

    switch (strategy) {
        case 'jwt':
            passport.authenticate(strategy, function (error, payload, info) {
                if (error) {
                    return next(error);
                }
                if (!payload) {
                    return res.status(401).json({ message : info.message ? info.message : info.toString() })
                }
                req.user = payload;
                next();
            })(req, res, next)
            break;
        case 'github':
            
            break;
    
        default:
            break;
    }
};

export const authRole = (roles) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message : 'Unauthorized' })
    }
    const { role } = req.user;
    if ( !roles.includes(role) ) {
        return res.status(403).json({ message : 'Not enough permissions' });
    }
    next();
};

//documents
export const checkDocuments = (documents) => {
    let hasAddress = false;
    let hasId = false;
    let hasAccount = false;

    for (const doc of documents) {
        const matches = doc.reference.match(/_([^_]+)_([^_]+)\.pdf$/);
        if (matches && matches.length >= 3) {
            const type = matches[1].toLowerCase();
            if (type === 'address') {
                hasAddress = true;
            } else if (type === 'id') {
                hasId = true;
            } else if (type === 'account') {
                hasAccount = true;
            }
        }
    }

    return hasAddress && hasId && hasAccount;
}

//Product Router
export const BodyProductSetter = async (req) => {
    const { body, files } = req
    const imgPath = '/img/products';
    const filesPaths = files.map( file => file.path );
    const defaultPath = `/img/products/default-product.jpg`;
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
    return newProduct;
}

//multer
const documentStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        const { params: { typeFile } } = req;
        let folderPath = null;
        switch (typeFile) {
          case 'profile':
            folderPath = path.resolve(__dirname, '..', '..', 'public', 'img', 'profiles');
            break;
          case 'id':
          case 'address':
          case 'account':
            folderPath = path.resolve(__dirname, '..', '..', 'public', 'documents');
            break;
          default:
            const error = new Error('Invalid type file')
            return callback(error);
        }
        fs.mkdirSync(folderPath, { recursive: true });
        callback(null, folderPath);
      },
      filename: (req, file, callback) => {
        const { user: { id }, params : { typeFile } } = req;
        let fileName;
        switch (typeFile) {
            case 'profile':
              fileName = `${id}_profile_${file.originalname}`;
              break;
            case 'id':
              fileName = `${id}_id_${file.originalname}`;
              break;
            case 'address':
              fileName = `${id}_address_${file.originalname}`;
              break;
            case 'account':
              fileName = `${id}_account_${file.originalname}`;
              break;
            default:
              const error = new Error('Invalid type file')
              return callback(error);
          }
        callback(null, fileName);
      },
});

export const documentUploader = multer({ storage : documentStorage });

const storage = multer.diskStorage({
    destination : (req, file, callback) => {
        const folderPath = path.join(__dirname, '../public/img/products');
        callback(null, folderPath);
    },
    filename : (req, file, callback) => {
        const fileName = Date.now() + '-' + file.originalname;
        callback(null, fileName);
    },
});

export const uploader = multer({ storage });

//paginate
export const buildResponsePaginated = (data, baseUrl = URL_BASE) => {
    return {
      //status:success/error
      status: 'success',
      //payload: Resultado de los productos solicitados
      payload: data.docs.map((doc) => doc),
      //TotalDocs: Total de resultados
      totalDocs: data.totalDocs,
      //totalPages: Total de páginas
      totalPages: data.totalPages,
      //prevPage: Página anterior
      prevPage: data.prevPage,
      //nextPage: Página siguiente
      nextPage: data.nextPage,
      //page: Página actual
      page: data.page,
      //hasPrevPage: Indicador para saber si la página previa existe
      hasPrevPage: data.hasPrevPage,
      //hasNextPage: Indicador para saber si la página siguiente existe.
      hasNextPage: data.hasNextPage,
      //prevLink: Link directo a la página previa (null si hasPrevPage=false)
      prevLink: data.hasPrevPage ? `${baseUrl}/products?limit=${data.limit}&page=${data.prevPage}` : null,
      //nextLink: Link directo a la página siguiente (null si hasNextPage=false)
      nextLink: data.hasNextPage ? `${baseUrl}/products?limit=${data.limit}&page=${data.nextPage}` : null,
      //hasPages: Ayuda para renderizar paginacion en handlebars
      hasPagination: data.hasNextPage || data.hasPrevPage,
    };  
};

export const getPaginatedOpts = ( limit, page, sort, search ) => {
    const criteria = {};
    const options = { limit, page }
    if (sort) { 
        options.sort = { price: sort };
    }
    if (search) {
        criteria.type = search;
    }
    const data = { criteria, options }
    return data;
}
