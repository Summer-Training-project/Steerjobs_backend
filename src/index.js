const express = require('express');
const path = require('path');

const app = express();

let rootPath = path.join(__dirname, '../');

app.set('view engine', 'hbs');
app.set('views', rootPath + 'templates')



console.log("console.log Info :" + path.join(rootPath, '/routes/pages'));
app.use('/', require(path.join(rootPath, '/routes/pages.js')));



app.use(express.static(path.join(rootPath, 'public')));

app.listen(8000, ()=> {
    console.log('8000 port is listening');
})