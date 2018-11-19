let sqlparser = require("lifekit-mysqlhelper").Sqlparser(); 
let db = sysconfig.db;
let conn = require("lifekit-mysqlhelper").dbhelper(db.dbname,db.server,db.port,db.uid,db.pwd);

function service(net){ 
  
    net.data.fileList = [];   

    this.tablechange = function(data){ 
        let date = data.date; 
        date = date.replace(/-/g,"");
        let sql = "select * from KH f where f.file_time like '"+date+"%' order by f.file_time asc";

        console.dir(sql);
        conn.execDataSet(sql,function(error,rows){ 
            if(error){
                console.error(error);
            } 
            net.data.fileList = rows; 
        });
    }

    this.init = function(ctx,parms){
        // if(ctx.session.user){
        //     return ctx.render("engine/cszt/web/index.ejs", ctx.session.user);
        // }else{
        //     return ctx.redirect('/login');
        // }
        return ctx.render("engine/dqyc/web/index.ejs", {});
    }

    this.logout = function(ctx){
        ctx.session.user = null;
        return ctx.body = "success";
    } 

}

module.exports = service;