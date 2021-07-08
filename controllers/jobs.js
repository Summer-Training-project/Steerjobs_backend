const mysql = require('mysql');
const jwt = require('jsonwebtoken');



const verifyUserInfo = (req, res) => {
    const tooken = req.cookies.jwt;
    const verifyUser = jwt.verify(tooken, process.env.JWT_SECRET);
    return verifyUser.tokenId;
}

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

db.connect((err) => {
    if(err) {
        console.log("postJobs database is is Disconnected!.....");
    }
    else {
        console.log("postJobs database is Confected!.....");
    }
})


exports.postJobs = (req, res) => {
    const {jobTitle, companyName, city, country, numbApplicants, workingType, jobDesc } = req.body;
    console.log(req.body);
    
    db.query('SELECT name, userId FROM userInfo WHERE userId = ?', [verifyUserInfo(req,res)], (error, results) => {
        if(error) {
            console.log(error);
        }
        else {
            const name = results[0].name;
            const userId = results[0].userId;

            db.query('INSERT INTO postJobs SET ?', { name , userId, jobTitle, companyName, city,  country, numbApplicants, workingType, jobDesc }, (error, results) => {
                if(error) {
                    console.log(error);
                }
                else {
                    res.render('postJob', {
                        InfoMessage: 'Great!..... Your Job has been posted',
                        InfoColor: '#28a745',
                        linkSigninAndProfile: '/profile',
                        linkSignupAndSignout: '/signout',
                        signinAndProfile: name,
                        signupAndSignout: 'Sign-Out'
                    })
                }
            });
        }
    });
    
}


exports.applyJobs = (req, res)  => {
    const {email, countryCode , number } = req.body;
    console.log(req.body);
    db.query('SELECT name, userId FROM userInfo WHERE userId = ?', [verifyUserInfo(req,res)], (error, results) => {
        if(error) {
            console.log(error);
        }
        else {
            
        }
    })
}