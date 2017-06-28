
let fs = require("fs");
let iconv = require('iconv-lite'); 
let schedule = require('node-schedule');
let events = require("events");
var emitter = new events.EventEmitter();


let sqlparser = require("lifekit-mysqlhelper").Sqlparser(); 
let db = sysconfig.db;
let conn = require("lifekit-mysqlhelper").dbhelper(db.dbname,db.server,db.port,db.uid,db.pwd);
 
var rule = new schedule.RecurrenceRule(); 
    // rule.minute = 42;
rule.minute = [];
for(let i=0;i<60;i=i+1){
    rule.minute.push(i);
} 
schedule.scheduleJob(rule, function(){
    emitter.emit("timerun");
});
 
//导入日内计划数据
emitter.on("save_rn_plan",function(file){
    let sql = "";
    let fileArr = file.split("_");
    let file_time = fileArr[1]+fileArr[2];
    fs.readFile(sysconfig.filepath+'/'+file, function (err, data) {
        if(err) {
            console.error(err);
            return;
        } 
        var strArr = iconv.decode(data, 'gb2312').split("\n"); 
        let plan_time = "";
        for(let i=0;i<strArr.length;i++){
            let temp = strArr[i];
            if(temp.indexOf("time")>0){
                plan_time = temp.substr(temp.indexOf("'")+1,16);
            }
            if(temp.indexOf("#")>=0){
                let tempSpl = temp.split(/\s+/);
                let insertObj = {
                    key_:tempSpl[0].replace("#",""),
                    plan_val:tempSpl[1],
                    plan_time:plan_time,
                    file_time:file_time
                }
                sql = sql + ";" + sqlparser.insertColumnForJson("RN_PLAN",insertObj);
            }
        }
        console.dir(sql.substr(1));
        conn.execNonQuery(sql.substr(1),function(err,res){
            if(err){
                console.error(err);
                return;
            }
            console.log("保存成功"); 
            fs.rename(sysconfig.filepath+'/'+file,sysconfig.backup+'/'+file,function(err){
                if(err){
                    console.error(err);
                } 
            });
        }) 
    });
});

//导入日内计划数据
emitter.on("save_rq_plan",function(file){
    let sql = "";
    let fileArr = file.split("_");
    let file_time = fileArr[1]+fileArr[2];
    fs.readFile(sysconfig.filepath+'/'+file, function (err, data) {
        if(err) {
            console.error(err);
            return;
        } 
        var strArr = iconv.decode(data, 'gb2312').split("\n"); 
        let plan_time = "";
        for(let i=0;i<strArr.length;i++){
            let temp = strArr[i];
            if(temp.indexOf("time")>0){
                plan_time = temp.substr(temp.indexOf("'")+1,16);
            }
            if(temp.indexOf("#")>=0){
                let tempSpl = temp.split(/\s+/);
                let insertObj = {
                    key_:tempSpl[0].replace("#",""),
                    plan_val:tempSpl[1],
                    plan_time:plan_time,
                    file_time:file_time
                }
                sql = sql + ";" + sqlparser.insertColumnForJson("RQ_PLAN",insertObj);
            }
        }
        conn.execNonQuery(sql.substr(1),function(err,res){
            if(err){
                console.error(err);
                return;
            }
            console.log("保存成功");
            fs.rename(sysconfig.filepath+'/'+file,sysconfig.backup+'/'+file,function(err){
                if(err){
                    console.error(err);
                } 
            });
        }) 
    });
});

emitter.on("save_pj",function(file){
    let sql = "";
    let fileArr = file.split("_");
    let file_time = fileArr[1]+fileArr[2];
    fs.readFile(sysconfig.filepath+'/'+file, function (err, data) {
        if(err) {
            console.error(err);
            return;
        } 
        var strArr = iconv.decode(data, 'gb2312').split("\n"); 
        let insertObj = {}; 
        for(let i=0;i<strArr.length;i++){
            let temp = strArr[i];
            if(temp.indexOf("time")>0){
                insertObj.rq = temp.substr(temp.indexOf("'")+1,16);
            }
            if(temp.indexOf("#")>=0){
                let tempSpl = temp.split(/\s+/);
                let index = tempSpl[0];
                if(index==="#1"){
                    insertObj.sjcjdf = tempSpl[2];
                }else if(index==="#2"){
                    insertObj.dqdf = tempSpl[2];
                }else if(index==="#3"){
                    insertObj.cdqdf = tempSpl[2];
                }else if(index==="#4"){
                    insertObj.ddycydf = tempSpl[2];
                }else if(index==="#5"){
                    insertObj.ygdf = tempSpl[2];
                }else if(index==="#6"){
                    insertObj.zdf = tempSpl[2];
                } 
                
            }
        }
        sql = sqlparser.insertColumnForJson("PJ",insertObj);
        conn.execNonQuery(sql,function(err,res){
            if(err){
                console.error(err);
                return;
            }
            console.log("保存成功");
            fs.rename(sysconfig.filepath+'/'+file,sysconfig.backup+'/'+file,function(err){
                if(err){
                    console.error(err);
                } 
            });
        }) 
    });
});

emitter.on("file_listener",function(file_type,trans_type,status_){
    if(file_type=="PJ"){
        return;
    }
    if(file_type!="RQ"&&file_type!="RN"&&file_type!="TXDD"&&file_type!="TXHT"){
        let sockets = netclient.getSockets("cszt").values(); 
        for(let i=0;i<sockets.length;i++){
            let net = sockets[i].net; 
            net.data.status[file_type.toLowerCase()][trans_type] = status_;
        }
    } 
    sockets = netclient.getSockets("yxjk").values(); 
    for(let i=0;i<sockets.length;i++){
        let net = sockets[i].net; 
        if(file_type=="RQ"||file_type=="RN"||file_type=="TXDD"||file_type=="TXHT"){
            net.data.status[file_type.toLowerCase()] = status_;
        }else{
            net.data.status[file_type.toLowerCase()][trans_type] = status_;
        } 
    }
}); 

