const express = require('express')
require('dotenv').config();
const app = express()
const Port = process.env.PORT
app.listen(Port,()=>{
    console.log(`The App is Listening at ${Port}`)
})
app.get('/',(req,res)=>{
    res.send("Hello Jee")
})
const dbConnect=require('./Config/database')
dbConnect()