import ProductDao from '../dao/product.dao.js'

export default class ProductsService {
    static getAll (filter = {}) {
        return ProductDao.getAll(filter);
    }

    static async getById(pid) {
        const result = await ProductDao.getAll({ _id : pid });
        return result[0];
    }

    static getPaginated( criteria, options ) {
        return ProductDao.getPagiantedProducts(criteria, options);
    }

    static create(data) {
        return ProductDao.create(data);
    }

    static updateById(pid, data) {
        return ProductDao.updateById(pid, data);
    }

    static deleteById(pid) {
        return ProductDao.deleteById(pid);
    }
}