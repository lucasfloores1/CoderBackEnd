import multer from 'multer';
import path from 'path';
import url from 'url';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import config from '../config/config.js';
import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';

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
    console.log(Products);
    return Products;
};

//jwt

export const generateRestorePasswordToken = (email) => {
    const token = jwt.sign( {email}, config.jwt_secret, { expiresIn : '1h' } );
    return token;
};

export const generateToken = (user) => {
    const payload = {
        id : user._id,
        username : user.username,
        email : user.email,
        role : user.role,
        name : `${user.first_name} ${user.last_name}`
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

//multer
const storage = multer.diskStorage({
    destination : (req, file, callback) => {
        const folderPath = path.join(__dirname, '../public/img');
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
      payload: data.docs.map((doc) => doc.toJSON()),
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