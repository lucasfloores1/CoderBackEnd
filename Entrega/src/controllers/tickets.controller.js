import TicketsService from "../services/tickets.service.js";
import CartController from "../controllers/carts.controller.js"
import UserController from "./users.controller.js";
import { createTicketCode } from "../utils/utils.js";
import ProductController from "./products.controller.js";
import { UnauthorizedException } from "../utils/exception.js";

export default class TicketController {
    
    static async getAll (filter = {}) {
        const tickets = await TicketsService.getAll(filter);
        return tickets;
    }

    static async create(cid, email) {
        // Get Cart and User
        const cart = await CartController.getById(cid);
        const user = await UserController.getByEmail(email);
        // Validate Stocks
        let data = {
            amount : 0,
            purchaser : user._id,
            code : createTicketCode,
        }
        await Promise.all(cart.products.map(async (product) => {
            const DBproduct = await ProductController.getById(product.product.id)    
            if (DBproduct.stock >= product.quantity) {
                const updatedStock = DBproduct.stock - product.quantity
                await ProductController.updateById(product.product.id, { stock : updatedStock })
                data.amount += product.product.price
            } else {
                throw new UnauthorizedException(`Insufficient Stock of ${product.product.title}`);
            }
        }));
        const ticket = await TicketsService.create(data);
        await CartController.deleteAllProductsFromCart(cart.id);
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