import path from 'path';
import { __dirname } from '../utils/utils.js';
import fs from 'fs';
import ProductDTO from '../dto/product.dto.js';
import EnumsError from '../utils/EnumsError.js';
import { CustomError } from '../utils/CustomError.js';
import { generatorProductError } from '../utils/CauseMessageError.js';

export default class ProductRepository {

    constructor (dao) {
        this.dao = dao;
    }

    async getAll(filter = {}) {
        const products = await this.dao.getAll(filter);
        return products.map( product => new ProductDTO(product) )
    }

    async getById(pid) {
        const product = await this.dao.getById(pid);
        if (!product) {
            throw new Error('Product not found');
        }
        return new ProductDTO(product);
    }
    async create(product) {
        //Validate code
        const products = await this.getAll();
        let duplicatedProduct = products.find( prod => prod.code === product.code );
        if ( duplicatedProduct ){
            throw new Error('Product code already exist');
        }       
        const newProduct = await this.dao.create(product);
        console.log(`Product created succesfully (${newProduct._id}) .`);
        return new ProductDTO(newProduct);
    }

    async updateById(pid, data) {
        const updatedProduct = await this.dao.updateById(pid, data);
        console.log(`Product updated succesfully (${pid}) .`);
        return new ProductDTO(updatedProduct);
    }

    async deleteById(pid) {
        try {
            const deletedProduct = await this.dao.getById(pid);
            //Delete IMGS from PUBLIC
            deletedProduct.thumbnails.forEach((thumbnail) => {
                const filePath = path.join(__dirname, `../public/${thumbnail}`);
                fs.unlinkSync(filePath);
            });
            //await ProductModel.deleteOne({ _id: pid });
            console.log(`Product Deleted succesfully (${pid}) .`);
            await this.dao.deleteById(pid);
        } catch (error) {
            throw new Error('There was an error while deleting the products');
        }
    }

    async getPaginatedProducts (criteria, options){
        try {
            const result = await this.dao.getPaginatedProducts(criteria, options);
            return result;
        } catch (error) {
            throw new Error('There was an error while getting the products');
        }
    }

}