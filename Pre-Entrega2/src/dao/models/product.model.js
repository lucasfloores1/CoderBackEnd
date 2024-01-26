import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const ProductSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    code: { type: String, required: true },
    stock: { type: Number, required: true },
    thumbnails: { type: Array, required: true },
    type: { type: Array, required: true }
},{ timestamps : true });

ProductSchema.plugin(mongoosePaginate);

export default mongoose.model('Product', ProductSchema);