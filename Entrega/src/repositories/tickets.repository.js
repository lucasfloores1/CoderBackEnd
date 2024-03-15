import TicketDTO from "../dto/ticket.dto.js";
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
        if (ticket) {
            ticket = new TicketDTO(ticket);
        }
        return ticket;
    }

    async create(cid, email) {
        // Get Cart and User
        const cart = await cartsRepository.getById(cid);
        const user = await usersRepository.getByEmail(email);
        // Validate Stocks
        let data = {
            amount : 0,
            purchaser : user._id,
            code : createTicketCode,
        }
        await Promise.all(cart.products.map(async (product) => {
            const DBproduct = await productsRepository.getById(product.product.id)    
            if (DBproduct.stock >= product.quantity) {
                const updatedStock = DBproduct.stock - product.quantity
                await productsRepository.updateById(product.product.id, { stock : updatedStock })
                data.amount += product.product.price
            } else {
                throw new Error(`Insufficient Stock of ${product.product.title}`)
            }
            // Proceso de compra
        }));
        const newTicket = await this.dao.create(data);
        const ticket = await this.dao.getById(newTicket._id);
        return new TicketDTO(ticket);
    }

    async updateById(tid, data) {
        const ticket = this.dao.updateById(tid, data);
        return new TicketDTO(ticket);
    }

    async deleteById(tid) {
        return this.dao.deleteById(tid);
    }
}