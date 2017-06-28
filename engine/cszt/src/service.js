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
    net.data.fileList = []; 

    this.getEchartsData = function(data,callback){
        let sql = sqlparser.queryWithWhere("file_log",
        "get_file_time like '"+data+"%' and file_type in ('DQ','CDQ','CFT','FJ','NWP','JX')"); 
        conn.execDataSet(sql,function(error,rows){ 
            if(error){
                console.error(error);
            }
            net.data.fileList = rows;
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
        let sql = sqlparser.queryWithWhere("file_log",
        "get_file_time like '"+data.date+"%' and file_type='"+data.file_type+"'"); 
        conn.execDataSet(sql,function(error,rows){ 
            if(error){
                console.error(error);
            }
            net.data.fileList = rows; 
        });
    }

    this.init = function(ctx,parms){
        if(ctx.session.user){
            return ctx.render("engine/cszt/web/index.ejs", ctx.session.user);
        }else{
            return ctx.redirect('/login');
        }
    }

    this.logout = function(ctx){
        ctx.session.user = null;
        return ctx.body = "success";
    }

}

module.exports = service;