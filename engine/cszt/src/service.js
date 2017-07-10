let sqlparser = require("lifekit-mysqlhelper").Sqlparser(); 
let db = sysconfig.db;
let conn = require("lifekit-mysqlhelper").dbhelper(db.dbname,db.server,db.port,db.uid,db.pwd);

function service(net){ 

    net.data.status = {
        dq:{down:0,up:0},
        cdq:{down:0,up:0},
        cft:{down:0,up:0},
        nwp:{down:0,up:0},
        fj:{down:0,up:0},
        jx:{down:0,up:0}
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
            //console.dir(rows.length);
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
 
    this.getFileStatus = function(){ 
        dayStatus('DQ','R'); //日数据接收规则，八点之后还没上送算异常
        dayStatus('DQ','S'); //日数据上送规则，八点之后还没上送算异常
        dayStatus('NWP','R'); //日数据接收规则，八点之后还没上送算异常
        dayStatus('NWP','S'); //日数据上送规则，八点之后还没上送算异常
        dayStatus('JX','R'); //日数据接收规则，八点之后还没上送算异常
        dayStatus('JX','S'); //日数据上送规则，八点之后还没上送算异常

        fifteenStatus('CDQ','R'); //15分钟据接收规则，向前推半个小时，看有没有这个区间的文件上来
        fifteenStatus('CDQ','S'); //15分钟据接收规则，向前推半个小时，看有没有这个区间的文件上来

        fiveStatus('CFT','R');//5分钟据接收规则，向前推20分钟，看有没有这个区间的文件上来
        fiveStatus('CFT','S');//5分钟据接收规则，向前推20分钟，看有没有这个区间的文件上来
        fiveStatus('FJ','R');//5分钟据接收规则，向前推20分钟，看有没有这个区间的文件上来
        fiveStatus('FJ','S');//5分钟据接收规则，向前推20分钟，看有没有这个区间的文件上来 

    };



    net.data.fileList = [];  

    this.getEchartsData = function(data,callback){
        let sql = sqlparser.queryWithWhere("file_log",
        "get_file_time like '"+data+"%' and file_type in ('DQ','CDQ','CFT','FJ','NWP','JX') order by filetime asc"); 
        
        conn.execDataSet(sql,function(error,rows){ 
            if(error){
                console.error(error);
            }
            net.data.fileList = [];
            let resObj = {
                DQ:{success:0,fail:0},
                CDQ:{success:0,fail:0},
                CFT:{success:0,fail:0},
                FJ:{success:0,fail:0},
                NWP:{success:0,fail:0},
                JX:{success:0,fail:0}
            };
            for(let i=0;i<rows.length;i++){
                let row = rows[i]; 
                if(row["status_"]=="0"){  //成功 
                    resObj[row["file_type"]].success++;
                }else{ //失败
                    resObj[row["file_type"]].fail++;
                }
            }
            callback(resObj);
        });
        
    }

    this.tablechange = function(data){
        let filetype = data.file_type;
        let date = data.date;
        if(filetype=="DQ"||filetype==="NWP"||filetype==="JX"){ //日期加一天
            date = date.replace(/-/g,"/");
            date = new Date(date);
            date.addDays(1);
            date = date.pattern("yyyyMMdd");
        }else{
            date = date.replace(/-/g,"");
        }
        let sql = sqlparser.queryWithWhere("file_log",
        "filetime like '"+date+"%' and file_type='"+filetype+"' order by filetime asc");   
        conn.execDataSet(sql,function(error,rows){ 
            if(error){
                console.error(error);
            }
            let res = [];
            if(filetype==="DQ"||filetype==="NWP"||filetype==="JX"){ //只有一个文件
                if(rows.length>0){
                    let _time = rows[0].filetime.split("_")[1]; 
                    _time = _time.substr(0,2)+":"+_time.substr(2,2); 
                    rows[0]["filetime"] = _time;
                }else{
                    rows.push({
                        "filetime":"00:00",
                        "filename":"",
                        "get_file_time":"",
                        "dispatch_file_time":"",
                        "desc_":"未接收"
                    });
                }
                res = rows;
            }else if(filetype==="CDQ"){ //96个文件，15分钟一个
                let _times = getJSLData();
                res = rowFactory(_times,rows); 
            }else if(filetype==="CFT"||filetype==="FJ"){ //288个文件，五分钟一个
                let _times = getEBBData();
                res = rowFactory(_times,rows); 
            }
            net.data.fileList = res; 
        });
    }

    this.init = function(ctx,parms){
        // if(ctx.session.user){
        //     return ctx.render("engine/cszt/web/index.ejs", ctx.session.user);
        // }else{
        //     return ctx.redirect('/login');
        // }
        return ctx.render("engine/cszt/web/index.ejs", {});
    }

    this.logout = function(ctx){
        ctx.session.user = null;
        return ctx.body = "success";
    }


    function rowFactory(_times,rows){ 
        let res = [];
        let rowsObj = {};
        for(let i=0;i<rows.length;i++){
            let row = rows[i];
            rowsObj[row.filetime.split("_")[1]] = row; 
        }
        for(let i=0;i<_times.length;i++){
            let _time = _times[i];
            if(rowsObj[_time]){ 
                temp_time = _time.substr(0,2)+":"+_time.substr(2,2);  
                rowsObj[_time]["filetime"] = temp_time
            }else{
                let temp_time = _time.substr(0,2)+":"+_time.substr(2,2);  
                rowsObj[_time] = {
                    "filetime":temp_time,
                    "filename":"",
                    "get_file_time":"",
                    "dispatch_file_time":"",
                    "desc_":"未接收"
                }
            }
        }
        for(let i=0;i<_times.length;i++){
            res.push(rowsObj[_times[i]]);
        }
        return res;
    }

    //获取九十六个时间刻度（每个小时的 00 15 30 45）
    function getJSLData() {
        var res = [];
        for (var i = 0; i < 24; i++) {
            for (j = 0; j < 4; j++) {
                var column = (i > 9 ? (i + "") : ('0' + i)) + "" + (j == 0 ? "00" : (j * 15));
                res.push(column);
            }
        }
        return res;
    }

    //获取288个时间刻度（每个小时的 0 5 10 15 20 25......）
    function getEBBData() {
        var res = [];
        for (var i = 0; i < 24; i++) {
            for (j = 0; j < 12; j++) {
                var column = (i > 9 ? (i + "") : ('0' + i)) + "" + (j == 0 ? "00" : (j==1?"05":(j * 5)));
                res.push(column);
            }
        }
        return res;
    }

}

module.exports = service;