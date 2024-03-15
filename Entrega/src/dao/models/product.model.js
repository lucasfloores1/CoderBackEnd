import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const ProductSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    code: { type: String, required: true },
    stock: { type: Number, required: true },
    thumbnails: { type: Array, required: true },
    type: { type: Array, required: true },
    owner : { type : mongoose.Schema.Types.ObjectId, ref : 'User', default : null },
    isAdmin: { type: Boolean, default: false }
},{ timestamps : true });

ProductSchema.pre('findOne', function (){
    this.populate('owner')
});

ProductSchema.plugin(mongoosePaginate);

export default mongoose.model('Product', ProductSchema);