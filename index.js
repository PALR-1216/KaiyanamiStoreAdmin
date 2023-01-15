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
    host:"buhpgq3jgswjlmd10cnf-mysql.services.clever-cloud.com",
    port:3306,
    user:"u3sz15c6pq1bogtq",
    password:"b4XsJn4BerVXht9nodg8",
    database:"buhpgq3jgswjlmd10cnf",
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
            res.render('Product', {products:rows, screenWidth:0})
        })

    }
    else{
        res.redirect('/')
    }
})

app.get('/addProduct', (req,res) =>{
    if(req.cookies.user_id) {
        dbConnect.query("select * from Category",(err,rows) =>{
            // dbConnect.query('select * from colors',(err,colors) =>{
                res.render('addProduct',{category:rows})


            // })
        })

        

    }else{
        res.redirect('/')
    }

})

app.post('/addProduct',(req,res) =>{
   
   
    let sql = `insert into Products (Product_Name, Product_Image, Product_Price, Product_Category, Cost_Per_Product) values("${req.body.Product_Name}", "${req.body.Product_Image}" ,${req.body.Product_Price}, "${req.body.Category}", ${req.body.Price_per_Product})`
    dbConnect.commit(sql)
})


app.get('/EditProduct/:Name/:Price/:Color/:costToMake', (req,res) =>{
    if(req.cookies.user_id) {
    
            dbConnect.query('select * from colors',(err,colors) =>{
                res.render('EditProduct',{ Colors:colors, Name:req.params.Name, Price:req.params.Price, Cost:req.params.costToMake, Color:req.params.Color})

            })
    }else{
        res.redirect('/')
    }
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


//function so the server doesent go to sleep
setInterval(function () {
    dbConnect.query('SELECT 1');
}, 5000);


app.listen(3000, () =>{
    console.log("Server running")
})
