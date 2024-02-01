import ProductsService from "../services/products.service.js";

export default class ProductsManager {
    static async get() {
        return ProductsService.getAll();
    }

    static async getById(pid) {
        const product = await ProductsService.getById(pid);
        return product;
    }

    static async getPaginatedProducts( criteria, options ) {
        const result = ProductsService.getPaginatedProducts(criteria, options);
        return result;
    }


    static async create(product) {  
        const newProduct = await ProductsService.create(product);
        return newProduct;
    }

    static async updateById(pid, data) {
        const updatedProduct = await ProductsService.updateById(pid, data);
        return updatedProduct;
    }

    static async deleteById(pid) {
        await ProductsService.deleteById(pid);
    }
};