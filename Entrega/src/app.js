import express from 'express';
import path from 'path';
import { __dirname } from './utils/utils.js';
import handlebars from 'express-handlebars';
import cookieParser from 'cookie-parser';
/*import sessions from 'express-session';
import MongoStorage from 'connect-mongo'*/
import passport from 'passport';
import { init as passportInit } from './config/passport.config.js';
import productsRoter from './routers/api/products.router.js';
import cartsRouter from './routers/api/carts.router.js';
import viewsRouter from './routers/views/views.router.js';
import config from './config/config.js';
import authRouter from './routers/api/auth.router.js';
import { errorHandlerMiddleware } from './middlewares/error-handler.middleware.js'

const app = express();

//const SECRET_KEY = `a0A9U9qUkEwc`;

app.use(cookieParser(config.cookie_secret));
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

passportInit();
app.use(passport.initialize());

app.use('/api', productsRoter, cartsRouter, authRouter);
app.use('/', viewsRouter);


app.use(errorHandlerMiddleware);

export default app;