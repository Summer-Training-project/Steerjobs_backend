const express = require('express');
const authUser = require('../controllers/authUser');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');

const router = express.Router();

let userId = '';

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



router.get('/',authUser('index'), (req, res) => {
    res.redirect('/feed');
});
router.get('/home',authUser('index'), (req, res) => {
    res.redirect('/feed');
});
router.get('/login',authUser('login'), (req, res) => {
    res.redirect('/feed');
});
router.get('/signup',authUser('signup'), (req, res) => {
    res.redirect('/feed');
});
router.get('/about',authUser('about'), (req, res) => {
    res.redirect('/feed');
});
router.get('/database', (req, res) => {
    res.render('database');
});
router.get('/feed',authUser('index','/home'), (req, res) => {
    db.query('SELECT * FROM userinfo WHERE userId = ?',[verifyUserInfo(req, res)], (error, results) => {
        if(error) {
            res.send('Something Went Wrong!....')
        }
        else {
            userId = results[0].userId;
            res.render('feed', {
                name: results[0].name,
                userId: results[0].userId,
                email: results[0].email
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
            router.get('/' + results[0].userId, authUser('login','/login'), (req,res) => {
                res.render('profile', {
                    userId: results[0].userId,
                    name: results[0].name,
                    email: results[0].email
                })
            });

            res.redirect('/'+ results[0].userId,);
        }
    });
});



module.exports = router;