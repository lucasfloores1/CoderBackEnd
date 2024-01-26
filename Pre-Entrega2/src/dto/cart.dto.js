import ProductDTO from "./product.dto.js";

export default class CartDTO {
    constructor(cart) {
        this.id = cart._id;
        this.products = cart.products.map( product => new ProductCardDTO(product) );
    }
}

class ProductCardDTO {
    constructor(product){
        this.product = new ProductDTO(product.product);
        this.quantity = product.quantity;
    }
}

