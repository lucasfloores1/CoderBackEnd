import CartsService from '../services/carts.service.js';

export default class CartsManager {
    static async getAll(filter = {}) {
        const carts = await CartsService.getAll(filter);
        return carts
    }

    static async getById(cid){
        const cart = await CartsService.getById(cid);
        return cart;
    }

    static async create(){
        const cart = await CartsService.create();
        return cart;
    }

    static async addProductToCart(cid, pid) {
        const updatedCart = await CartsService.addProductToCart(cid, pid);
        return updatedCart;
    }

    static async deleteProductFromCart( cid, pid ){
        const updatedCart = await CartsService.deleteProductFromCart(cid, pid);
        return updatedCart;
    }

    static async deleteAllProductsFromCart( cid ){
        const updatedCart = await CartsService.deleteAllProductsFromCart(cid);
        return updatedCart;
    }

    static async updateQuantityOfProdcut ( cid, pid, quantity ){
        const updatedCart = await CartsService.updateQuantityOfProduct(cid, pid, quantity);
        return updatedCart;
    }
    
}