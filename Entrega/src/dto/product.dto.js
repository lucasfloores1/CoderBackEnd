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
        this.owner = new ProductUserDTO(product.owner),
        this.isAdmin = product.isAdmin
    }
}

class ProductUserDTO {
    constructor(user){
        this.id = user._id;
        this.email = user.email;
        this.role = user.role;
    }
}