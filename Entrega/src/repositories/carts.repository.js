import CartDTO from "../dto/cart.dto.js";
import { productsRepository, usersRepository } from "./index.js";
import EnumsError from '../utils/EnumsError.js';
import { CustomError } from '../utils/CustomError.js';
import UsersService from "../services/users.service.js";
import UserDTO from "../dto/user.dto.js";

export default class CartRepository {
    constructor(dao) {
        this.dao = dao;
    }

    async getAll( filter = {} ) {
        const carts = await this.dao.getAll(filter);
        return carts.map( cart => new CartDTO(cart) );
    }

    async getById(cid){
        try {
            const cart = await this.dao.getById(cid);
            return new CartDTO(cart);
        } catch (error) {
            throw new Error('Cart not found');
        }
    }

    async create(){
        const data = {
            products : []
        };
        const cart = await this.dao.create(data);
        return cart;
    }

    async addProductToCart(cid, pid, uid) {
        try {
            console.log('parametros metodo', cid,pid,uid);
            const user = await UsersService.getById(uid);
            const product = await productsRepository.getById(pid);
            if (user._id = product.owner.id) {
                throw new Error('You cant add a product that you created')
            }
            const cart = await this.dao.getById(cid);
            const existingProduct = cart.products.find((product) => product.product._id.toString() === pid );  
            if (!existingProduct) {
                const newProduct = {
                    product: pid,
                    quantity: 1
                };
                cart.products.push(newProduct);
                console.log(cart);
            } else {
                existingProduct.quantity++;
            }
            await cart.save();
            const updatedCart = await this.dao.getById(cid);
            return new CartDTO(updatedCart);
        } catch (error) {
            console.error('There was an error while adding the product:', error);
            throw error;
        }
    }

    async deleteProductFromCart( cid, pid ){
        try {
            const cart = await this.dao.getById(cid);
            const existingProductIndex = cart.products.findIndex((product) => product._id === pid);

            if (existingProductIndex === -1) {
                throw new Error('Product does not exist in this cart');
            } else {
                cart.products.splice(existingProductIndex, 1);
            }
            await cart.save();
            return new CartDTO(cart);
        } catch (error) {
            throw new Error('There was an error while deleting the product');
        }
    }

    async deleteAllProductsFromCart( cid ){
        try {
            const cart = await this.dao.getById(cid);

            if (!cart){
                throw new Error('Cart does not exist');
            } else {
                cart.products = []
                await cart.save();
                return new CartDTO(cart);
            }
        } catch (error) {
            throw new Error('There was an error while deleting the products');
        }
    }

    async updateQuantityOfProdcut ( cid, pid, quantity, uid ){
        try {
            const user = await usersRepository.getById(uid);
            const product = await productsRepository.getById(pid);
            if (user.id === product.owner) {
                throw new Error('You cant add a product that you created')
            }
            const cart = await this.dao.getById(cid);
            const existingProduct = cart.products.find((product) => product._id === pid);
    
            if (!existingProduct) {
                throw new Error('Product does not exist in this cart');
            } else {
                existingProduct.quantity = quantity;
            }
            await cart.save();
            return new CartDTO(cart);
        } catch (error) {
            throw new Error('There was an error while updating the product');
        }
    }
}