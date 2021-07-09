const express = require('express');
const authUser = require('../controllers/authUser');
const loginInfo = require('../database/loginInfo');
const db = require('../database/db');
const verifyUserInfo = require('../database/verifyUserInfo');


const router = express.Router(); 


router.get('/',authUser('index'), (req, res) => {
    db.query('SELECT * FROM userinfo WHERE userId = ?',[verifyUserInfo(req, res)], (error, results) => {
        if(error) {
            res.send('Something Went Wrong!....')
        }
        else {
            res.render('index', {
                login: loginInfo(results)
            });
        }
    });
});


router.get('/home',authUser('index'), (req, res) => {
    db.query('SELECT * FROM userinfo WHERE userId = ?',[verifyUserInfo(req, res)], (error, results) => {
        if(error) {
            res.send('Something Went Wrong!....')
        }
        else {
            res.render('index', {
                login: loginInfo(results)
            });
        }
    });
});


router.get('/login',authUser('login'), (req, res) => {
    res.redirect('/feed');
});


router.get('/signup',authUser('signup'), (req, res) => {
    res.redirect('/feed');
});


router.get('/signout',authUser('login','/login'), (req, res) => {
    try {
        res.clearCookie('jwt');
        console.log("Successfully Logout");
    } 
    catch (error) {
        res.status(500).send(error);
    }
    res.redirect('/login');
});


router.get('/about', authUser('about'), (req, res) => {
    db.query('SELECT * FROM userinfo WHERE userId = ?',[verifyUserInfo(req, res)], (error, results) => {
        if(error) {
            res.send('Something Went Wrong!....')
        }
        else {
            res.render('about', {
                login: loginInfo(results)
            });
        }
    });
});


router.get('/jobs/search-job', authUser('signup','/signup'), (req, res) => {
    db.query('SELECT * FROM userinfo WHERE userId = ?',[verifyUserInfo(req, res)], (error, userResults) => {
        if(error) {
            res.send('Something Went Wrong!....');
        }
        else {
            if(!userResults[0]) { // i will see you
                res.render('jobSearch', {
                messageInfo: 'There is no post to be displayed',
                colorCode: '#dc3545',
                login: loginInfo(userResults)
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
                            router.get('/jobs/search-job/id-' + i, authUser('signup','/signup'), (req,res) => {
                
                                res.render('jobSearch', {
                                    userResults: userResults[0],
                                    postResults,
                                    login: loginInfo(userResults),
                                    postRoutLink: routLink,
                                    idResults: postResults[i],
                                    postId: postResults[i].id
                                });
                            })
                        }
                        res.render('jobSearch', {
                            userResults: userResults[0],
                            postResults,
                            login: loginInfo(userResults),
                            postRoutLink: routLink,
                            idResults: postResults[0],
                            postId: postResults[0].id
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
            router.get('/jobs/search-job/id-' + i, authUser('signup','/signup'), (req,res) => {

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
                                        login: loginInfo(userResults),
                                        postRoutLink: routLink,
                                        idResults: postResults[i],
                                        postId: postResults[i].id
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


router.get('/jobs/post-job', authUser('signup','/signup'), (req, res) => {
    db.query('SELECT * FROM userinfo WHERE userId = ?',[verifyUserInfo(req, res)], (error, results) => {
        if(error) {
            res.send('Something Went Wrong!....')
        }
        else {
            res.render('postJob', {
                login: loginInfo(results),
                userName: results[0].name,
                userSkill: results[0].skills,
                InfoMessage: 'Post a job You have'
            });
        }
    });
});



router.get('/database', (req, res) => { 
    res.render('database', {
        login: loginInfo(results),
    });
});


router.get('/feed',authUser('index','/home'), (req, res) => {
    db.query('SELECT * FROM userinfo WHERE userId = ?',[verifyUserInfo(req, res)], (error, results) => {
        if(error) {
            res.send('Something Went Wrong!....');
        }
        else {
            res.render('feed', {
                login: loginInfo(results),
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
                    login: loginInfo(results),
                })
            });

            res.redirect('/profile/user/'+ results[0].userId,);
        }
    });
});


module.exports = router;