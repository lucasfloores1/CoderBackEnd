const express = require('express');
const ProductManager = require('./ProductManager');

const app = express();
app.use(express.urlencoded({extended : true}));

//Instancia de PM
const pm = new ProductManager('./products.json');

app.get( '/products', async (req, res) =>{
    const { query } = req;
    const products = await pm.getProducts();
    if ( !query.limit ){
        try {
            res.send(products);
        } catch (error) {
            res.status(500).send({error : error.message});
        }
    } else {
        try {
            const filteredProdcuts = []
            let limit = parseInt(query.limit);
            if( limit > products.length ){
                limit = products.length
            }
            for (let i = 0; i < limit; i++) {
                const product = products[i];
                filteredProdcuts.push(product);
            }
            res.send(filteredProdcuts);
        } catch (error) {
            res.status(500).send({error : error.message});
        }
    }
});

app.get( '/products/:pid', async (req, res) =>{
    const { pid } = req.params;
    const id = parseInt(pid);
    try {
        const product = await pm.getProductById(id);
        res.send(product);
    } catch (error) {
        res.status(500).send({error : error.message});
    }
});

app.listen( 8080, () =>{
    console.log('Server running in port 8080');
});