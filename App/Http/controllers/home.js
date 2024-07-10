const menu = require("../../Models/menu");

async function homeController(){
const data= await menu.find();
return{
    index(req,res){
        if(!req.session.cart){
            
            if(!req.session.cart){
                req.session.cart={
                item:{},
                totalQuantity:0,
                totalPrice:0
                }
            }
        }
        res.render("home.ejs",{pizza:data,cart:req.session.cart}); 
    },
    cart(req,res){
        res.render("customers/cart.ejs",{cart:req.session.cart});
    },
    cart_add(req,res){
        
        let data=req.body;
        let cart=req.session.cart;
        let id=data._id;
        //console.log(req.session.cart);     
        if(!cart.item[id]){
            cart.item[id]={
                pizza:data,
                quantity:1
            }
        }
        else{
            //console.log("one");
            cart.item[id].quantity++;
        }
        cart.totalQuantity=cart.totalQuantity+1;
        cart.totalPrice+=data.price;
        req.session.cart=cart;
        
        res.json(cart);
    }
}
}
//better way
module.exports=homeController;