const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({path: './.env'});

// starting the server 
const app = express();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});


const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

// telling node.js what view engine to use to show html
app.set('view engine', 'hbs');

db.connect((error) => {
    if(error){
        console.log(error)
    } else {
        console.log('mysql connected');
    }
})  

app.get('/', (req, res) => {
    // res.send('<h1>Home Page </h1>')
    res.render('index');
});

// telling express which port you want it to listen 
app.listen(5000, () => {
    console.log('server listening on Port 5000');
});