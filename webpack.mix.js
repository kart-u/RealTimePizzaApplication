let mix = require("laravel-mix");

//for compiling file from resource to public
//configuration

mix.js("resources/js/app.js","public/js/app.js").sass("resources/scss/app.scss","public/css/app.css");