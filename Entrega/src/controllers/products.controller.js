import path from "path";
import { logger } from "../config/logger.js";
import EmailService from "../services/email.service.js";
import ProductsService from "../services/products.service.js";
import { emit } from "../socket.js";
import { InvalidDataException, NotFoundException, UnauthorizedException } from "../utils/exception.js";
import UserController from "./users.controller.js";
import fs from 'fs'
import { __dirname } from "../utils/utils.js";
import handlebars from "handlebars";

export default class ProductController {

    static async getAll() {
        return ProductsService.getAll();
    }

    static async getById(pid) {
        const product = await ProductsService.getById(pid);
        return product;
    }

    static async getPaginatedProducts( criteria, options ) {
        const result = ProductsService.getPaginatedProducts(criteria, options);
        return result;
    }


    static async create(product) {
        const products = await ProductsService.getAll();
        let duplicatedProduct = products.find( prod => prod.code === product.code );
        if ( duplicatedProduct ){
            throw new InvalidDataException('Product code already exist');
        } 
        const newProduct = await ProductsService.create(product);
        return newProduct;
    }

    static async updateById(pid, data) {
        const updatedProduct = await ProductsService.updateById(pid, data);
        return updatedProduct;
    }

    static async deleteById(pid, uid) {
        const user = await UserController.getById(uid);
        const deletedProduct = await ProductsService.getById(pid);   
        if (!deletedProduct) {
            throw new NotFoundException('Product not found');
        }
        if (user.role === 'premium') {
            if ( user._id.toString() !== deletedProduct.owner.id.toString() ) {
                throw new UnauthorizedException('You cannot delete a product that you did not create');
            }
            const emailService = EmailService.getInstance();
            const source = fs.readFileSync(path.join(__dirname, '../views/delete-product-email.handlebars'), 'utf8');
            const template = handlebars.compile(source);
            const html = template({ user, product : deletedProduct });
            await emailService.sendEmail(user.email, 'Link to restore your password', html);    
        }
        const defaultImgPath = '/img/products/default-product.jpg';
        //Delete IMGS from PUBLIC
        if (!deletedProduct.thumbnails.includes(defaultImgPath)) {
            deletedProduct.thumbnails.forEach((thumbnail) => {
                const filePath = path.join(__dirname, `../../public/${thumbnail}`);
                fs.unlinkSync(filePath);
            });
        }
        emit('productDeleted', deletedProduct.code);
        logger.debug(`User ${user.email} deleted the product: ${deletedProduct.title}`);
        await ProductsService.deleteById(pid);
    }
    
};