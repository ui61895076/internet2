
const mysql =require('mysql')

//设置mysql
let connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '123456',
    database : 'internet_g'
});



module.exports= connection