class ProductManager {
    constructor(){
        this.products = [];
    }

    getProducts() {
        return this.products;
    }

    addProduct( code, title, description, price, thumbnail, stock ){
        let DuplicatedProduct = this.products.find( product => product.code === code );
        if ( DuplicatedProduct ){
            console.log('Product code already exist');
            return;
        }
        this.products.push({
            id: this.products.length + 1,
            code,
            title,
            description,
            price,
            thumbnail,
            stock,
        })
        console.log('Product added')
    }

    getProductById( id ){
        let product = this.products.find( product => product.id === id );
        if(!product){
            console.log('Not found');
            return;
        }
        return product;
    }
}