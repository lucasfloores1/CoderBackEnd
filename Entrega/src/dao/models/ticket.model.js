import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema({
    code : { type : String, required : true },
    amount : { type : Number, required : true },
    purchaser : { type : mongoose.Schema.Types.ObjectId, ref : 'User' },
},{ timestamps : true });

TicketSchema.pre('findOne', function(){
    this.populate('purchaser');
});

export default mongoose.model('Ticket', TicketSchema)