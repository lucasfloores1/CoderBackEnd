import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    age: {type: Number, required: true},
    password: { type: String, required: true },
    role: { type: String, default : 'user'},
    cart: { type: mongoose.Schema.Types.ObjectId, ref : 'Cart' }
},{ timestamps : true });

UserSchema.pre('findOne', function(){
    this.populate('cart.cart');
});

export default mongoose.model('User', UserSchema);