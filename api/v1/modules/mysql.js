const mysql2 = require('mysql2');

const connection = mysql2.createConnection({
    host: 'localhost',
    user: 'shai',
    password: '1234',
    database: 'ecommdb'
});

const mysql2 = require('mysql2');

const pool = mysql2.createpool({
    host: process.env.MYSQL_SERVER,
    user: process.env.MYSQL_USER= shai,
    password: process.env.MYSQL_PASS=1234,
    database: process.env.MYSQL_DB=ecommdb,
    waitforconnections :true,
    connectionlimit :10,
    queuelimit:0


});


module.exports=pool;