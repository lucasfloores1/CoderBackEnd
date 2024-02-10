import UserDTO from "./user.dto.js";

export default class ProductDTO {
    constructor(product) {
        this.id = product._id;
        this.title = product.title;
        this.description = product.description;
        this.price = product.price;
        this.code = product.code;
        this.stock = product.stock;
        this.thumbnails = product.thumbnails;
        this.type = product.type;
        this.owner = product.owner ? new ProductUserDTO(product.owner) : { id : 'admin' };
    }
}

class ProductUserDTO {
    constructor(user){
        this.id = user._id;
        this.email = user.email;
        this.role = user.role;
    }
}