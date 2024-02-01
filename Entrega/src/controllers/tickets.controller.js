import TicketsService from "../services/tickets.service.js";

export default class TicketManager {
    static async getAll (filter = {}) {
        const tickets = await TicketsService.getAll(filter);
        return tickets;
    }

    static async create(cid, email) {
        const ticket = TicketsService.create(cid, email);
        return ticket;
    }

    static getById(tid) {
        const ticket = TicketsService.getById(tid);
        return ticket;
    }

    static updateById(tid, data) {
        const ticket = TicketsService.updateById(tid, data);
        return ticket;
    }

    static deleteById(tid) {
        return TicketsService.deleteById(tid);
    }
}