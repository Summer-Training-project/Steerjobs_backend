const mysql = require('mysql');
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const app = express();

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

db.connect((err) => {
    if(err) {
        console.log("DataBase is Disconected!.....");
    }
    else {
        console.log("DataBase is Conected!.....");
    }
})

function generateAuthToken(tokenId) {
    // console.log(`userId inside the gengeateAuthToken ${tokenId}`);
    const token = jwt.sign({ tokenId: tokenId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
    console.log("The token is: " + token);
    return token;
}

exports.login = async(req, res) => {
    try {
        const { userId, password } = req.body;
        db.query('SELECT * FROM userInfo WHERE userId = ?',[userId], async (error, results) => {
            if(!results[0] || !(await bcrypt.compare(password, results[0].password))) {
                res.status(401).render('login', {
                    messageInfo: 'UserId or Password is incorrect'
                })
            }
            else {
                // console.log(`the userId inside the login module ${results[0].userId}`);
                let token = generateAuthToken(results[0].userId);

                const cookieOption = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }
            
                res.cookie('jwt', token, cookieOption);
                res.status(200).redirect('/feed');
            }
        })
        console.log(req.body);
    }
    catch(error) {
        res.status(401).render('login', {
            messageInfo: 'UserId or Password is incorrect'
        })
    }
}

exports.register =(req, res) => {
    const { name, userId, email, password } = req.body;

    db.query('SELECT email FROM userinfo WHERE email = ?', [email], async(error, results) => {
        if(error){
            console.log(error);
        }
        if(results.length > 0) {
            return res.render('signup', {messageInfo: 'That email is already in use'});
        }

        db.query('SELECT userId FROM userinfo WHERE userId = ?', [userId], async(error, results) => {
            if(error) {
                console.log(error);
            }
            if(results.length > 0) {
                return res.render('signup', {messageInfo: 'That userId is already in use'});
            }

            let hashedPassword = await bcrypt.hash(password, 8);

            const token = generateAuthToken(userId);

            db.query('INSERT INTO userinfo SET ?', {token: token, name: name, userId: userId, email: email, password: hashedPassword }, (error, results) => {
                if(error) {
                    console.log(error);
                }
                else {
                    console.log(results);
                    
                    const cookieOption = {
                        expires: new Date(
                            Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                        ),
                        httpOnly: true
                    }
                
                    res.cookie('jwt', token, cookieOption);

                    return res.redirect('/feed');
                }
            });
        });
    });
    console.log(req.body);
}