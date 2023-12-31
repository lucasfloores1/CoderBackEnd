import multer from 'multer';
import path from 'path';
import url from 'url';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';

export const URL_BASE = 'http://localhost:8080/api';

//dirname
const __filename = url.fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

//hash
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (password, user) => bcrypt.compareSync( password, user.password );

//jwt
export const JWT_SECRET = '£0LD@F**3@3~H8WjK7@Reu6H.?-->tC=';

export const generateToken = (user) => {
    const payload = {
        id : user._id,
        username : user.username,
        email : user.email,
        role : user.role,
        name : `${user.first_name} ${user.last_name}`
    }
    const token = jwt.sign( payload, JWT_SECRET, { expiresIn : '5m' } );
    return token;
};

export const verifyToken = (token) => {
    return new Promise((resolve) => {
        jwt.verify(token, JWT_SECRET, (error, payload) => {
            if (error) {
                return resolve(false);
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