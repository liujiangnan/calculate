let sqlparser = require("lifekit-mysqlhelper").Sqlparser(); 
let db = sysconfig.db;
let conn = require("lifekit-mysqlhelper").dbhelper(db.dbname,db.server,db.port,db.uid,db.pwd);

let xlsx = require('node-xlsx');
let fs = require('fs'); 
let path = require('path');

function service(net){

    net.data.status = {
        dq:{down:0,up:0},
        cdq:{down:0,up:0},
        cft:{down:0,up:0},
        nwp:{down:0,up:0},
        fj:{down:0,up:0},
        jx:{down:0,up:0},
        rq:0,
        rn:0,
        txht:1,
        txdd:1
    };

    function dayStatus(file_type,flag){
        let time = new Date();
        let hour = time.getHours();
        if(hour>=8){
            time.addDays(1);
        }  
        time = time.pattern("yyyyMMddHHmmss");
        let ymd = time.substr(0,8); 
        let mi = time.substr(10,2); 

        let sql = sqlparser.queryWithWhere("FILE_LOG","filetime like '"+ymd+"%' and file_type='"+file_type+"'");  
        if(flag=='S'){
            sql = sqlparser.queryWithWhere("FILE_LOG","filetime like '"+ymd+"%' and file_type='"+file_type+"' and trans_type='S'");  
        }
        
        conn.execDataSet(sql,function(error,rows){ 
            if(rows.length==0){
                if(flag=='R'){
                    if(file_type=='RQ'){
                        net.data.status.rq = 1;
                    }else{
                        net.data.status[file_type.toLowerCase()].down = 1;
                    } 
                }else{
                    net.data.status[file_type.toLowerCase()].up = 1;
                }
            }else{
                if(flag=='R'){ 
                    if(file_type=='RQ'){
                        net.data.status.rq = 0;
                    }else{
                        net.data.status[file_type.toLowerCase()].down = 0;
                    } 
                }else{
                    net.data.status[file_type.toLowerCase()].up = 0;
                }
            }
        });
    }

    function fifteenStatus(file_type,flag){
        let start = new Date()
        start.addMinutes(-30);
        start = start.pattern("yyyyMMddHHmmss");
        let ymd = start.substr(0,8);
        let start_h = start.substr(8,2);
        let start_m = start.substr(10,2); 
        let end = new Date().pattern("yyyyMMddHHmmss");
        let end_h = end.substr(8,2);
        let end_m = end.substr(10,2);
        let where = " file_type='"+file_type+"' ";
        if(flag=='S'){
             where = where+" and trans_type='"+flag+"' "
        }
        if((start_m-0)>0&&(start_m-0)<=15){
            where = where + " and ( filetime='"+ymd+"_"+start_h+"15' or filetime='"+ymd+"_"+start_h+"30')";
        }else if((start_m-0)>15&&(start_m-0)<=30){
            where = where + " and ( filetime='"+ymd+"_"+start_h+"30' or filetime='"+ymd+"_"+start_h+"45')";
        }else if((start_m-0)>30&&(start_m-0)<=45){
            where = where + " and ( filetime='"+ymd+"_"+start_h+"45' or filetime='"+ymd+"_"+end_h+"00')";
        }else if((start_m-0)>45||(start_m-0)==0){
            where = where + " and ( filetime='"+ymd+"_"+end_h+"00' or filetime='"+ymd+"_"+end_h+"15')";
        }
        let sql = sqlparser.queryWithWhere("FILE_LOG",where);  
        conn.execDataSet(sql,function(error,rows){ 
            if(rows.length==0){
                if(flag=='R'){
                    if(file_type=='RN'){
                        net.data.status.rn = 1;
                    }else{
                        net.data.status[file_type.toLowerCase()].down = 1;
                    }  
                }else{
                    net.data.status[file_type.toLowerCase()].up = 1;
                }
            }else{
                if(flag=='R'){
                    if(file_type=='RN'){
                        net.data.status.rn = 0;
                    }else{
                        net.data.status[file_type.toLowerCase()].down = 0;
                    }  
                }else{
                    net.data.status[file_type.toLowerCase()].up = 0;
                }
            }
        });
    }

    function fiveStatus(file_type,flag){
        let start = new Date();
        start.addMinutes(-20);
        start = start.pattern("yyyyMMddHHmmss");
        let ymd = start.substr(0,8);
        let start_h = start.substr(8,2);
        let start_m = start.substr(10,2); 
        let end = new Date().pattern("yyyyMMddHHmmss");
        let end_h = end.substr(8,2);
        let end_m = end.substr(10,2); 
        let where = " file_type='"+file_type+"' ";
        if(flag=='S'){
             where = where+" and trans_type='"+flag+"' "
        }
        if((start_m-0)>0&&(start_m-0)<=5){
            where = where + " and ( filetime='"+ymd+"_"+start_h+"05' or filetime='"+ymd+"_"+start_h+"10' or filetime='"+ymd+"_"+start_h+"15' or filetime='"+ymd+"_"+start_h+"20')";
        }else if((start_m-0)>5&&(start_m-0)<=10){
            where = where + " and ( filetime='"+ymd+"_"+start_h+"10' or filetime='"+ymd+"_"+start_h+"15' or filetime='"+ymd+"_"+start_h+"20' or filetime='"+ymd+"_"+start_h+"25')";
        }else if((start_m-0)>10&&(start_m-0)<=15){
            where = where + " and ( filetime='"+ymd+"_"+start_h+"15' or filetime='"+ymd+"_"+start_h+"20' or filetime='"+ymd+"_"+start_h+"25' or filetime='"+ymd+"_"+start_h+"30')";
        }else if((start_m-0)>15&&(start_m-0)<=20){
            where = where + " and ( filetime='"+ymd+"_"+start_h+"20' or filetime='"+ymd+"_"+start_h+"25' or filetime='"+ymd+"_"+start_h+"30' or filetime='"+ymd+"_"+start_h+"35')";
        }else if((start_m-0)>20&&(start_m-0)<=25){
            where = where + " and ( filetime='"+ymd+"_"+start_h+"25' or filetime='"+ymd+"_"+start_h+"30' or filetime='"+ymd+"_"+start_h+"35' or filetime='"+ymd+"_"+start_h+"40')";
        }else if((start_m-0)>25&&(start_m-0)<=30){
            where = where + " and ( filetime='"+ymd+"_"+start_h+"30' or filetime='"+ymd+"_"+start_h+"35' or filetime='"+ymd+"_"+start_h+"40' or filetime='"+ymd+"_"+start_h+"45')";
        }else if((start_m-0)>30&&(start_m-0)<=35){
            where = where + " and ( filetime='"+ymd+"_"+start_h+"35' or filetime='"+ymd+"_"+start_h+"40' or filetime='"+ymd+"_"+start_h+"45' or filetime='"+ymd+"_"+start_h+"50')";
        }else if((start_m-0)>35&&(start_m-0)<=40){
            where = where + " and ( filetime='"+ymd+"_"+start_h+"40' or filetime='"+ymd+"_"+start_h+"45' or filetime='"+ymd+"_"+start_h+"50' or filetime='"+ymd+"_"+start_h+"55')";
        }else if((start_m-0)>40&&(start_m-0)<=45){
            where = where + " and ( filetime='"+ymd+"_"+start_h+"45' or filetime='"+ymd+"_"+start_h+"50' or filetime='"+ymd+"_"+start_h+"55' or filetime='"+ymd+"_"+end_h+"00')";
        }else if((start_m-0)>45&&(start_m-0)<=50){
            where = where + " and ( filetime='"+ymd+"_"+start_h+"50' or filetime='"+ymd+"_"+start_h+"55' or filetime='"+ymd+"_"+end_h+"00' or filetime='"+ymd+"_"+end_h+"05')";
        }else if((start_m-0)>50&&(start_m-0)<=55){
            where = where + " and ( filetime='"+ymd+"_"+start_h+"55' or filetime='"+ymd+"_"+end_h+"00' or filetime='"+ymd+"_"+end_h+"05' or filetime='"+ymd+"_"+end_h+"10')";
        }else if((start_m-0)>55||(start_m-0)==0){
            where = where + " and ( filetime='"+ymd+"_"+end_h+"00' or filetime='"+ymd+"_"+end_h+"05' or filetime='"+ymd+"_"+end_h+"10' or filetime='"+ymd+"_"+end_h+"15')";
        }
        let sql = sqlparser.queryWithWhere("FILE_LOG",where);  
        conn.execDataSet(sql,function(error,rows){ 
            if(rows.length==0){
                if(flag=='R'){
                    net.data.status[file_type.toLowerCase()].down = 1;
                }else{
                    net.data.status[file_type.toLowerCase()].up = 1;
                }
            }else{
                if(flag=='R'){
                    net.data.status[file_type.toLowerCase()].down = 0;
                }else{
                    net.data.status[file_type.toLowerCase()].up = 0;
                }
            }
        });
    }
 
    this.getFileStatus = function(callback){ 
        dayStatus('DQ','R'); //日数据接收规则，八点之后还没上送算异常
        dayStatus('DQ','S'); //日数据上送规则，八点之后还没上送算异常
        dayStatus('NWP','R'); //日数据接收规则，八点之后还没上送算异常
        dayStatus('NWP','S'); //日数据上送规则，八点之后还没上送算异常
        dayStatus('JX','R'); //日数据接收规则，八点之后还没上送算异常
        dayStatus('JX','S'); //日数据上送规则，八点之后还没上送算异常
        dayStatus('RQ','R'); //日数据上送规则，八点之后还没上送算异常

        fifteenStatus('CDQ','R'); //15分钟据接收规则，向前推半个小时，看有没有这个区间的文件上来
        fifteenStatus('CDQ','S'); //15分钟据接收规则，向前推半个小时，看有没有这个区间的文件上来
        fifteenStatus('RN','R'); //15分钟据接收规则，向前推半个小时，看有没有这个区间的文件上来

        fiveStatus('CFT','R');//5分钟据接收规则，向前推20分钟，看有没有这个区间的文件上来
        fiveStatus('CFT','S');//5分钟据接收规则，向前推20分钟，看有没有这个区间的文件上来
        fiveStatus('FJ','R');//5分钟据接收规则，向前推20分钟，看有没有这个区间的文件上来
        fiveStatus('FJ','S');//5分钟据接收规则，向前推20分钟，看有没有这个区间的文件上来

    };

    net.data.jhList = []; 

    function creatPlanTable(rq,rn){
        var resList = [];
        var count = 0;
        for(let i=0;i<24;i++){
            let obj = {};
            let hour = i>9?(i+""):("0"+i);
            obj["hour"] = hour;
            for(let j=0;j<4;j++){
                let val = (rq.length<count?"-":rq[count])+"/"+(rn.length<count?"-":rn[count]);
                if(j===0){
                    obj["zero"] = val;
                }else if(j===1){
                    obj["fifteen"] = val;
                }else if(j===2){
                    obj["thirty"] = val;
                }else{
                    obj["fortyfive"] = val;
                }
                count++;
            }
            resList.push(obj);
        }
        return resList;
    }
 
    function getPlanData(table,date,callback){
        let sql = sqlparser.queryWithWhere(table,"plan_time like '"+date+"%'");  
        conn.execDataSet(sql,function(error,rows){ 
            var data = [];
            for(let i=0;i<rows.length;i++){
                data.push(rows[i]["plan_val"]);
            } 
            if(data.length<96){
                let len = 96-data.length;
                for(let i=0;i<len;i++){
                    data.push("-");
                }
            }
            callback(data);
        }); 
    } 

    this.init = function(ctx,parms){
        // if(ctx.session.user){
        //     return ctx.render("engine/yxjk/web/index.ejs", ctx.session.user);
        // }else{
        //     return ctx.redirect('/login');
        // }

        return ctx.render("engine/yxjk/web/index.ejs", {});
    }

    this.getEchartsData = function(data,callback){ 
        getPlanData("rq_plan",data,function(rq){
            getPlanData("rn_plan",data,function(rn){
                net.data.jhList = creatPlanTable(rq,rn);
                callback({rq:rq,rn:rn});
            });
        });  
    }

    this.exportExcel = function(data,callback){
        getPlanData("rq_plan",data,function(rq){
            getPlanData("rn_plan",data,function(rn){
                var data = [["小时","00分钟日前","00分钟日内","15分钟日前","15分钟日内","30分钟日前","30分钟日内","45分钟日前","45分钟日内"]]; 
                var count = 0;
                for(let i=0;i<24;i++){
                    let obj = [];
                    let hour = i>9?(i+""):("0"+i);
                    obj.push(hour);
                    for(let j=0;j<4;j++){
                        let val_rq = rq.length<count?"-":rq[count];
                        let val_rn = rn.length<count?"-":rn[count];
                        obj.push(val_rq);
                        obj.push(val_rn);  
                        count++;
                    }
                    data.push(obj);
                }
                var buffer = xlsx.build([{name: "发电计划", data: data}]);  
                let time = new Date().pattern("yyyy-MM-dd");
                fs.writeFile(path.join(__dirname,"./../web/downfile/发电计划下发_"+time+".xlsx"), buffer,'buffer', function(){
                    callback("/yxjk/web/downfile/发电计划下发_"+time+".xlsx");
                });  
            });
        });    
        
    }

    this.logout = function(ctx){
        ctx.session.user = null;
        return ctx.body = "success";
    }
    

}

module.exports = service;