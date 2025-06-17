const express = require('express');
const connectDB = require('./DB/connection');
const app = express()
require('dotenv').config();

connectDB();





app.listen(process.env.PORT, ()=>{
    console.log(`Server is Running [${process.env.PORT}]`);
})