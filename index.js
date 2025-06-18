const express = require('express');
const connectDB = require('./DB/connection');
const app = express()
require('dotenv').config();
const cors = require('cors');

connectDB();


app.use(express.json());
app.use(cors());
app.use("/api/",require('./Routes/userRoutes'));
app.use("/api/recruiter", require('./Routes/recruiterRoute'));
app.use("/api/jobs", require('./Routes/jobRoute'));


app.listen(process.env.PORT, ()=>{
    console.log(`Server is Running [${process.env.PORT}]`);
})