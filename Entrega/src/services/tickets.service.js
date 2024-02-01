import { ticketsRepository } from "../repositories/index.js";

export default class TicketsService {
    static getAll (filter = {}) {
        return ticketsRepository.getAll(filter);
    }

    static create(cid, email) {
        return ticketsRepository.create(cid, email);
    }

    static getById(tid) {
        return ticketsRepository.getById(tid);
    }

    static updateById(tid, data) {
        return ticketsRepository.updateById(tid, data);
    }

    static deleteById(tid) {
        return ticketsRepository.deleteById(tid);
    }
}