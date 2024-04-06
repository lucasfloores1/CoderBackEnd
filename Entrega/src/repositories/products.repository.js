import ProductDTO from '../dto/product.dto.js';

export default class ProductRepository {

    constructor (dao) {
        this.dao = dao;
    }

    async getAll(filter = {}) {
        const products = await this.dao.getAll(filter);
        return products.map( product => new ProductDTO(product) )
    }

    async getById(pid) {
        const product = await this.dao.getById(pid);
        return new ProductDTO(product);
    }
    async create(product) {     
        const newProduct = await this.dao.create(product);
        return new ProductDTO(newProduct);
    }

    async updateById(pid, data) {
        await this.dao.updateById(pid, data);
        const updatedProduct = await this.dao.getById(pid);
        return new ProductDTO(updatedProduct);
    }

    async deleteById(pid) {
        return await this.dao.deleteById(pid);
    }

    async getPaginatedProducts (criteria, options){
        const result = await this.dao.getPaginatedProducts(criteria, options);
        //DTO Format
        for (let i = 0; i < result.docs.length; i++) {
            const product = new ProductDTO( result.docs[i] );
            result.docs[i] = product;
        }
        return result;
    }

}