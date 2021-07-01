const dotenv = require('dotenv');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const app = express();

let rootPath = path.join(__dirname, '../');

// dotenv
dotenv.config({ path: path.join(rootPath, '.env')})

// view engine 
app.set('view engine', 'hbs');
app.set('views', rootPath + 'templates');


//parse url enceded bodies (as sent by HTML forms)
app.use(express.urlencoded({extended: false}));

//parse JSON bodies (as send by API clients)
app.use(express.json());

app.use(cookieParser());

// use routes page
app.use('/', require(path.join(rootPath, '/routes/pages')));
app.use('/auth', require(path.join(rootPath, '/routes/auth')));
app.use('/new', require(path.join(rootPath, '/routes/database')));
// app.use('/user', require(path.join(rootPath, '/routes/userProfile')));




app.use(express.static(path.join(rootPath, 'public')));

app.listen(8000, ()=> {
    console.log('8000 port is listening');
})