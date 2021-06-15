const express = require('express');
const mongoose = require('mongoose');
const router = require("./Router/authRouter.js");
const app = express();
const cookie = require("cookie-parser");
const cors = require("cors");
const { requireAuth, checkUser } = require("./middlewares/authmiddleware.js");


// middleware
app.use(express.static('/public'));

// view engine
app.set('view engine', 'ejs');
app.use(express.json());
app.use(cors());
app.use(cookie());

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,Accept");

//     next();
// })

// database connection
const dbURI =
     'mongodb://127.0.0.1:27017/jwt-Course'
    
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then((result) => app.listen(3000, () => {
        console.log("server is up")
    }))
    .catch((err) => console.log(err));

// routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => { res.render('smoothies') });
app.use(router);
