import { productsRepository } from "../repositories/index.js";

export default class ProductsService {
    static getAll (filter = {}) {
        return productsRepository.getAll(filter);
    }

    static getById(pid) {
        return productsRepository.getById(pid);
    }

    static getPaginatedProducts( criteria, options ) {
        return productsRepository.getPaginatedProducts(criteria, options);
    }

    static create(data) {
        return productsRepository.create(data);
    }

    static updateById(pid, data) {
        return productsRepository.updateById(pid, data);
    }

    static deleteById(pid) {
        return productsRepository.deleteById(pid);
    }
}