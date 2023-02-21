const {
    response,
    request
} = require('express');

const express = require('express');
var vars = require('./vars.js');

const mysql = require("mysql");

const pool = mysql.createPool({
 connectionLimit: 100,
 host: "localhost",
 server: "db",
 user: "root",
 password: "root",
 database: "clicker",
 debug: false,
});

pool.query("SELECT * from table_name LIMIT 10", (err, rows) => {
 if (err) {
   console.log("error occurred during the connection.");
 }
//  console.log(rows[0]);
});


const {
    readFile
} = require('fs').promises;

const app = express();
app.get('/', async (request, response) => {
    response.send(await readFile(`html/${dt.page}`, 'utf8'));
});

app.listen(process.env.PORT || 3000, () => console.log("started"));