const express = require("express");
const passport=require("passport");

function guest(req,res,next){
    if(req.isAuthenticated()){
        return next();//simply pass next() if middleware is done with checking
    }
    res.redirect("/");
}

module.exports=guest