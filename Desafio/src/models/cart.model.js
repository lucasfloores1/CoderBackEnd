import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  quantity: { type: Number, default: 0 },
}, { id: false });

const CartSchema = new mongoose.Schema(
  {
    products: { type: [ProductSchema] },
  },
  { timestamps: true }
);

export default mongoose.model('Cart', CartSchema);