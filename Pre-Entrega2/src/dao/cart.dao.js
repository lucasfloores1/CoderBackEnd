import cartModel from "./models/cart.model.js";

export default class CartDaoMongoDB {
    static getAll(criteria = {}) {
        return cartModel.find(criteria);
    }

    static getById(cid) {
        return cartModel.findById(cid);
    }

    static create(data) {
        return cartModel.create(data);
    }

    static updateById(cid, data) {
        return cartModel.updateOne({ _id : cid }, { $set : data });
    }

    static deleteById(cid) {
        return cartModel.deleteOne({ _id: cid });
    }
}