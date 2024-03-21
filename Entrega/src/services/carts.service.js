import { cartsRepository } from "../repositories/index.js";

export default class CartsService {
    static getAll( filter = {} ) {
        return cartsRepository.getAll(filter);
    }

    static getById( cid ) {
        return cartsRepository.getById(cid);
    }

    static create(data) {
        return cartsRepository.create(data);
    }

    static deleteById(cid) {
        return cartsRepository.deleteById(cid);
    }

    static getRawById(cid) {
        return cartsRepository.getRawById(cid);
    }
}