import mongoose from 'mongoose';

const ProductItemSchema = new mongoose.Schema({
  product : { type: mongoose.Schema.Types.ObjectId, ref : 'Product' },
  quantity : { type: Number, default : 0 }
}, { _id: false });

const CartSchema = new mongoose.Schema(
  {
    products: { type: [ProductItemSchema], default: [] },
  },
  { timestamps: true }
);

CartSchema.pre('findOne', function(){
  this.populate('products.product');
});

export default mongoose.model('Cart', CartSchema);