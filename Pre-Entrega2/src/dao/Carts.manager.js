import CartModel from '../models/cart.model.js'

export default class CartsManager {
    static get() {
        return CartModel.find();
    }

    static async getById(cid){
        const cart = await CartModel.findById(cid);
        if (!cart) {
            throw new Error('Cart not found');
        }
        return cart;
    }

    static async create(){
        const data = {
            products : []
        };
        const cart = await CartModel.create(data);
        return cart;
    }

    static async addProductToCart(cid, pid) {
        try {
            const cart = await CartModel.findById(cid);
            const existingProduct = cart.products.find((product) => product._id === pid);
    
            if (!existingProduct) {
                cart.products.push({ _id: pid, quantity: 1 });
            } else {
                existingProduct.quantity++;
            }
            await cart.save();
            return cart;
        } catch (error) {
            console.error('There was an error while adding the product:', error);
            throw error;
        }
    }

    static async deleteProductFromCart( cid, pid ){
        try {
            const cart = await CartModel.findById(cid);
            const existingProductIndex = cart.products.findIndex((product) => product._id === pid);

            if (existingProductIndex === -1) {
                throw new Error('Product does not exist in this cart');
            } else {
                cart.products.splice(existingProductIndex, 1);
            }
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error('There was an error while deleting the product');
        }
    }

    static async deleteAllProductsFromCart( cid ){
        try {
            const cart = await CartModel.findById(cid);

            if (!cart){
                throw new Error('Cart does not exist');
            } else {
                cart.products = []
                await cart.save;
                return cart;
            }
        } catch (error) {
            throw new Error('There was an error while deleting the products');
        }
    }

    static async updateQuantityOfProdcut ( cid, pid, quantity ){
        try {
            const cart = await CartModel.findById(cid);
            const existingProduct = cart.products.find((product) => product._id === pid);
    
            if (!existingProduct) {
                throw new Error('Product does not exist in this cart');
            } else {
                existingProduct.quantity = quantity;
            }
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error('There was an error while updating the product');
        }
    }

    
}