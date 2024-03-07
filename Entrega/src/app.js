import express from 'express';
import path from 'path';
import { __dirname } from './utils/utils.js';
import handlebars, { create as hbscreate } from 'express-handlebars';
import cookieParser from 'cookie-parser';
/*import sessions from 'express-session';
import MongoStorage from 'connect-mongo'*/
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { logger } from './config/logger.js';

import passport from 'passport';
import { init as passportInit } from './config/passport.config.js';
import productsRoter from './routers/api/products.router.js';
import cartsRouter from './routers/api/carts.router.js';
import viewsRouter from './routers/views/views.router.js';
import config from './config/config.js';
import authRouter from './routers/api/auth.router.js';
import { errorHandlerMiddleware } from './middlewares/error-handler.middleware.js'
import { addLogger } from './config/logger.js';

const app = express();

//const SECRET_KEY = `a0A9U9qUkEwc`;

app.use(cookieParser(config.cookie_secret));
app.use(addLogger);

//sessions deprecated
/*app.use(sessions({
    store : MongoStorage.create({
        mongoUrl: URI,
        mongoOptions: {},
        ttl : 60*30,
    }),
    secret : SECRET_KEY,
    resave : true,
    saveUninitialized : true,
}));*/

//docs
if (config.env !== 'prod') {
    const swaggerOpts = {
      definition: {
        openapi: '3.0.0',
        info: {
          title: 'E-commerce API',
          description: 'This is the documentation of an E-commerce API',
        },
      },
      apis: [path.join(__dirname, '..', 'docs', '**', '*.yaml')],
    };
    const specs = swaggerJSDoc(swaggerOpts);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
}
  
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static('public'));

//handlebars
const hbs = hbscreate({
  helpers: {
    multiply( a, b ) { return a * b; }
  }
})
app.engine('handlebars', hbs.engine);
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'handlebars');

passportInit();
app.use(passport.initialize());

app.use('/api', productsRoter, cartsRouter, authRouter);
app.use('/', viewsRouter);


app.use(errorHandlerMiddleware);

export default app;