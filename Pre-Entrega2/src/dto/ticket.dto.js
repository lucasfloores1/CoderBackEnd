import UserDTO from "./user.dto.js";

export default class TicketDTO {
    constructor(ticket) {
        this.id = ticket._id;
        this.code = ticket.code;
        this.amount = ticket.amount;
        this.purchaser = ticket.purchaser;
        this.purchase_datetime = ticket.createdAt;
    }
}