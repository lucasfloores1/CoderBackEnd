import { logger } from '../config/logger.js';
import CartDTO from '../dto/cart.dto.js';
import CartsService from '../services/carts.service.js';
import { NotFoundException, UnauthorizedException } from '../utils/exception.js';
import ProductsManager from './products.controller.js';
import UserController from './users.controller.js';

export default class CartController {
    
    static async getAll(filter = {}) {
        const carts = await CartsService.getAll(filter);
        return carts
    }

    static async getRawById(cid) {
        const cart = CartsService.getRawById(cid);
        return cart;
    }

    static async getById(cid){
        const cart = await CartsService.getById(cid);
        return cart;
    }

    static async create(){
        const data = {
            products : []
        }
        const cart = await CartsService.create(data);
        return cart;
    }

    static async addProductToCart(pid, uid) {
        const user = await UserController.getById(uid);
        const product = await ProductsManager.getById(pid);
        console.log(product);
        if (user._id === product.owner.id && user.role !== 'admin') {
            throw new UnauthorizedException('You cant add a product that you created')
        }
        const cart = await CartsService.getRawById(user.cart._id);
        const existingProduct = cart.products.find((product) => product.product._id.toString() === pid.toString());
        if (!existingProduct) {
            const newProduct = {
                product: pid,
                quantity: 1
            };
            cart.products.push(newProduct);
        } else {
            existingProduct.quantity++;
        }
        let total = 0;
        cart.products.map( (prod) => {
            if (!prod.product.code) {
                total += product.price * prod.quantity;
            } else {
                total += prod.product.price * prod.quantity;
            }
        });
        cart.total = total;
        await cart.save();
        const updatedCart = await CartsService.getById(user.cart._id);
        logger.debug(`User ${user.email} added the product ${product.title} to the cart ${user.cart._id}`)
        return updatedCart;
    }

    static async deleteProductFromCart( cid, pid ){

        const cart = await CartsService.getRawById(cid);
        const existingProductIndex = cart.products.findIndex( (product) => product.product._id.toString() === pid.toString() );

        if (existingProductIndex === -1) {
            throw new NotFoundException('Product does not exist in this cart')
        } else {
            cart.products.splice(existingProductIndex, 1);
        }

        await cart.save();
        return new CartDTO(cart);

    }

    static async deleteAllProductsFromCart( cid ){

        const cart = await CartsService.getRawById(cid);
        if (!cart){
            throw new NotFoundException('Cart does not exist');
        } else {
            cart.products = []
            cart.total = 0;
            await cart.save();
            return new CartDTO(cart);
        }

    }

    static async updateQuantityOfProdcut ( cid, pid, quantity, uid ){

        const user = await UserController.getById(uid);
        const product = await ProductsManager.getById(pid);
        if (user.id === product.owner) {
            throw new UnauthorizedException('You cant add a product that you created');
        }
        const cart = await CartsService.getRawById(cid);
        const existingProduct = cart.products.find( (product) => product.product._id.toString() === pid );
    
        if (!existingProduct) {
            throw new NotFoundException('Product does not exist in this cart');
        } else {
            existingProduct.quantity = quantity;
        }
        await cart.save();
        return new CartDTO(cart);

    }
    
}