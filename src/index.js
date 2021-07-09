const dotenv = require('dotenv');
const express = require('express'); 
const fileUpload = require('express-fileupload');
const path = require('path');
const cookieParser = require('cookie-parser');
const hbs= require('hbs');
const authUser = require('../controllers/authUser');




const app = express();


let rootPath = path.join(__dirname, '../');


// dotenv
dotenv.config({ path: path.join(rootPath, '.env')});


const db = require('../database/db');
const verifyUserInfo = require('../database/verifyUserInfo');
const loginInfo = require('../database/loginInfo');


// view engine 
app.set('view engine', 'hbs');
app.set('views', rootPath + 'templates');
hbs.registerPartials(rootPath + 'templates\\partials')


//parse url enceded bodies (as sent by HTML forms)
app.use(express.urlencoded({extended: false}));


//parse JSON bodies (as send by API clients)
app.use(express.json());


// set cookie to the browser
app.use(cookieParser());


// use routes page
app.use(fileUpload());
app.use('/', require(path.join(rootPath, '/routes/pages')));
app.use('/auth', require(path.join(rootPath, '/routes/auth'))); 
app.use('/new', require(path.join(rootPath, '/routes/database')));
app.use('/jobs', require(path.join(rootPath, '/routes/jobs')));


app.use(express.static(path.join(rootPath, 'public')));


app.get('*',authUser('404'),(req,res) => {
    db.query('SELECT * FROM userinfo WHERE userId = ?',[verifyUserInfo(req, res)], (error, results) => {
        if(error) {
            res.send('Something Went Wrong!....')
        }
        else {
            res.render('404', {
                login: loginInfo(results)
            });
        }
    });
})


app.listen(8000, ()=> {
    console.log('8000 port is listening');
})