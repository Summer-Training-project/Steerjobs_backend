const mysql = require('mysql');
const express = require('express');


const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

db.connect((err) => {
    if(err) {
        console.log("DataBase Query Controal board is Disconected!.....");
    }
    else {
        console.log("DataBase Query Controal board is Conected!.....");
    }
})

exports.database = (req, res) => {
    const { query } = req.body;

    console.log(req.body);

    db.query(query, (err,results) => {
        if(err) {
            return res.render('database', {
                Result: err,
                linkSigninAndProfile: '/login',
                linkSignupAndSignout: '/logout',
                signinAndProfile: 'SIGN-IN',
                signupAndSignout: 'Sign-Up'
            });
        }
        else {
            console.log(results);
            return res.render('database', {
                Result: JSON.stringify(results),
                linkSigninAndProfile: '/login',
                linkSignupAndSignout: '/logout',
                signinAndProfile: 'SIGN-IN',
                signupAndSignout: 'Sign-Up'
            });
        }
    })
}