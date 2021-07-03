const express = require('express');
const authUser = require('../controllers/authUser');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');


const app = express();
const router = express.Router();


const defalultAuthUserObject = {
    signinAndProfile: 'SIGN-IN',
    signupAndSignout: 'Sign-Up',
    linkSigninAndProfile: '/login',
    linkSignupAndSignout: '/signup',
}


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



router.get('/',authUser('index',null,defalultAuthUserObject), (req, res) => {
    db.query('SELECT * FROM userinfo WHERE userId = ?',[verifyUserInfo(req, res)], (error, results) => {
        if(error) {
            res.send('Something Went Wrong!....')
        }
        else {
            res.render('index', {
                linkSigninAndProfile: '/profile',
                linkSignupAndSignout: '/signout',
                signinAndProfile: results[0].name,
                signupAndSignout: 'Sign-Out'
            });
        }
    });
});


router.get('/home',authUser('index',null,defalultAuthUserObject), (req, res) => {
    db.query('SELECT * FROM userinfo WHERE userId = ?',[verifyUserInfo(req, res)], (error, results) => {
        if(error) {
            res.send('Something Went Wrong!....')
        }
        else {
            res.render('index', {
                linkSigninAndProfile: '/profile',
                linkSignupAndSignout: '/signout',
                signinAndProfile: results[0].name,
                signupAndSignout: 'Sign-Out'
            });
        }
    });
});


router.get('/login',authUser('login',null,defalultAuthUserObject), (req, res) => {
    res.redirect('/feed');
});


router.get('/signup',authUser('signup',null,defalultAuthUserObject), (req, res) => {
    res.redirect('/feed');
});


router.get('/signout',authUser('login','/login',defalultAuthUserObject), (req, res) => {
    try {
        res.clearCookie('jwt');
        console.log("Successfully Logout");
    } 
    catch (error) {
        res.status(500).send(error);
    }
    res.redirect('/login');
});


router.get('/about', (req, res) => {
    res.send("Welcome to About Pages!....");
});


router.get('/database', (req, res) => { 
    res.render('database');
});


router.get('/feed',authUser('index','/home'), (req, res) => {
    db.query('SELECT * FROM userinfo WHERE userId = ?',[verifyUserInfo(req, res)], (error, results) => {
        if(error) {
            res.send('Something Went Wrong!....');
        }
        else {
            res.render('feed', {
                linkSigninAndProfile: '/profile',
                linkSignupAndSignout: '/signout',
                signinAndProfile: results[0].name,
                signupAndSignout: 'Sign-Out',
                userName: results[0].name
            });
        }
    });
});


router.get('/profile',authUser('login','/login'), (req, res) => {
    db.query('SELECT * FROM userinfo WHERE userId = ?',[verifyUserInfo(req, res)], (error, results) => {
        if(error) {
            res.send('Something Went Wrong!....')
        }
        else {
            router.get('/profile/user/' + results[0].userId, authUser('login','/login'), (req,res) => {

                let d = new Date(results[0].DOB);

                const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

                let month = d.getMonth();
                let year = d.getFullYear();
                let date = d.getDate();

                let dateOfBirth = date + " " + months[month] + " " + year;



                res.render('profile', {
                    userName: results[0].name,
                    userEmail: results[0].email,
                    userPhone: results[0].mobile,
                    userDOB: dateOfBirth,
                    userGender: results[0].gender,
                    userEducation: results[0].education,
                    userInstitution: results[0].institution,
                    userSkills: results[0].skills,
                    userAddress: results[0].address,
                    userCountry: results[0].country,
                    userBio: results[0].briefIntro,
                    signinAndProfile: results[0].userId,
                    signupAndSignout: 'Sign-Up',
                    linkSigninAndProfile: '/profile',
                    linkSignupAndSignout: '/signout',
                })
            });

            res.redirect('/profile/user/'+ results[0].userId,);
        }
    });
});


module.exports = router;