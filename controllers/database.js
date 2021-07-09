const db = require('../database/db');

exports.database = (req, res) => {
    const { query } = req.body;

    console.log(req.body);

    db.query(query, (err,results) => {
        if(err) {
            return res.render('database', {
                Result: err,
            });
        }
        else {
            console.log(results);
            return res.render('database', {
                Result: JSON.stringify(results),
            });
        }
    })
}