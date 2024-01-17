import CartDao from '../dao/cart.dao.js'

export default class CartsService {
    static getAll (filter = {}) {
        return CartDao.getAll(filter);
    }

    static create(data) {
        return CartDao.create(data);
    }

    static async getById(cid) {
        const result = await CartDao.getAll({ _id : cid });
        return result[0];
    }

    static updateById(cid, data) {
        return CartDao.updateById(cid, data);
    }

    static deleteById(cid) {
        return CartDao.deleteById(cid);
    }
}