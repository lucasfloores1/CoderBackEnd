import ticketModel from "./models/ticket.model.js";

export default class TicketDaoMongoDB {
    static getAll(criteria = {}) {
        return ticketModel.find(criteria);
    }

    static getById(tid) {
        return ticketModel.findOne({ _id : tid });
    }

    static create(data) {
        return ticketModel.create(data);
    }

    static updateById(tid, data) {
        return ticketModel.updateOne({ _id : tid }, { $set : data });
    }

    static deleteById(tid) {
        return ticketModel.deleteOne({ _id: tid });
    }
}