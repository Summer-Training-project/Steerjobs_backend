const express = require('express');
const authUser = require('../controllers/authUser');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');


//const app = express();
const router = express.Router(); //function 


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

//router.get('/home'); 

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


router.get('/about', authUser('about',null,defalultAuthUserObject), (req, res) => {
    db.query('SELECT * FROM userinfo WHERE userId = ?',[verifyUserInfo(req, res)], (error, results) => {
        if(error) {
            res.send('Something Went Wrong!....')
        }
        else {
            res.render('about', {
                linkSigninAndProfile: '/profile',
                linkSignupAndSignout: '/signout',
                signinAndProfile: results[0].name,
                signupAndSignout: 'Sign-Out'
            });
        }
    });
});


router.get('/jobs/search-job', authUser('signup','/signup',defalultAuthUserObject), (req, res) => {
    db.query('SELECT * FROM userinfo WHERE userId = ?',[verifyUserInfo(req, res)], (error, userResults) => {
        if(error) {
            res.send('Something Went Wrong!....');
        }
        else {
            if(!userResults[0]) {
                // render the jobSearch page
                res.render('jobSearch', {
                // basic informaiton of current user
                messageInfo: 'There is no post to be displayed',
                colorCode: '#dc3545',
                linkSigninAndProfile: '/profile',
                linkSignupAndSignout: '/signout',
                signinAndProfile: userResults[0].name,
                signupAndSignout: 'Sign-Out'
            })

            } 
            else {

                db.query('SELECT * FROM postJobs', (error,postResults) => {
                    if(error) {
                        console.log(error);
                    }
                    else {

                
                        let routLink = postResults.map((elem,id) => {
                            
                            return '/jobs/search-job/id-' + id;
                        });
                
                        // var timestamp = jobResults[0].postDateTime;
                        // var currentDateTime = new Date.now();
                        // var timeDiff = currentDateTime - timestamp;
                
                        let maxResult = postResults.length;

                
                        for(let i = 0; i<maxResult; i++) {
                            router.get('/jobs/search-job/id-' + i, authUser('signup','/signup',defalultAuthUserObject), (req,res) => {
                
                                res.render('jobSearch', {
                                    userResults: userResults[0],
                                    postResults,
                                    linkSigninAndProfile: '/profile',
                                    linkSignupAndSignout: '/signout',
                                    signinAndProfile: userResults[0].name,
                                    signupAndSignout: 'Sign-Out',
                                    postRoutLink: routLink,
                                    idResults: postResults[i]
                                });
                            })
                        }
                        res.render('jobSearch', {
                            userResults: userResults[0],
                            postResults,
                            linkSigninAndProfile: '/profile',
                            linkSignupAndSignout: '/signout',
                            signinAndProfile: userResults[0].name,
                            signupAndSignout: 'Sign-Out',
                            postRoutLink: routLink,
                            idResults: postResults[0]
                        });
                    }
                })
            }
        }
    });
});

db.query('SELECT * FROM postJobs', (error,results) => {
    if(error) {
        console.log(error);
    }
    else {

        // var timestamp = jobResults[0].postDateTime;
        // var currentDateTime = new Date.now();
        // var timeDiff = currentDateTime - timestamp;

        let maxResult = results.length;

        for(let i = 0; i<maxResult; i++) {
            router.get('/jobs/search-job/id-' + i, authUser('signup','/signup',defalultAuthUserObject), (req,res) => {

                db.query('SELECT * FROM postJobs', (error,postResults) => { 
                    if(error) {
                       return console.log(error);
                    }
                    else {
                        let routLink = postResults.map((elem,id) => {
                            return '/jobs/search-job/id-' + id;
                        });
                        db.query('SELECT * FROM userinfo WHERE userId = ?',[verifyUserInfo(req, res)], (error, userResults) => {
                            if(error) {
                                console.log(error);
                            } 
                            else {
                                if(!userResults[0]) {
                                    res.send('Something Went Wrong!....');
                                }
                                else {
                                    res.render('jobSearch', {
                                        userResults: userResults[0],
                                        postResults,
                                        linkSigninAndProfile: '/profile',
                                        linkSignupAndSignout: '/signout',
                                        signinAndProfile: userResults[0].name,
                                        signupAndSignout: 'Sign-Out',
                                        postRoutLink: routLink,
                                        idResults: postResults[i]
                                    });
                                }
                            }
                        })
                    }
                })
            })
        }

    }
})


router.get('/jobs/post-job', authUser('signup','/signup',defalultAuthUserObject), (req, res) => {
    db.query('SELECT * FROM userinfo WHERE userId = ?',[verifyUserInfo(req, res)], (error, results) => {
        if(error) {
            res.send('Something Went Wrong!....')
        }
        else {
            res.render('postJob', {
                linkSigninAndProfile: '/profile',
                linkSignupAndSignout: '/signout',
                signinAndProfile: results[0].name,
                signupAndSignout: 'Sign-Out',
                userName: results[0].name,
                userSkill: results[0].skills,
                InfoMessage: 'Post a job You have'
            });
        }
    });
});



router.get('/database', (req, res) => { 
    res.render('database', {
        linkSigninAndProfile: '/login',
        linkSignupAndSignout: '/logout',
        signinAndProfile: 'SIGN-IN',
        signupAndSignout: 'Sign-Up',
    });
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