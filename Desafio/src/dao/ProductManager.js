import fs from 'fs';
import { v4 as uuidV4 } from 'uuid';
import path from 'path';
import { __dirname } from './utils.js';


class ProductManager {
    constructor( path ){
        this.path = path;
    }

    async getProducts() {
        const products = await getProductsFromFile(this.path);
        //Removing deleted Porducts
        const filteredProducts = products.filter(product => !product.isDeleted)
        return filteredProducts;
    }

    async addProduct( product ) {
        //Validate
        if ( !product.code || !product.title || !product.description || !product.price || !product.stock ){
            throw new Error('All the fields are required');
        }
        //Read File
        const products = await getProductsFromFile(this.path);
        //Validate code
        let duplicatedProduct = products.find( prod => prod.code === product.code );
        if ( duplicatedProduct ){
            throw new Error('Product code already exist');
        }
        //Add Product
        const newProduct = {
            id: uuidV4(),
            ...product
        }
        products.push( newProduct );
        //Write File
        await saveProductsInFile( this.path, products );

        return newProduct;
    }

    async getProductById( id ){
        //Read File
        const products = await getProductsFromFile(this.path);
        //Validate
        let product = products.find( product => product.id === id );
        if(!product){
            throw new Error('Product does not exist');
        }
        if(product.code === 'deleted'){
            throw new Error('This item was deleted');
        }
        return product;
    }

    async updateProduct( id, data ){
        const { code, title, description, price, thumbnail, stock } = data;
        //Read File
        const products = await getProductsFromFile(this.path);
        //Validate
        const index = products.findIndex( (product) => product.id === id );
        if ( index === -1 ){
            throw new Error('Product not found or missing id');
        }
        const duplicadtedCode = products.find( (product) => ( product.code === code ) );
        if ( duplicadtedCode ){
            throw new Error('Code already exists');
        }
        if( products[index].code === 'deleted' ){
            throw new Error('This item was deleted');
        }
        //Update Product
        if (code){
            products[index].code = code;
        }
        if (title){
            products[index].title = title;
        }
        if (description){
            products[index].description = description;
        }
        if (price){
            products[index].price = price;
        }
        if (thumbnail){
            products[index].thumbnail = thumbnail;
        }
        if (stock){
            products[index].stock = stock;
        }
        //Write File
        await saveProductsInFile( this.path, products );

        return products[index];
    }

    async deleteProduct( id ){
        //Read File
        const products = await getProductsFromFile(this.path);
        //Validate
        const index = products.findIndex( (product) => product.id === id );
        if ( index === -1 ){
            throw new Error('Product not found');
        }
        //Get the Product
        const deletedProduct = products[index]
        //Delete IMGS from PUBLIC
        deletedProduct.thumbnails.forEach((thumbnail) => {
            const filePath = path.join(__dirname, `../public/${thumbnail}`);
            fs.unlinkSync(filePath);
        });
        //Delete Product
        products[index]={
            id : deletedProduct.id,
            isDeleted : true,
        }
        //Write File
        await saveProductsInFile( this.path, products );

        return deletedProduct;
    }
}

const getProductsFromFile = async (path) => {
    if (!fs.existsSync(path)){
        return [];
    }
    const content = await fs.promises.readFile( path, 'utf-8' ); 
    return JSON.parse(content);
}

const saveProductsInFile = async (path, data) => {
    const content = JSON.stringify( data, null, '\t' );
    return fs.promises.writeFile( path, content, 'utf-8' );
}

export default ProductManager;