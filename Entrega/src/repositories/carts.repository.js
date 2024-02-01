import CartDTO from "../dto/cart.dto.js";
import { usersRepository } from "./index.js";

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

    async addProductToCart(cid, pid) {
        try {
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

    async updateQuantityOfProdcut ( cid, pid, quantity ){
        try {
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