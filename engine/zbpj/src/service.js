let sqlparser = require("lifekit-mysqlhelper").Sqlparser(); 
let db = sysconfig.db;
let conn = require("lifekit-mysqlhelper").dbhelper(db.dbname,db.server,db.port,db.uid,db.pwd);

function service(net){ 
  
    net.data.fileList = [];  

    this.getEchartsData = function(data,callback){ 
        let sql = sqlparser.queryWithWhere("pj",
        "rq like '"+data+"%' order by rq asc"); 
        let resObj = {
            sjcj:[],
            dq:[],
            cdq:[],
            ddycy:[],
            yg:[],
            zf:[]
        }
        conn.execDataSet(sql,function(error,rows){
            if(error){
                console.error(error);
            }
            if(rows){
                net.data.fileList = rows;
                let rqFlag = 1;
                for(let i=0;i<rows.length;i++){
                    let row = rows[i];
                    let rq = row.rq.substr(8,2)-0;
                    for(let j=rqFlag;j<=rq;j++){
                        if(j==rq){
                            resObj.sjcj.push(row.sjcjdf);
                            resObj.dq.push(row.dqdf);
                            resObj.cdq.push(row.cdqdf);
                            resObj.ddycy.push(row.ddycydf);
                            resObj.yg.push(row.ygdf);
                            resObj.zf.push(row.zfdf);
                        }else{
                            resObj.sjcj.push("-");
                            resObj.dq.push("-");
                            resObj.cdq.push("-");
                            resObj.ddycy.push("-");
                            resObj.yg.push("-");
                            resObj.zf.push("-");
                        }
                    }
                    rqFlag = rq+1;
                    
                } 
            }
            callback(resObj);
        });
    }

    this.init = function(ctx,parms){
        // if(ctx.session.user){
        //     return ctx.render("engine/zbpj/web/index.ejs", ctx.session.user);
        // }else{
        //     return ctx.redirect('/login');
        // }

        return ctx.render("engine/zbpj/web/index.ejs", {});
    }

    this.logout = function(ctx){
        ctx.session.user = null;
        return ctx.body = "success";
    }
    

}

module.exports = service;