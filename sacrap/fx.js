exports.db_put = {db_put};
function db_put(callback,arg){
    pool.query("UPDATE `pills` SET `json`='",'"',arg,'"', function(err, result){
        if (err) console.log(err,null);
        else callback(null,result[0]);
    });
}
function jwrite(jdata){
    // console.log(jdata);            
    let wdata = JSON.stringify(jdata);
    fs.writeFile('./mods/pills.json', wdata, 'utf8', err => {
        if (err) {
            console.log(`Error writing file: ${err}`)
        } else {
            console.log(`File is written successfully!`)
        }
    })
}
function jwrite_pill(name,pill,date,comment){
    comment = (comment==""||comment==null&&comment==" ")? "-":comment;
    fs.readFile('./mods/pills.json','utf8',(err,data)=>{
        let jdata = JSON.parse(data);
        jdata[name] = {
            "date":date,
            "pill":pill,
            "comment":comment
        };
        // console.log(jdata);            
        let wdata = JSON.stringify(jdata);
        fs.writeFile('./mods/pills.json', wdata, 'utf8', err => {
            if (err) {
                console.log(`Error writing file: ${err}`)
            } else {
                console.log(`File is written successfully!`)
            }
        })
    })
}
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
function dict_reverse(obj) {
    new_obj= {}
    rev_obj = Object.keys(obj).reverse();
    rev_obj.forEach(function(i) { 
      new_obj[i] = obj[i];
    })
    return new_obj;
}  