const db = require('../database/db');
const verifyUserInfo = require('../database/verifyUserInfo');
const loginInfo = require('../database/loginInfo');
const path = require('path');

let rootPath = path.join(__dirname, '../');


exports.postJobs = (req, res) => {
    const { jobTitle, companyName, city, country, numbApplicants, workingType, jobDesc } = req.body;
    // console.log(req.body);

    db.query('SELECT * FROM userInfo WHERE userId = ?', [verifyUserInfo(req, res)], (error, userResults) => {
        if (error) {
            console.log(error);
        }
        else {
            const name = userResults[0].name;
            const userId = userResults[0].userId;
            const skills = userResults[0].skills;

            db.query('INSERT INTO postJobs SET ?', { name, userId, skills, jobTitle, companyName, city, country, numbApplicants, workingType, jobDesc }, (error, postResults) => {
                if (error) {
                    console.log(error);
                }
                else {
                    res.render('postJob', {
                        InfoMessage: 'Great!..... Your Job has been posted',
                        InfoColor: '#28a745',
                        login: loginInfo(userResults),
                    })
                }
            });
        }
    });

}


exports.applyJobs = (req, res) => {
    const { postId, email, countryCode, phone } = req.body;

    db.query('SELECT * FROM userInfo WHERE userId = ?', [verifyUserInfo(req, res)], (error, userResults) => {
        if (error) {
            console.log(error);
        }
        else {

            db.query('SELECT * FROM postjobs', [postId], (error, postResults) => {
                if (error) {
                    console.log(error);
                }
                else {
                    db.query('SELECT * FROM postjobs WHERE id = ?', [postId], (error, postResult) => {
                        if (error) {
                            console.log(error);
                        }
                        else {
                            if (userResults[0].userId == postResult[0].userId) {
                                return res.render('jobSearch', {
                                    userResults: userResults[0],
                                    postResults,
                                    login: loginInfo(userResults),
                                    idResults: postResults[0],
                                    postId: postResults[0].id,
                                    messageInfo: "You can't apply to your own posted jobs",
                                    colorCode: '#dc3545'
                                })
                            }

                            let resumeFile = req.files.resume;
                            let resumePath = '/database_file/resume/' + userResults[0].userId + '_' + postResults[0].id + '_' + resumeFile.name;
                            let uploadPath = path.join(rootPath, resumePath);

                            console.log(uploadPath);
                            resumeFile.mv(uploadPath, (error) => {
                                if (error) {
                                    return res.status(500).render('jobSearch', {
                                        userResults: userResults[0],
                                        postResults,
                                        login: loginInfo(userResults),
                                        idResults: postResult[0],
                                        postId: postResults[0].id,
                                        messageInfo: 'Error while uploading a resume plz... retry!...',
                                        colorCode: '#dc3545'
                                    })
                                }
                                else {
                                    db.query('INSERT INTO applyJobs SET ?', {
                                        applyName: userResults[0].name,
                                        applySkills: userResults[0].skills,
                                        applyAddress: userResults[0].address,
                                        applyCountry: userResults[0].country,
                                        applyUserId: userResults[0].userId,
                                        applyEmail: email,
                                        applyCountryCode: countryCode,
                                        applyMobile: phone,
                                        postId: postResults[0].id,
                                        postUserId: postResults[0].userId,
                                        rusumePath: resumePath
                                    }, (error, results) => {
                                        if (error) {
                                            console.log(error);
                                        }
                                        else {
                                            let routLink = postResults.map((elem, id) => {
                                                return '/jobs/search-job/id-' + id;
                                            });
                                            res.render('jobSearch', {
                                                userResults: userResults[0],
                                                postResults,
                                                login: loginInfo(userResults),
                                                idResults: postResults[0],
                                                postId: postResults[0].id,
                                                messageInfo: 'Thank you!.. Your job application has been submitted successfully.',
                                                colorCode: '#28a745'
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    });
                }
            })

        }
    })
}