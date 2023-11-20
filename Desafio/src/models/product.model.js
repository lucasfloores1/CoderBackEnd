import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: String, required: true },
    code: { type: String, required: true },
    stock: { type: String, required: true },
    thumbnails: { type: Array, required: true },
},{ timestamps : true });

export default mongoose.model('Product', ProductSchema);