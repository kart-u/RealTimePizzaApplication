const { Int32 } = require("mongodb");
const mongoose=require("mongoose");

const schema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    size:{
        type:String,
        required:true
    }
}
);

const menu =mongoose.model("menu",schema);

module.exports=menu;