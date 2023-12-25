import express from 'express';
import path from 'path';
import { __dirname } from './utils.js';
import handlebars from 'express-handlebars';
import cookieParser from 'cookie-parser';
/*import sessions from 'express-session';
import MongoStorage from 'connect-mongo'*/
import passport from 'passport';
import { init as passportInit } from './config/passport.config.js';
import productsRoter from './routers/products.router.js';
import cartsRouter from './routers/carts.router.js';
import viewsRouter from './routers/views.router.js';
import sessionsRouter from './routers/sessions.router.js'
import authRouter from './routers/auth.router.js'

const app = express();

const SECRET_KEY = `a0A9U9qUkEwc`;

app.use(cookieParser(SECRET_KEY));
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

app.use((error, req, res, next) => {
    const message = `There was an unexpected error : ${error.message}`;
    console.error(message);
    res.status(500).json({ message });
});

export default app;