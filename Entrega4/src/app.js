import express from 'express';
import path from 'path';
import { __dirname } from './utils.js';
import handlebars from 'express-handlebars';
import productsRoter from './routers/products.router.js'
import cartsRouter from './routers/carts.router.js'
import viewsRouter from './routers/views.router.js'

// const express = require('express');
// const path = require('path');
// const handlebars = require('express-handlebars');
// const productsRouter = require('./routers/products.router');
// const cartsRouter = require('./routers/carts.router');
// const homeRouter = require('./routers/home.router');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.use('/api', productsRoter, cartsRouter);
app.use('/', viewsRouter);

app.use((error, req, res, next) => {
    const message = `There was an unexpected error : ${error.message}`;
    console.error(message);
    res.status(500).json({ message });
});

// app.listen(PORT, () =>{
//     console.log(`Server Running into hhtp://localhost:${PORT}`);
// });

export default app;