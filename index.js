const express = require('express')
const app = express()
const boyParser = require('body-parser')
const mysql = require('mysql')
const path = require('path')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('cookie-session')


app.use(bodyParser.urlencoded({
    extended: true
}))


app.set('views', path.join('views'));
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(express.json());


app.use(session({
    cookie: {
        secure: true,
        maxAge: 21600000

    },
    secret: 'user_sid',
    resave: true,
    saveUninitialized: true,

}))


let dbConnect = mysql.createConnection({
    host:"localhost",
    port:3306,
    user:"root",
    database:"kaiyanamiadmin",
})


dbConnect.connect((err) =>{
    if(err) throw err;

    console.log("Database connected");
})




app.get('/', (req,res) =>{

    if(req.cookies.user_id) {
        res.render('Home')
    }

    else{ 
        res.render('login', {session:req.cookies.user_id})

    }

})


app.post('/login', (req,res, next) =>{
    let username = req.body.username;
    let password = req.body.password;

    if(username && password == "senpai") {
        res.cookie("user_id", username)
        res.redirect('/')
    }

    else{
        res.send("Username or password incorrect")
    }
})


app.get('/Orders', (req,res) =>{

    if(req.cookies.user_id) {
        let sql = `select * from orders`;
        dbConnect.query(sql, (err,rows) =>{

        res.render('Orders', {Orders:rows})
        })

    }
    else{
        res.redirect('/')
    }
})

app.get('/addOrder', (req,res) =>{

    if(req.cookies.user_id) {
       dbConnect.query("select * from colors",(err,colors) =>{
       
        dbConnect.query("select * from products", (err, products) =>{
            res.render('AddOrder', {Colors:colors, Products:products})
        })
    
       })

    }
    else{
        res.redirect('/')
    }
    
    
})

app.get('/products', (req,res) =>{

    if(req.cookies.user_id) {
        dbConnect.query('select * from products',(err,rows) =>{
            res.render('Product', {products:rows})
        })

    }
    else{
        res.redirect('/')
    }
})

app.get('/addProduct', (req,res) =>{
    if(req.cookies.user_id) {
        dbConnect.query("select * from category",(err,rows) =>{
            res.render('addProduct',{category:rows})

        })

        

    }else{
        res.redirect('/')
    }

})

app.post('/addProduct',(req,res) =>{
   
    let sql = ``
})

app.get('/logout', (req, res, next) => {

    // req.session.destroy();

    let cookie = req.cookies;
    for (var prop in cookie) {
        if (!cookie.hasOwnProperty(prop)) {
            continue;
        }
        res.cookie(prop, '', {
            expires: new Date(0)
        });
    }
    res.redirect('/');
})


app.listen(3000, () =>{
    console.log("Server running")
})
