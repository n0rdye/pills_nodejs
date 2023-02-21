const express = require('express');
const {
    response,
    request
} = require('express');
const app = express();

const today = new Date()
const day = today.getDate();
const month = today.getMonth()+1;
const year = today.getFullYear();

const { json } = require("body-parser");
const { pathToFileURL } = require("url");

app.set('view engine','ejs');
app.use(express.urlencoded({extended: false}));
app.use(express.static('public'));

const fs = require('fs');


app.get('/user', (req,res) => {
    fs.readFile('./pills.json', 'utf8', (err, data) => {
        let jdata = JSON.parse(data);
        res.render(`user`, { data: dict_reverse(jdata)});
    })
})
app.get('/', (req,res) => {
    res.redirect("/user");
})

function dict_reverse(obj) {
    new_obj= {}
    rev_obj = Object.keys(obj).reverse();
    rev_obj.forEach(function(i) { 
      new_obj[i] = obj[i];
    })
    return new_obj;
}  

app.post('/scripts',(req,res) => {
    let inp = req.body;
    console.log(inp);
    if(inp["func"]=="save"){
        let pill = `[${inp["pill"]}]`;
        let comment = inp["comment"];
        fs.readFile('./pills.json','utf8',(err,data)=>{
            let jdata = JSON.parse(data);
            let num = j_max(jdata)+1; 
            let name = `pill_${num}`;
            let c_date = `${day}.${month}.${year}`;
            jwrite_pill(name,pill,c_date,comment);
        })
        console.log(pill);
    }
    else if(inp["func"]=="del"){
        let pill = inp["pill"];
        fs.readFile('./pills.json','utf8',(err,data)=>{
            let jdata = JSON.parse(data);
            delete jdata[pill];
            jwrite(jdata);
        })
    }
    else if(inp["func"]=="edit"&&inp["mode"]=="save"){
        let name = inp["name"];
        let date = inp["date"];
        let comment = inp["comment"];
        let pill = inp["pill"];
        console.log("ecdit");
        jwrite_pill(name,pill,date,comment);
    }
    res.redirect("/user");
})

function jwrite(jdata){
    // console.log(jdata);            
    let wdata = JSON.stringify(jdata);
    fs.writeFile('./pills.json', wdata, 'utf8', err => {
        if (err) {
            console.log(`Error writing file: ${err}`)
        } else {
            console.log(`File is written successfully!`)
        }
    })
}



function jwrite_pill(name,pill,date,comment){
    comment = (comment==""||comment==null||comment==" "||comment==undefined||comment=="  ")? "-":comment;
    // console.log(comment,"||");
    fs.readFile('./pills.json','utf8',(err,data)=>{
        let jdata = JSON.parse(data);
        jdata[name] = {
            "date":date,
            "pill":pill,
            "comment":comment
        };
        // console.log(jdata);            
        let wdata = JSON.stringify(jdata);
        fs.writeFile('./pills.json', wdata, 'utf8', err => {
            if (err) {
                console.log(`Error writing file: ${err}`)
            } else {
                console.log(`File is written successfully!`)
            }
        })
    })
}

app.post("/edit",(req,res) =>{
    let inp = req.body;
    let name = inp["name"];
    let pill = inp["pill"];
    let date = inp["date"];
    let comment = inp["comment"];
    console.log("e");
    res.render(`edit`, { name:name,pill:pill,comment:comment,date:date});
})

function j_max(arg){
    let max = 0;
    for (const key in arg) {
        let num =  parseInt(key.split("_")[parseInt(key.split("_").length-1)]);
        // console.log(key);
        max = (num>max)? num:max;
    }
    console.log(max);
    return max;
}


app.all('*', (req, res) => {
    res.status(404).send('<h1>404! Page not</h1>');
});
app.listen(process.env.PORT || 8080, () => console.log("started"));