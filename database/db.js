const mysql = require('mysql');


const db = mysql.createConnection({
    host: process.env.DATABASE_HOST, 
    user: process.env.DATABASE_USER, 
    password: process.env.DATABASE_PASSWORD, 
    database: process.env.DATABASE 
});

db.connect((err) => {
    if(err) {
        console.log("mySql database is disconnected!...");
    }
    else {
        console.log("mySql database is connected!...");
    }
});


module.exports = db;