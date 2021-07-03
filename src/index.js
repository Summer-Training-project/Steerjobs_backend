const dotenv = require('dotenv');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const hbs= require('hbs');
const authUser = require('../controllers/authUser');

const app = express();



let rootPath = path.join(__dirname, '../');

// dotenv
dotenv.config({ path: path.join(rootPath, '.env')})

// view engine 
app.set('view engine', 'hbs');
app.set('views', rootPath + 'templates');
hbs.registerPartials(rootPath + 'templates\\partials')


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

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

db.connect((err) => {
    if(err) {
        console.log("User DataBase Authentication is Disconected!.....");
    }
    else {
        console.log("User DataBase  Authentication is Conected!.....");
    }
});

const verifyUserInfo = (req, res) => {
    const tooken = req.cookies.jwt;
    const verifyUser = jwt.verify(tooken, process.env.JWT_SECRET);
    return verifyUser.tokenId;
}

const defalultAuthUserObject = {
    signinAndProfile: 'SIGN-IN',
    signupAndSignout: 'Sign-Up',
    linkSigninAndProfile: '/login',
    linkSignupAndSignout: '/signup'
}

// app.get('/profile/*',authUser('index','/home',defalultAuthUserObject),(req,res) => {
//     db.query('SELECT * FROM userinfo WHERE userId = ?',[verifyUserInfo(req, res)], (error, results) => {
//         if(error) {
//             res.send('Something Went Wrong!....')
//         }
//         else {
//             router.get('/profile/user/' + results[0].userId, authUser('login','/login'), (req,res) => {

//                 let d = new Date(results[0].DOB);

//                 const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

//                 let month = d.getMonth();
//                 let year = d.getFullYear();
//                 let date = d.getDate();

//                 let dateOfBirth = date + " " + months[month] + " " + year;



//                 res.render('profile', {
//                     userName: results[0].name,
//                     userEmail: results[0].email,
//                     userPhone: results[0].mobile,
//                     userDOB: dateOfBirth,
//                     userGender: results[0].gender,
//                     userEducation: results[0].education,
//                     userInstitution: results[0].institution,
//                     userSkills: results[0].skills,
//                     userAddress: results[0].address,
//                     userCountry: results[0].country,
//                     userBio: results[0].briefIntro,
//                     signinAndProfile: results[0].userId,
//                     signupAndSignout: 'Sign-Up',
//                     linkSigninAndProfile: '/profile',
//                     linkSignupAndSignout: '/signout',
//                 })
//             });

//             res.redirect('/profile/user/'+ results[0].userId,);
//         }
//     });
// })

app.get('*',authUser('404',null,defalultAuthUserObject),(req,res) => {
    db.query('SELECT * FROM userinfo WHERE userId = ?',[verifyUserInfo(req, res)], (error, results) => {
        if(error) {
            res.send('Something Went Wrong!....')
        }
        else {
            res.render('404', {
                linkSigninAndProfile: '/profile',
                linkSignupAndSignout: '/signout',
                signinAndProfile: results[0].name,
                signupAndSignout: 'Sign-Out'
            });
        }
    });
})






app.listen(8000, ()=> {
    console.log('8000 port is listening');
})