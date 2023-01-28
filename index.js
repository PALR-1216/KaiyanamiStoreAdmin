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


// let dbConnect = mysql.createConnection({
//     host:"buhpgq3jgswjlmd10cnf-mysql.services.clever-cloud.com",
//     port:3306,
//     user:"u3sz15c6pq1bogtq",
//     password:"b4XsJn4BerVXht9nodg8",
//     database:"buhpgq3jgswjlmd10cnf",
// })


let dbConnect = mysql.createConnection({
    host:"localhost",
    port:8889,
    user:"root",
    password:"root",
    database:"Kaiyanami",
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
       
        dbConnect.query("select * from products", (err, products) =>{
            res.render('AddOrder', { Products:products})
        })
    }
    else{
        res.redirect('/')
    }
    
    
})

app.post('/AddOrder',(req,res) =>{
    //TODO:add order to database here!!

    let name = req.body.Costumer_Name
    let phone =  req.body.Phone_Number || "None"
    let product = req.body.Product 
    let Size = req.body.Size
    let Color = req.body.Color
    let Discount = req.body.Discount || 0
    let payment = req.body.payment
    let DeliveryDate = req.body.Delivery_Date
    let SepcialRequest = req.body.Request || "None"
    

    // dbConnect.query(`select * from Products where product_Id = ${product}`, (err,rows) =>{
    // })


    let sql = `insert into Orders (Date_Added, Client_Name, Client_Phone_Number, Price_Of_Shirt, Color_Of_Shirt, Size_Of_Shirt, Product, Payment_Status, Discount, Date_Of_Delivery) `

})

app.get('/products', (req,res) =>{

    if(req.cookies.user_id) {

       
        dbConnect.query('select * from Products',(err,rows) =>{
            res.render('Product', {products:rows})
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
   
   
    let sql = `insert into Products (Product_Name, product_Image, product_Price, Product_Category, Cost_Per_Product) values("${req.body.Product_Name}", "${req.body.Product_Image}" ,${req.body.Product_Price}, "${req.body.Category}", ${req.body.Price_per_Product})`
    dbConnect.commit(sql)
    // dbConnect.query(sql,(err,rows) =>{
    //     if(err) { throw err}
    //     console.log(rows)
    // })
    res.redirect('/products')
})


app.get('/EditProduct/:ID', (req,res) =>{
    if(req.cookies.user_id) {


        let sql =  `select * from Products where product_Id = ${req.params.ID}`

        dbConnect.query(sql,(err,rows) =>{
            // let Name = rows[0].Product_Name
            // let Product_Image = rows[0].Product_Image
            // let Product_Price = rows[0].Product_Price
            // let productCat = rows[0].Product_Category
            // let Cost_To_Make = rows[0].Cost_Per_Product

            let obj = {
                ID:rows[0].product_Id,
                Name: rows[0].Product_Name,
                Product_Image:rows[0].product_Image,
                productCat:rows[0].Product_Category,
                Price:rows[0].product_Price,
                Cost_To_Make:rows[0].Cost_Per_Product



            }
            //Render a view with the data of the database

            res.render('EditProduct',{  Name:obj.Name, Price:obj.Price, Cost:obj.Cost_To_Make, Image:obj.Product_Image, Cat:obj.productCat, ID:obj.ID})


        })
    


    }else{
        res.redirect('/')
    }
})


app.post('/UpdateProduct/:ID',(req,res) =>{

    let sql = `update Products set Product_Name = "${req.body.Product_Name}", product_Price = ${req.body.Product_Price}, Cost_Per_Product = ${req.body.Price_per_Product}, product_Image = "${req.body.Image}" where product_Id = ${req.params.ID}; `
    dbConnect.commit(sql)
    res.redirect('/products')



})




app.get("/DeleteRow/:ID", (req,res) =>{
    let sql =  `delete from Products where product_Id = ${req.params.ID}`
    dbConnect.commit(sql)
    res.redirect('/products')
})



app.post("/AddOrder",(req,res) =>{
    let obj = {
        Name:req.body.Costumer_Name,
        Phone:req.body.Phone_Number || "NONE",
        Product_Id:req.body.Product,
        Size:req.body.Size,



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
