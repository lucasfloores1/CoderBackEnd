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
                console.log('Agregando producto');
                cart.products.push({ _id: pid, quantity: 1 });
            } else {
                console.log('Incrementando cantidad');
                existingProduct.quantity++;
            }
    
            await cart.save(); // Asegúrate de esperar a que se complete la operación de guardar
    
            console.log(cart);
            return cart;
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error);
            throw error;
        }
    }
}