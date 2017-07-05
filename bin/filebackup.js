let fs = require("fs");
let iconv = require('iconv-lite'); 
let schedule = require('node-schedule');
let events = require("events");
let emitter = new events.EventEmitter();

require("./../iotlib/src/common/common.js");
let config = require("./../iotlib/src/config/sysconfig.json");

let backup = config.backup;
let history = config.historyfile;

// var rule = new schedule.RecurrenceRule(); 
//     // rule.minute = 42;
// // rule.minute = [];
// rule.dayOfWeek=0;
// // for(let i=0;i<60;i=i+1){
// //     rule.minute.push(i);
// // } 
// schedule.scheduleJob(rule, function(){
//     console.dir("***************");
//     // emitter.emit("timerun");
// });

emitter.on("runbackup",function(){
    let _timeback = new Date().pattern("yyyyMMdd");
    _timeback = history+"/"+_timeback;
    fs.mkdirSync(_timeback);
    fs.readdir(backup, function (err, files) {
        if(err) {
            console.error(err);
            return;
        } else {  
            for(let i=0;i<files.length;i++){
                let file = files[i];
                let nameArr = file.split(".");
                let filename = nameArr[0];
                let filedir = filename.substr(filename.lastIndexOf("_")+1);
                let _have = fs.existsSync(_timeback+"/"+filedir);
                if(!_have){
                    fs.mkdirSync(_timeback+"/"+filedir);
                }
                fs.rename(backup+'/'+file,_timeback+"/"+filedir+'/'+file,function(err){
                    if(err){
                        console.error(err);
                    } 
                });
            }
        }
    });
}); 

emitter.emit("runbackup");
