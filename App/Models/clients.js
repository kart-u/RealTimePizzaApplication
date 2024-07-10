const mongoose=require("mongoose");

const schema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default:"client",
        required:true
    }
}
);

const users =mongoose.model("user",schema);

module.exports=users;