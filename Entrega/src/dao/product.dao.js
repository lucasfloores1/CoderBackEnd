import productModel from "./models/product.model.js";

export default class ProductDaoMongoDB {
    static getAll(criteria = {}) {
        return productModel.find(criteria);
    }

    static getById(pid) {
        return productModel.findById(pid);
    }

    static getPaginatedProducts(criteria, options) {
        return productModel.paginate(criteria, options)
    }

    static create(data) {
        return productModel.create(data);
    }

    static updateById(pid, data) {
        return productModel.updateOne({ _id : pid }, { $set : data });
    }

    static deleteById(pid) {
        return productModel.deleteOne({ _id: pid });
    }
}