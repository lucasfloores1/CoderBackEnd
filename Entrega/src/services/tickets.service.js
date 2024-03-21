import { ticketsRepository } from "../repositories/index.js";

export default class TicketsService {
    static getAll (filter = {}) {
        return ticketsRepository.getAll(filter);
    }

    static create(data) {
        return ticketsRepository.create(data);
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