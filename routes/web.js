const homeController=require("../App/Http/controllers/home");
const authController = require("../App/Http/controllers/auth");
const orderController = require("../App/Http/controllers/order");
const guest = require("../App/Http/middleware/guest");
const admin = require("../App/Http/middleware/admin");

async function initroute(app){
    app.get("/",(await homeController()).index); 
    
    app.get("/cart",guest,(await homeController()).cart);
    app.post("/cart/add",guest,(await homeController()).cart_add);

    app.post("/order",guest,(await orderController()).store);
    app.get("/customers/order",guest,(await orderController()).index);
    app.get("/customers/order/:id",guest,(await orderController()).singleClientOrder);

    app.get("/admin/order",admin,(await orderController()).admin);
    app.post("/admin/order/status",admin,(await orderController()).adminStatus);
    
    app.get("/login",(await authController()).login);
    app.post("/login",(await authController()).postLogin);
    app.get("/logout",guest,(await authController()).logout);//as we dont want to be redirected to link thus we need post request
    
    app.get("/register",(await authController()).register);
    app.post("/register",(await authController()).postRegister);
}

module.exports=initroute;