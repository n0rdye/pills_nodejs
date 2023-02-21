const mysql = require("mysql");
const express = require('express');
const {
    response,
    request
} = require('express');
const app = express();
var vars = require('./vars.js');
const { json } = require("body-parser");
const { pathToFileURL } = require("url");
app.set('view engine','ejs');
app.use(express.urlencoded({extended: false}));
app.use(express.static('public'));
const {
    readFile
} = require('fs').promises;
const fs = require('fs');
const pool = mysql.createPool({
 connectionLimit: 100,
 host: "172.18.0.2",
 user: "root",
 password: "root",
 database: "pills",
 debug: false,
});


// database
function db_get(callback){
    pool.query('SELECT * FROM pills', function(err, result){
        if (err) console.log(err,null);
        else callback(null,result[0]);
    });
};
function db_put(callback,arg){
    pool.query("UPDATE `pills` SET `json`='",'"',arg,'"', function(err, result){
        if (err) console.log(err,null);
        else callback(null,result[0]);
    });
};
// get(function(err,data){        
//     vars.d = data["id"];
//     console.log(vars.d);
// })

// async function s() {
//     const promise = await new Promise((resolve, reject) => {pool.query(`SELECT * FROM pills`, (err, result) => {resolve(result[0])})});
//     return promise["json"];
// }
// // // s();
// async function l(){
//     let json = JSON.parse(await s());
//     // console.log(json);
//     return json;
// }
// l();



app.get('/', async (req, res) => {
    res.render('index');
});


app.get('/user', (req,res) => {
    db_get(function(err,data){  
        let jdata = JSON.parse(data["json"]);
        // window.localStorage.setItem("pill/jdata?/","jdata");
        let pills = [];
        let ids = [];
        for (const key in jdata) {
            if (jdata.hasOwnProperty.call(jdata, key)) {
                const element = jdata[key];
                if(element["pill"]!=""&&element["pill"]!=null&&element["pill"]!=" "&&element["pill"]!="undefined"){
                    pills.push(element["pill"]);
                    ids.push(key);
                    // console.log(key);
                } 
            }
        }
        // console.log(JSON.stringify(jdata));
        res.render(`user`, { data:JSON.stringify(jdata)});
    })
})

// function name(params) {
//     .then(response => response.json())
//     .then(responseJson => {
//       // set localStorage with your preferred name,..
//       // ..say 'my_token', and the value sent by server
//       window.localStorage.setItem('my_token', responseJson.my_token)
//       // you may also want to redirect after you have saved localStorage:
//       // window.location.assign("http://www.example.org")
//       // you may even want to return responseJson or something else or assign it to some variable
//       // return responseJson;
//   })
// }
function get_json() {
        fs.readFile('./pills.json', 'utf8', (err, data) => {
        if (err) {
          console.log(`Error reading file from disk: ${err}`)
        } else {
          // parse JSON string to JSON object
          const pills = JSON.parse(data)
          for (const key in pills) {
            if (Object.hasOwnProperty.call(pills, key)) {
                const element = pills[key];
                console.log(key);
            }
          }
        }
    })
}
get_json();
// app.post('/scripts',(req,res) => {
//     console.log(req.body);
//     db_get(function(err,data){  
//         let jdata = JSON.parse(data["json"]);
//         // jdata[]
//     })
// })


app.all('*', (req, res) => {
    res.status(404).send('<h1>404! Page not</h1>');
});
app.listen(process.env.PORT || 8080, () => console.log("started"));