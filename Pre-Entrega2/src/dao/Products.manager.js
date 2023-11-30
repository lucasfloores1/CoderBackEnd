import ProductModel from "../models/product.model.js";
import path from 'path';
import { __dirname } from '../utils.js';
import fs from 'fs';

export default class ProductsManager {
    static get() {
        return ProductModel.find();
    }

    static async getById(pid) {
        const product = await ProductModel.findById(pid);
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    }
    static async create(data) {
        const product = await ProductModel.create(data);
        console.log(`Product created succesfully (${product._id}) .`);
        return product;
    }

    static async updateById(pid, data) {
        await ProductModel.updateOne({ _id: pid },{ $set: data });
        console.log(`Product updated succesfully (${pid}) .`);
    }

    static async deleteById(pid) {
        const deletedProduct = await ProductModel.findById(pid);
        console.log(deletedProduct);
        //Delete IMGS from PUBLIC
        deletedProduct.thumbnails.forEach((thumbnail) => {
            const filePath = path.join(__dirname, `../public/${thumbnail}`);
            fs.unlinkSync(filePath);
        });
        //await ProductModel.deleteOne({ _id: pid });
        console.log(`Product Deleted succesfully (${pid}) .`);
    }
};