import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    user: { type: String, },
    message: { type: String }
},{ timestamps : true });

export default mongoose.model('Message', MessageSchema);