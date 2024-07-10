const users = require("../../Models/clients");
const bcrypt = require("bcrypt");
const passport = require("passport");

async function authController(){
    return{
        login(req,res){
            if(req.user){
                return res.redirect("/");
            }
            res.render("Auth/login.ejs");
        },
        postLogin(req,res,next){//here next is required for passport 
            console.log(200);
            passport.authenticate("local",(err,user,info)=>{//this is previous done function
                if(err){
                    req.flash("err",info.message);
                    return next(err);
                }
                if(!user){
                    req.flash("err",info.message);
                    return res.redirect("/login");
                }
                req.logIn(user,(err)=>{
                    if(err){
                        console.log("here");
                        req.flash("err",info.message);
                        return next(err);
                    }
                    else{
                        return res.redirect("/");
                    }
                });

            })(req,res,next);

        },
        logout(req,res){
            //console.log(1);
            req.logout(()=>{
                res.redirect("/login");
            });//as login is strored in session cookies which will be passed by browser with every req
            //we just simply delete those cookies with this logout method
            //as this is a asynchronous function now we need to give it callback
            
        },
        register(req,res){
            if(req.user){
                return res.redirect("/");
            }
            res.render("Auth/register.ejs");
        },
        postRegister(req,res){
            let formData =req.body;
            users.findOne({email:formData.email})
            .then((user)=>{
                //console.log(user);
                if(user){
                    //console.log("exist");
                    req.flash("err","A account already exist with this email");
                    return res.redirect("/register");
                }
                else{
                    //hashing password
                    (async ()=>{
                    const hash=await bcrypt.hash(formData.password,10);
                    const data= new users({
                        name:formData.name,
                        email:formData.email,
                        password:hash
                    });
                    data.save();
                    //console.log("saved");
                    return res.redirect("/");
                    })();
                }
            });
        }
    }
    }
    
    module.exports=authController;