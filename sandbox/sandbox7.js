var mysql = require('mysql');
var PASSPHRASE_FILE = '.passphrase'
var PASSPHRASE = ''
var fs = require('fs'),
    path = require('path'),
    filePath = path.join(__dirname, PASSPHRASE_FILE);

PASSPHRASE = fs.readFileSync(filePath,{ encoding: 'utf8' });

console.log(PASSPHRASE);

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'user',
    password: PASSPHRASE,
    database: 'jpdanta'
});

connection.connect();

connection.query('SELECT now()',
    function (err, rows, fields) {
        if (err) throw err;

        console.log(rows);
    }
);

connection.end();