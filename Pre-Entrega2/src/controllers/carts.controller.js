import CartsService from '../services/carts.service.js';

export default class CartsManager {
    static get() {
        return CartsService.getAll();
    }

    static async getById(cid){
        try {
            const cart = await CartsService.getById(cid);
            return cart;
        } catch (error) {
            throw new Error('Cart not found');
        }
    }

    static async create(){
        const data = {
            products : []
        };
        const cart = await CartsService.create(data);
        return cart;
    }

    static async addProductToCart(cid, pid) {
        try {
            const cart = await CartsService.getById(cid);
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
            const updatedCart = await CartsService.getById(cid);
            return updatedCart;
        } catch (error) {
            console.error('There was an error while adding the product:', error);
            throw error;
        }
    }

    static async deleteProductFromCart( cid, pid ){
        try {
            const cart = await CartsService.getById(cid);
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
            const cart = await CartsService.getById(cid);

            if (!cart){
                throw new Error('Cart does not exist');
            } else {
                cart.products = []
                await cart.save();
                return cart;
            }
        } catch (error) {
            throw new Error('There was an error while deleting the products');
        }
    }

    static async updateQuantityOfProdcut ( cid, pid, quantity ){
        try {
            const cart = await CartsService.getById(cid);
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