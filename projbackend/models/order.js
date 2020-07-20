const mongoose = require('mongoose');

const {ObjectId} = mongoose.Schema;

const ProductCartSchema = new mongoose.Schema({
  product:{
    type:ObjectId,
    ref:"Product"
  },
  name:String,
  count:Number,
  price:Number,

});

const OrderSchema = new mongoose.Schema({
  products: [ProductCartSchema],
  transaction_id:{},
  amount:{type:Number},
  address:{
    type:String,
    maxlength:2000
  },
  status:{
    type:String,
    default:"Received",
    enum:["Cancelled", "Delivered", "Shipped", "Processing","Received"]
  },
  updated:Date,
  user:{
    type:ObjectId,
    ref:"User"
    }
  },{timestamps:true}
);

const Order = mongoose.model("Order",OrderSchema);
const ProductCart = mongoose.model("ProductCard",ProductCartSchema);

module.exports = {Order,ProductCart};
