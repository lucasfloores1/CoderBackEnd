import mongoose from "mongoose";

const UserDocumentSchema = new mongoose.Schema({
    name : { type : String },
    reference : { type : String }
}, { _id : false , timestamps : false })

const UserSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    age: {type: Number, required: true},
    password: { type: String, required: true },
    role: { type: String, default : 'user'},
    cart: { type: mongoose.Schema.Types.ObjectId, ref : 'Cart', required : false },
    documents : { type : [UserDocumentSchema], default : [] },
    last_connection : { type: Date, default : Date.now() }
},{ timestamps : true });

UserSchema.pre('findOne', function(){
    this.populate('cart');
});

export default mongoose.model('User', UserSchema);