const Order= require("../../Models/order");
const moment = require("moment");

async function orderController(){
    return{
        store(req,res){
            //console.log(req.body);
            const {phone,address}= req.body;
            if(!phone||!address){
                req.flash("err","All Field are required");
                return res.redirect("/cart");
            }
            //console.log(1);
            const order= new Order({
                customerId:req.user._id,
                items:req.session.cart.item,
                phone:phone,
                address:address
            });

            order.save().then(()=>{
                return res.json({"message":"Order placed successfully"})
            }).catch(err=>{
                console.log(err);
            });
        },
        async index(req,res){
            const orders= await Order.find({customerId:req.user._id},null,{sort:{"createdAt":-1}});
            req.session.cart={
                item:{},
                totalQuantity:0,
                totalPrice:0
            }
            res.render("customers/order",{data:orders, moment:moment});
        },
        async admin(req,res){
           Order.find({status:{$ne:"completed"}},null,{sort:{"createdAt":-1}}).populate("customerId","-password").then(orders=>{
            if(req.xhr){
                return res.json(orders);
            }
            //console.log(1);
            return res.render("admin/orders");
           }).catch(err=>{
            console.log(err);
           }); 
        },
        async adminStatus(req,res){
           // console.log(req.body);
            await Order.findOneAndUpdate({_id:req.body.orderId},{status:req.body.status});
            const evenEmitter= req.app.get('eventEmitter');
            evenEmitter.emit('orderUpdated',{id: req.body.orderId,status:req.body.status});
            res.redirect("/admin/order");
        },
        async singleClientOrder(req,res){
            const order= await Order.findById(req.params.id);
            if(req.user._id.toString()===order.customerId.toString()){
              return   res.render("customers/singleorders",{order:order});
            }
            return res.redirect("/");
        }
    }
}

module.exports= orderController;