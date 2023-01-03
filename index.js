const express = require('express')
const app = express()
const boyParser = require('body-parser')

app.set('views', path.join('views'));
app.set('view engine', 'ejs');
app.get('/', (req,res) =>{
   
})


app.listen(3000, () =>{
    console.log("Server running")
})
