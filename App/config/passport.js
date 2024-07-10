const Localpassport = require("passport-local").Strategy;
const users = require("../Models/clients");
const bcrypt= require("bcrypt");
//configuring passport with local strategy

async function init(passport){
    //console.log(await users.find());
    passport.use(new Localpassport({usernameField:"email"}, async (email, password, done)=>{
                const user=await users.findOne({email:email});
                //console.log(user);
                if(!user){
                    return done(null,false,{message:"No user found"});
                }
                bcrypt.compare(password,user.password).then(match=>{
                    if(match){
                        return done(null,user,{message:"Logged in successfuly"});
                    }
                    return done(null,false,{message:"wrong password or user"});
                }).catch(err=>{
                        return done(err,false,{message:"Something went wrong"});
                })
            }
    ));
    //basic checking wheter given data is valid or not
    passport.serializeUser((user,done)=>{
         done(null,user._id);
    });//placing what to store in session after login
    passport.deserializeUser((id,done)=>{
        users.findById(id)
        .then(user => {
            done(null, user); // Pass the user object to done
        })
        .catch(err => {
            done(err, false); // Pass any errors to done
        });
    });//how to get stored data in session
};

module.exports = init;
