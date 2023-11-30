import mongoose from 'mongoose';

const ProductItemSchema = new mongoose.Schema({
  product : { type: mongoose.Schema.Types.ObjectId, ref : 'products' },
}, { _id: false });

const CartSchema = new mongoose.Schema(
  {
    products: { type: [ProductItemSchema], default: [] },
  },
  { timestamps: true }
);

CartSchema.pre('find', function(){
  this.populate('products.product');
});

export default mongoose.model('Cart', CartSchema);