emitter.on("general_file_log",function(file){
    fs.readFile(sysconfig.filepath+'/'+file, function (err, data) {
        if(err) {
            console.error(err);
            return;
        } 
        var strArr = iconv.decode(data, 'gb2312').split("\n"); 
         
        for(let i=0;i<strArr.length;i++){ 
            let temp = strArr[i];
            if(!temp){
                continue;
            } 
            if(temp.indexOf("到调度主机")>0&&temp.indexOf("的网络工作正常")>0){
                //前端推送文件传输信息
                emitter.emit(
                    "file_listener",
                    "TXDD",
                    "down",
                    0
                );
            }else if(temp.indexOf("到调度主机的网络不通")>0){
                //前端推送文件传输信息
                emitter.emit(
                    "file_listener",
                    "TXDD",
                    "down",
                    1
                );
            }else if(temp.indexOf("到本机网卡")>0&&temp.indexOf("的网络工作正常")>0){
                //前端推送文件传输信息
                emitter.emit(
                    "file_listener",
                    "TXHT",
                    "down",
                    0
                );
            }else if(temp.indexOf("到本机网卡的网络不通")>0){
                //前端推送文件传输信息
                emitter.emit(
                    "file_listener",
                    "TXHT",
                    "down",
                    1
                );
            }

        } 
    });
});
 
emitter.on("save_file_log",function(file){
    let sql = "";
    let fileArr = file.split("_");
    let file_time = fileArr[1]+fileArr[2];
    fs.readFile(sysconfig.filepath+'/'+file, function (err, data) {
        if(err) {
            console.error(err);
            return;
        } 
        var strArr = iconv.decode(data, 'gb2312').split("\n"); 
        //2017-05-17 07:28:12  -> R, 146, HDSF19_20170517_0715_CFT.WPD, 0, 正确 

        for(let i=0;i<strArr.length;i++){
            let insertObj = {};
            let temp = strArr[i];
            if(!temp){
                continue;
            }
            let rowArr = temp.split("->");
            let rowInfoArr = rowArr[1].split(",");


            insertObj.code = rowInfoArr[1].trim();
            let file_name = rowInfoArr[2].trim();
            let file_name_arr = file_name.split("_");
            insertObj.filetime = file_name_arr[1]+"_"+file_name_arr[2];
            insertObj.filename = file_name;
            let trans_type = rowInfoArr[0].trim();
            if(trans_type==="R"){  //接收文件
                insertObj.get_file_time = rowArr[0];
            }
            insertObj.status_ = rowInfoArr[3].trim();
            insertObj.desc_ = rowInfoArr[4].trim(); 
            insertObj.file_type = file_name_arr[3].split(".")[0];
            insertObj.trans_type = trans_type; 

            if(trans_type==="R"){  //接收文件
                sql = sql+";"+ sqlparser.insertColumnForJson("FILE_LOG",insertObj);
            }else{ //S的话是上传文件
                sql = sql+"; update FILE_LOG set dispatch_file_time='"+rowArr[0]+"' where filename='"+file_name+"'";
            } 
            

            //前端推送文件传输信息
            emitter.emit(
                "file_listener",
                file_name_arr[3].split(".")[0],
                trans_type==="R"?"down":"up",
                rowInfoArr[3].trim()
            );

        }
        //sql = sqlparser.insertColumnForJson("PJ",insertObj);
        conn.execNonQuery(sql.substr(1),function(err,res){
            if(err){
                console.error(err);
                return;
            }
            console.log("保存成功");
            fs.rename(sysconfig.filepath+'/'+file,sysconfig.backup+'/'+file,function(err){
                if(err){
                    console.error(err);
                } 
            });
        }) 
    });
});

// let fs = require("fs");
// var iconv = require('iconv-lite');  
// fs.readFile("/Users/zhy/WebstormProjects/calculate/ftpfile/SQSF10_20151111_0215_RN.WPD",  function (err, data) {
//     if(err) {
//         console.error(err);
//         return;
//     } 
//     var str = iconv.decode(data, 'gb2312'); 
//     console.log(str.split("\n").length);
// });
 

emitter.on('timerun', function() {
    fs.readdir(sysconfig.filepath, function (err, files) {
        if(err) {
            console.error(err);
            return;
        } else {  
            for(let i=0;i<files.length;i++){
                let file = files[i];
                if(file.indexOf("_RN")>0||file.indexOf("_RQ")>0||file.indexOf("_PJ")>0){
                    let arr = file.split("_");
                    let file_type = arr[3].split(".")[0];
                    if(file_type==="RN"){ //处理日内数据导入
                        emitter.emit("save_rn_plan",file);
                    }
                    if(file_type==="RQ"){ //处理日前数据导入
                        emitter.emit("save_rq_plan",file);
                    }
                    if(file_type==="PJ"){ //评价
                        emitter.emit("save_pj",file);
                    }
                }else if(file.indexOf("FileTrans")===0){  //文件上传日志解析与保存
                    let arr = file.split("_");
                    let file_type = arr[3].split(".")[0];
                    if(file_type==="LOG"){
                        emitter.emit("save_file_log",file);
                    }
                }else if(file.indexOf("General")===0){  //通讯日志文件
                    emitter.emit("general_file_log",file);
                }else{
                    fs.rename(sysconfig.filepath+'/'+file,sysconfig.backup+'/'+file,function(err){
                        if(err){
                            console.error(err);
                        } 
                    });
                }
            }
        }
    });
});




