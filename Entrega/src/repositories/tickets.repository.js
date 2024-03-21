import TicketDTO from "../dto/ticket.dto.js";
import { NotFoundException } from "../utils/exception.js";
import { createTicketCode } from "../utils/utils.js";
import { productsRepository, cartsRepository, usersRepository } from "./index.js";

export default class TicketRepository {

    constructor(dao) {
        this.dao = dao;
    }

    async getAll (filter = {}, opts = {}){
        const tickets = await this.dao.get(filter, opts);
        return tickets.map( ticket => new TicketDTO(ticket) );
    }

    async getById(tid) {
        let ticket = await this.dao.getById(tid);
        if (!ticket) {
            throw new NotFoundException('The ticket does not exist');
        }
        return new TicketDTO(ticket);
    }

    async create(data) {
        const newTicket = await this.dao.create(data);
        return new TicketDTO(newTicket);
    }

    async updateById(tid, data) {
        const ticket = this.dao.updateById(tid, data);
        return new TicketDTO(ticket);
    }

    async deleteById(tid) {
        return this.dao.deleteById(tid);
    }
}