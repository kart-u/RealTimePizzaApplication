import toastr from "toastr";
import 'toastr/build/toastr.min.css';
const axios = require("axios");
import moment from 'moment'


//registration
let btn=document.querySelector("#sign-up");
btn?.addEventListener("click",(event)=>{
    let pass=document.querySelector("#password"),conf_pass=document.querySelector("#confirm-password");
    let ele=document.querySelector("#hidden");
    let name=document.querySelector("#name");
    let email=document.querySelector("#email");
    if(name.value===''){
        //console.log("yes");
        event.preventDefault();
        ele.innerHTML="Name required";
        ele.style.display="inline";
    }
    else if(email.value===''){
        event.preventDefault();
        ele.innerHTML="Email required";
        ele.style.display="inline";
    }
    else if(pass.value===''){
        event.preventDefault();
        ele.innerHTML="Password required";
        ele.style.display="inline";
    }
    else if(pass.value!=conf_pass.value){
        event.preventDefault();
        ele.innerHTML="Password do not match";
        ele.style.display="inline";
        console.log("Password do not match");
    }
    else{
        console.log("form submited");
    }
})



//Add to cart Mechanism
let items=document.querySelectorAll(".add-to-cart");
for(let i=0;i<items.length;i++){
    items[i]?.addEventListener("click",(e)=>{
        let data=items[i].getAttribute("data");
        fetch("/cart/add",{
            method:"POST",
            headers:{
                'Content-Type': 'application/json'
            },
            body:data
        }).then(res=>{return res.json()})//waiting for promised response to convert to json()
        .then(data=>{
            //console.log(data.totalQuantity);
            document.querySelector("#cart-items").innerHTML=data.totalQuantity;
            toastr.options = {
                closeButton: true,     
                progressBar: true,         
                positionClass: 'toast-bottom-right', 
                showMethod: 'slideDown',   
                hideMethod: 'slideUp',     
                timeOut: 1000,
                progressBar:false 
            }             
            toastr.success('Item added to cart', 'Success');
            
        })//this then will have return of above function a its paramiter
        .catch((err)=>{
        })

        
    });
}

let alert = document.querySelector("#success-alert");
if(alert){
    setTimeout(() => {
        alert.remove();
    }, 2000);
}

//admin
(function initAdmin(){
    //console.log(1);
    const orderTableBody = document.querySelector('#orderTableBody')
    let orders = []
    let markup

    axios.get('/admin/order', {
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        }
    }).then(res => {
        orders = res.data
        markup = generateMarkup(orders)
        orderTableBody.innerHTML = markup
    }).catch(err => {
        //console.log(2);
        console.log(err)
    })

    function renderItems(items) {
        let parsedItems = Object.values(items)//convert object to array
        return parsedItems.map((menuItem) => {//map this array to function
            return `
                <p>${menuItem.pizza.name} - ${menuItem.quantity} pcs </p>
            `
        }).join('')
    }

    function generateMarkup(orders){
        return orders.map(order => {
            return `
                <tr>
                <td class="border px-4 py-2 text-green-900">
                    <p>${order._id}</p>
                    <div>${renderItems(order.items)}</div>
                </td>
                <td class="border px-4 py-2">${order.customerId.name}</td>
                <td class="border px-4 py-2">${order.address}</td>
                <td class="border px-4 py-2">
                    <div class="inline-block relative w-64">
                        <form action="/admin/order/status" method="POST">
                            <input type="hidden" name="orderId" value="${order._id}">
                            <select name="status" onchange="this.form.submit()"
                                class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                                <option value="Order_placed"
                                    ${order.status === 'Order_placed' ? 'selected' : ''}>
                                    Placed</option>
                                <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>
                                    Confirmed</option>
                                <option value="prepared" ${order.status === 'prepared' ? 'selected' : ''}>
                                    Prepared</option>
                                <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>
                                    Delivered
                                </option>
                                <option value="completed" ${order.status === 'delivered' ? 'selected' : ''}>
                                    Completed
                                </option>
                            </select>
                        </form>
                        <div
                            class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20">
                                <path
                                    d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                </td>
                <td class="border px-4 py-2">
                    ${moment(order.createdAt).format('hh:mm A')}
                </td>
                <td class="border px-4 py-2">
                    ${order.paymentStatus ? 'paid' : 'Not paid'}
                </td>
            </tr>
        `
        }).join('')
    }
    // Socket
    // socket.on('orderPlaced', (order) => {
    //     new Noty({
    //         type: 'success',
    //         timeout: 1000,
    //         text: 'New order!',
    //         progressBar: false,
    //     }).show();
    //     orders.unshift(order)
    //     orderTableBody.innerHTML = ''
    //     orderTableBody.innerHTML = generateMarkup(orders)
    // })
})();

let order = document.querySelector("#order");
let value=order?order.value:null;
value=  JSON.parse(value);
let statusline=document.querySelectorAll(".statusline")
function updateStatus(){
    let stepcompleted=true;
    //console.log(value.status);
    statusline.forEach((status)=>{status.classList.remove("current");status.classList.remove("stepcompleted");});
    statusline.forEach((status)=>{
        //console.log(status.getAttribute("data"));
        if(value.status===status.getAttribute("data")){
            if(value.status!=="delivered"){
            stepcompleted=false;
            status.classList.add("current");
            }
        }
        if(stepcompleted===true){
            status.classList.add("stepcompleted");
        }

    });

}
updateStatus();

let socket=io();
//console.log(value._id);
if(order){
    socket.emit("join",`order_${value._id}`); //making unique room for each order
}

socket.on('orderUpdated',(data)=>{ //recieving emitted io with data
    const updateOrder=value;
    //console.log(1);
    updateOrder.status=data.status;
    updateStatus(updateOrder);
})




//payment

const form=document.querySelector("#payment");

form?.addEventListener("submit",(e)=>{
e.preventDefault();
const formData=new FormData(form);
const formObject={};
formData.forEach((value,key)=>{
    formObject[key]=value;
});
console.log(formObject);
axios.post('/order',formObject).then(res=>{
    toastr.options = {
        closeButton: true,     
        progressBar: true,         
        positionClass: 'toast-bottom-right', 
        showMethod: 'slideDown',   
        hideMethod: 'slideUp',     
        timeOut: 1000,
        progressBar:false 
    }             
    toastr.success(res.data.message, 'Success');
    setTimeout(()=>{
        window.location.href = "/customers/order";
    },1000)

}).catch(err=>{console.log(err)});
});