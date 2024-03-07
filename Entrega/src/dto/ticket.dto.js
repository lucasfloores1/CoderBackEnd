export default class TicketDTO {
    constructor(ticket) {
        this.id = ticket._id;
        this.code = ticket.code;
        this.amount = ticket.amount;
        this.purchaser = new TicketUserDTO(ticket.purchaser);
        this.purchase_datetime = ticket.createdAt;
    }
}

class TicketUserDTO {
    constructor(user){
        this.id = user._id;
        this.fullname = `${user.first_name} ${user.last_name}`;
        this.email = user.email;
    }
}