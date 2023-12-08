import ProductModel from "../models/product.model.js";
import path from 'path';
import { __dirname } from '../utils.js';
import fs from 'fs';

export default class ProductsManager {
    static async get() {
        return ProductModel.find();
    }

    static async getById(pid) {
        const product = await ProductModel.findById(pid);
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    }
    static async create(product) {
        //Validate
        if ( !product.code || !product.title || !product.description || !product.price || !product.stock || !product.type ){
            throw new Error('All the fields are required');
        }
        //Validate code
        const products = await this.get();
        let duplicatedProduct = products.find( prod => prod.code === product.code );
        if ( duplicatedProduct ){
            throw new Error('Product code already exist');
        }       
        const newProduct = await ProductModel.create(product);
        console.log(`Product created succesfully (${newProduct._id}) .`);
        return newProduct;
    }

    static async updateById(pid, data) {
        await ProductModel.updateOne({ _id: pid },{ $set: data });
        console.log(`Product updated succesfully (${pid}) .`);
    }

    static async deleteById(pid) {
        try {
            const deletedProduct = await ProductModel.findById(pid);
            //Delete IMGS from PUBLIC
            deletedProduct.thumbnails.forEach((thumbnail) => {
                const filePath = path.join(__dirname, `../public/${thumbnail}`);
                fs.unlinkSync(filePath);
            });
            //await ProductModel.deleteOne({ _id: pid });
            console.log(`Product Deleted succesfully (${pid}) .`);
            await ProductModel.deleteOne(deletedProduct);
        } catch (error) {
            throw new Error('There was an error while deleting the products');
        }
    }
};