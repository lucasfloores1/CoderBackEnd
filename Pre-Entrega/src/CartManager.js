const fs = require('fs');
const { v4 : uuidV4 } = require('uuid');

class CartManager {

    constructor( path ){
        this.path = path;
    }

    async getCarts() {
        const carts = await getCartsFromFile(this.path);
        return carts;
    }

    async createCart (){
        //Read File
        const carts = await getCartsFromFile(this.path);
        //Create Cart
        const newCart = {
            id: uuidV4(),
            products : []
        }
        carts.push(newCart);
        //Write File
        await saveCartsInFile( this.path, carts );

        return newCart;
    }

    async getCartById( id ){
        //Read File
        const carts = await getCartsFromFile(this.path);
        //Validate
        let cart = carts.find( cart => cart.id === id );
        if(!cart){
            throw new Error('Cart does not exist');
        }
        return cart;
    }

    async addProductToCart( cid, pid ){
        //Read File
        const carts = await getCartsFromFile(this.path);
        //Find indexes
        const index = carts.findIndex( (cart) => cart.id === cid );
        const existingProductIndex = carts[index].products.findIndex( (product) => product.id === pid );
        if ( existingProductIndex === -1 ){
            const newProduct = {
                id : pid,
                quantity : 1
            };
            carts[index].products.push(newProduct);
        } else {
            carts[index].products[existingProductIndex].quantity += 1
        }
        //Save File
        await saveCartsInFile(this.path, carts);

        return carts[index];
    }

}

const getCartsFromFile = async (path) => {
    if (!fs.existsSync(path)){
        return [];
    }
    const content = await fs.promises.readFile( path, 'utf-8' ); 
    return JSON.parse(content);
}

const saveCartsInFile = async (path, data) => {
    const content = JSON.stringify( data, null, '\t' );
    return fs.promises.writeFile( path, content, 'utf-8' );
}

module.exports = CartManager;