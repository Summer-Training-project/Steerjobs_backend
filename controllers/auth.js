const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../database/db');
const verifyUserInfo = require('../database/verifyUserInfo');
const loginInfo = require('../database/loginInfo');


function generateAuthToken(tokenId) {
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
                    messageInfo: 'UserId or Password is incorrect',
                })
            }
            else {
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
            messageInfo: 'UserId or Password is incorrect',
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
            return res.render('signup', {
                messageInfo: 'That Email is already in use',
            });
        }

        db.query('SELECT userId FROM userinfo WHERE userId = ?', [userId], async(error, results) => {
            if(error) {
                console.log(error);
            }
            if(results.length > 0) {
                return res.render('signup', {
                    messageInfo: 'That userId is already in use',
                });
            }

            let hashedPassword = await bcrypt.hash(password, 8);

            const token = generateAuthToken(userId);
            // const connectionTable = userId + 'Connection';

            // db.query(`CREATE TABLE ${connectionTable} ( id INT AUTO_INCREMENT PRIMARY KEY, connectionUserId VARCHAR(500), connectionStatus BOOLEAN)`, connectionTable , (error, results) => {
            //     if(error) {
            //         console.log(error);
            //     }
            //     else {
            //         console.log(results)
            //     }
            // });

            db.query('INSERT INTO userinfo SET ?', {token: token, name: name, userId: userId, email: email, password: hashedPassword }, (error, infoResults) => {
                if(error) {
                    console.log(error);
                }
                else {
                    
                    const cookieOption = {
                        expires: new Date(
                            Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                        ),
                        httpOnly: true
                    }
                
                    res.cookie('jwt', token, cookieOption);

                    return res.render('userInfoForm', {
                        userName: name,
                        login: loginInfo(results),
                    });
                }
            });
        });
    });
    console.log(req.body);
}


exports.info = (req, res) => {
    const { country, countryCode, mobile, DOB, gender, address, briefIntro, education, institution, skills } = req.body;

    let dob = new Date(DOB);
    let monthDiff = Date.now() - dob.getTime();
    let yearDiff = new Date(monthDiff);
    let year = yearDiff.getUTCFullYear();
    var age = Math.abs(year - 1970);

    db.query('UPDATE userInfo SET ? WHERE userId = ?',[{country, countryCode, mobile, DOB, age, gender, address, briefIntro, education,institution,skills},verifyUserInfo(req, res)], (error, results) => {
        if(error) {
            res.send('Something Went Wrong!....')
        }
        else {
            res.redirect('/feed');
        }
    });

    console.log(req.body);
}