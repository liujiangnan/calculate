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
        jx:{down:0,up:0},
        rq:0,
        rn:0,
        txht:0,
        txdd:0
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
        if(ctx.session.user){
            return ctx.render("engine/yxjk/web/index.ejs", ctx.session.user);
        }else{
            return ctx.redirect('/login');
        }
    }

    this.getEchartsData = function(data,callback){ 
        getPlanData("rq_plan",data,function(rq){
            getPlanData("rn_plan",data,function(rn){
                net.data.jhList = creatPlanTable(rq,rn);
                callback({rq:rq,rn:rn});
            });
        });  
    }

    this.logout = function(ctx){
        ctx.session.user = null;
        return ctx.body = "success";
    }
    

}

module.exports = service;