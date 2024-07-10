const mongoose=require("mongoose");
const users = require("./clients");

const schema= new mongoose.Schema({
    customerId:{
        type:mongoose.Schema.ObjectId,
        ref:users,
        required:true
    },
    items:{
        type:Object,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    payment:{
        type:String,
        default:"COD",
        required:true
    },
    status:{
        type:String,
        default:"Order_placed",
        required:true
    }
},{timestamps:true}
);

const Order =mongoose.model("order",schema);

module.exports=Order;