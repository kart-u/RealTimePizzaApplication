require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const path = require("path");
const expressEjsLayouts = require("express-ejs-layouts");
const session = require("express-session");//used to form session ans sessioncookies
const flash = require("express-flash");//used for flash message
const MongoStore = require("connect-mongo");//allows to store session in mongoDB
const mongoose = require("mongoose");
const passport = require("passport");
const emitter = require("events")
const PORT=process.env.PORT||3000;

//local routes
const initroute =require("./Routes/web.js");


mongoose.connect(process.env.MONGO_LINK).then(()=>{
    console.log("Connected to mongoose");
}
);
const app = express();


app.use(flash());
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static("public"))//location of all static files css and js required
app.set("views",path.join(__dirname+"/Resources/views"));//view from where and its path
app.set("view engine","ejs");//view engine
app.use(expressEjsLayouts);//allows us to use layouts in views

//session
app.use(session({
    secret:process.env.COOKIE_STRING,
    resave:false,//only save when change is done
    store: MongoStore.create({
        mongoUrl:process.env.MONGO_LINK,
        collectionName:"sessions"
    }),//where to store session strong session object inside mongostrore
    saveUninitialized:false,
    cookie:{maxAge:1000*60*60*24}//24 hrs session we made a objet inside session
}));//now session is beign passed as a req parameter

//passport configuration
const init= require("./App/config/passport.js");
init(passport);
app.use(passport.initialize());
app.use(passport.session());

//middleware for providing data to templates
app.use((req,res,next)=>{
    res.locals.session=req.session;
    res.locals.user=req.user;

    next();
});//this middleware allow data from req to be passed as local in res in template

const evenEmitter = new emitter();
app.set("eventEmitter",evenEmitter);//event emitter from server
//attaching eventemitter to req.app

initroute(app);//function to all the routes


const server=app.listen(PORT,()=>{
    console.log(`Connected to Server -${PORT}`);
});

//socket
const io = require("socket.io")(server);
io.on('connection',(socket)=>{
    //console.log(socket.id);
    socket.on("join",(orderId)=>{//here we join socket with orderID 
        //console.log(orderId);
        socket.join(orderId)//joining formed rooms
    })
});

evenEmitter.on('orderUpdated',(data)=>{//with emitter accessing emited event
    io.to(`order_${data.id}`).emit('orderUpdated',data);//emitting io with data
})