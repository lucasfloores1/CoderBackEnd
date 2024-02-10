import { cartsRepository } from "../repositories/index.js";

export default class CartsService {
    static getAll( filter = {} ) {
        return cartsRepository.getAll(filter);
    }

    static getById( cid ) {
        return cartsRepository.getById(cid);
    }

    static create() {
        return cartsRepository.create();
    }

    static addProductToCart(cid, pid, uid) {
        return cartsRepository.addProductToCart(cid, pid, uid);
    }

    static deleteProductFromCart( cid, pid ) {
        return cartsRepository.deleteAllProductsFromCart(cid, pid);
    }
    
    static deleteAllProductsFromCart( cid ) {
        return cartsRepository.deleteAllProductsFromCart( cid );
    }

    static updateQuantityOfProduct( cid, pid, quantity ){
        return cartsRepository.updateQuantityOfProdcut( cid, pid, quantity );
    }
}