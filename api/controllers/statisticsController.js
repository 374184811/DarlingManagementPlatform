/**
 * StatisticsController
 *
 * @description :: Server-side logic for managing statistics
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var crypto=require("crypto");
module.exports = {
    /**
     *数据管理首页
     *@param start string 统计数据起始时间
     *@param day string 统计数据总天数
     *@param end string 统计数据结束时间
     *
     * `StatisticsController.index()`
     */
    index: function (req, res) {
        console.log(req.ip,req.allParams());

        var date = new Date();

        //累计用户
        var start = req.param("start", false);//起始时间
        var days = req.param("day", 7);//天数
        var end = req.param("end", date.Format("yyyy-MM-dd"));

        var client = redis.client({db: 5});
        if(!start){
            start=new Date((new Date()).getTime()-86400*days*1000);
            var startTime=start.Format("yyyy-MM-dd");
        }else{
            var startTime=(new Date(start)).Format("yyyy-MM-dd");
            days= ((new Date(end)).getTime()-(new Date(start)).getTime())/1000/86400;
        }
        var condition={time:{">=":startTime,"<":end}};
        var times=[];
        for(var i=days;i>0;i--){
            var d=(new Date((new Date(end)).getTime()-86400*1000*i)).Format("yyyy-MM-dd");
            times.push(d);
        }
        console.log(condition);
        StaticsticDay.find(condition).exec(function(err,dat){
            if(err) return res.negotiate(err);
            var items={
                newnuser:[],
                startup:[],
                cumulative:[],
                active:[],
            };

            if(dat&&dat.length>0){
                for(var i=0;i<times.length;i++){
                    var newuser={date:null,total:0,cnt:0},
                        startup={date:null,total:0,cnt:0},
                        active={date:null,total:0,cnt:0},
                        cumulative={date:null,total:0,cnt:0};
                    dat.forEach(function(item){

                        var curD=(new Date(item.time)).Format("yyyy-MM-dd");
                        if(curD==times[i]){
                            newuser.date=curD;
                            newuser.total+=item.total;
                            newuser.cnt+=item.reg;

                            startup.date=curD;
                            startup.total+=item.total;
                            startup.cnt+=item.startup;

                            active.date=curD;
                            active.total+=item.total;
                            active.cnt+=item.active;

                            cumulative.date=curD;
                            cumulative.total+=item.total;
                            cumulative.cnt+=item.total;
                        }

                    });
                    items.newnuser.push(newuser);
                    items.startup.push(startup);
                    items.active.push(active);
                    items.cumulative.push(cumulative);
                }
                 return res.json({
                     code:200,
                     data:items
                 });
            }else{
                return res.json({
                    code:400,
                    msg:"没有数据"
                });
            }
        });
    },
    /**
     * 总后台顶部统计数据
     * @param req
     * @param res
     */
    indexHead:function(req,res){
        console.log(req.ip,req.allParams());

        var yesterday=new Date((new Date()).getTime()-86400*1000);
        var yesterdayStr=yesterday.Format("yyyy-MM-dd 00:00:00");
        async.series({
            one:function(cb){
                StaticsticDay.find({time:yesterdayStr}).exec(cb);
            },
            two:function(cb){
                var start=new Date((new Date()).getTime()-86400*30*1000);
                var startTime=start.Format("yyyy-MM-dd");
                var endTime=(new Date()).Format("yyyy-MM-dd");
                StaticsticDay.find({time:{">=":startTime,"<":endTime}}).exec(cb);
            },
            cumulative:function (cb) {
                Account.query("select count(*) as cnt from account",cb);
            }
        },function(err,dat){
            if(err) return res.negotiate(err);
            if(dat){
                var ret={newReg:{},yesterday_startup:{},activity30:{},cumulative:dat.cumulative[0]["cnt"]||0};

                var newReg={total:0,cnt:0,precent:0},
                yesterday_startup={total:0,cnt:0,precent:0},
                activity30={total:0,cnt:0,precent:0},
                cumulative={total:0,cnt:0,precent:0};
                dat.one.forEach(function (item) {
                    newReg.cnt+=item.reg;
                    newReg.total=ret.cumulative;
                    newReg.precent=newReg.cnt/newReg.total;

                    yesterday_startup.cnt+=item.startup;
                    yesterday_startup.total=ret.cumulative;
                    yesterday_startup.precent=yesterday_startup.cnt/yesterday_startup.total;
                });

                dat.two.forEach(function(item){
                    activity30.cnt+=item.active;
                    activity30.total+=item.total;
                    activity30.precent=activity30.cnt/activity30.total;
                });
                ret.newReg=newReg;
                ret.yesterday_startup=yesterday_startup;
                ret.activity30=activity30;

                return res.json({
                    code:200,
                    data:ret,
                });
            }else{
                return res.json({
                    code:400,
                    msg:"操作失败1002"
                });
            }
        });

    },
    /**
     * 总后台渠道概要
     * @param req
     * @param res
     */
    indexChannel:function(req,res){
        console.log(req.ip,req.allParams());
        var yesterday=new Date((new Date()).getTime()-86400*1000);
        yesterdayStr=yesterday.Format("yyyy-MM-dd");
        async.series({
            newReg:function(cb){
                var sql="select count(*) as cnt,platform from account where date_format(createdAt,'%Y-%m-%d')='"+yesterdayStr+"'  group by platform";
                Account.query(sql,cb);
            },
            newregTotal:function(cb){
                var sql="select count(*) as cnt from account where date_format(createdAt,'%Y-%m-%d')='"+yesterdayStr+"'";
                Account.query(sql,cb);
            },
            active:function(cb){
                var sql="select count(*) as cnt,platform from account  where  id in (select DISTINCT userid from loguser union select DISTINCT userid from loguserlogin) group by platform ";
                Account.query(sql,cb);
            },
            regTotal:function(cb){
                var sql="select count(*) as cnt from account";
                Account.query(sql,cb);
            },
            cumulative:function(cb){
                var sql="select count(*) as cnt,platform from account group by platform ";
                Account.query(sql,cb);
            }
        },function(err,dat){
             if(err) return res.negotiate(err);
             if(dat){
                  var ret={newReg:[],active:[],cumulative:[]};
                  dat.newReg.forEach(function(item){
                       ret.newReg.push({
                           cnt:item.cnt,
                           platform:item.platform,
                           total:dat.newregTotal[0]["cnt"],
                           precent:item.cnt/dat.newregTotal[0]["cnt"]||0,
                       });
                  });
                  dat.active.forEach(function(item){
                       ret.active.push({
                           cnt:item.cnt,
                           platform:item.platform,
                           total:dat.regTotal[0]["cnt"],
                           precent:item.cnt/dat.regTotal[0]["cnt"]||0,
                       });
                  });
                  dat.cumulative.forEach(function(item){
                      ret.cumulative.push({
                          cnt:item.cnt,
                          platform:item.platform,
                          total:dat.regTotal[0]["cnt"],
                          precent:item.cnt/dat.regTotal[0]["cnt"]||0,
                      });
                  });

                  return res.json({
                     code:200,
                     data:ret,
                  });
             }else{
                 return res.json({
                     code:400,
                     msg:"操作失败1002"
                 });
             }
        });
   },
    /**
     * 用户属性
     * StatisticsController.user()
     */
    userinfo: function (req, res) {
        console.log(req.ip,req.allParams());
        var os = req.param("device", false);
        var type = req.param("type", false);
        var where = null;
        if(!os||!type){
            return res.json({
                code:400,
                msg:"参数错误，device和type未传递"
            });
        }
        switch (os) {
            case "android":
                where = " where deviceinfo!='ios' AND LOWER(deviceinfo) not like 'iphone%' AND deviceinfo!=''";
                break;
            case "ios":
                where = " where deviceinfo='ios' or LOWER(deviceinfo) like 'iphone%'";
            case "vr"://VR手机
                where = " where LOWER(deviceinfo) like '%protruly%'";
                break;
            case "robot":
                where = " where LOWER(deviceinfo) like '%robot%'";
                break;
        }
        switch (type) {
            case "sex":
                var sql = "select count(*) as sex_count,sex from account";
                if (where) {
                    sql += where;
                }
                sql += " GROUP BY sex ORDER BY sex_count DESC;";
                break;
            case "province":
                var sql = "select count(*) as province_count,province from account ";
                if (where) {
                    sql += where;
                }
                sql += " GROUP BY province ORDER BY province_count DESC;";
                break;
            case "city":
                var sql = "select count(*) as city_count,city from account ";
                if (where) {
                    sql += where;
                }
                sql += " GROUP BY city ORDER BY city_count DESC;";
                break;
            case "client":
                sql = "select count(*) as android from account where deviceinfo!='ios' AND LOWER(deviceinfo) not like 'iphone%' AND deviceinfo!='' union ";
                sql += " select count(*) as ios from account where deviceinfo='ios' or LOWER(deviceinfo) like 'iphone%'";
                break;
            case "device":
                var sql = "select count(*) as cnt,deviceinfo from account ";
                if (where) {
                    sql += where;
                }
                sql += "  GROUP BY deviceinfo";
                break;
        }
        Account.query(sql, function (err, result) {
            if (err) return res.negotiate(err);
            if (result && result.length > 0) {
                return res.json({
                    code: 200,
                    data: result[0]
                });
            } else {
                return res.json({
                    code: 400,
                    msg: "操作失败",
                })
            }

        });
    },
    /**
     * 用户分析
     *@param start string 统计数据起始时间
     *@param end string 统计数据结束时间
     *@param days string 统计数据总天数
     *@param day 日期2016-12-16
     *@param type 0日期区间 1计算小时(day必传) 2星期 3日期
     *@param ptype 1新增用户 2活跃用户
     *@param req束时间+
     *@param res
     */
    user: function (req, res) {
        console.log(req.ip,req.allParams());
        var date = new Date();
        var start = req.param("start",false);
        var days = req.param("days", 7);
        var end = req.param("end", date.Format("yyyy-MM-dd"));
        var type = req.param("type", 0);
        var day = req.param("day");
        var device = req.param("device");
        var ptype = req.param("ptype");
        var startTime=0,endTime=0;
        if(type==1){
            if(!day){
                return res.json({
                    code:400,
                    msg:"参数day未传递"
                });
            }
            day=(new Date(day)).Format("yyyy-MM-dd");
            startTime=day+" 00:00:00";
            endTime=day+" 23:00:00";
        }else{
            if(!start){
                start=new Date((new Date()).getTime()-86400*1000*days);
            }
             startTime=new Date(start).Format("yyyy-MM-dd");
             endTime=new Date(end).Format("yyyy-MM-dd");
        }

        var query=null;
        if(type==0){
              query=StaticsticDay.find({time:{">=":startTime,"<":endTime}});
        }else if(type==1){
            query=StaticsticHour.find({time:{">=":day+" 00:00:00","<=":day+" 23:59:59"}});
        }else if(type==2){
            query=StaticsticWeek.find({time:{">=":startTime,"<":endTime}});
        }else if(type==3){
            query= StaticsticMonth.find({time:{">=":startTime,"<=":endTime}});
        }
        if(!query){
            return res.json({code:400,msg:"查询失败"});
        }
        console.log("===========================");
        console.log(startTime,endTime);
        console.log("===========================");
        async.series({
            count:function(cb){
                query.exec(cb);
            },
            total:function (cb) {
                if(type==1){
                    Account.countByCreatedAt({">=":day+" 00:00:00","<=":day+" 23:59:59"}).exec(cb);
                }else{
                    Account.countByCreatedAt({">=":startTime,"<":endTime}).exec(cb);
                }
            },
            all:function (cb) {
                if(type==1){
                    var sql="select SUM(total) as cnt,DATE_FORMAT(time,'%Y-%m-%d %H') as time from staticstic_hour where DATE_FORMAT(time,'%Y-%m-%d')='"+day+"'  GROUP BY DATE_FORMAT(time,'%Y-%m-%d %H')";
                }else{
                    var sql="select SUM(total) as cnt,DATE_FORMAT(time,'%Y-%m-%d') as time  from staticstic_day where  DATE_FORMAT(time,'%Y-%m-%d')<'" + endTime + "' AND  DATE_FORMAT(time,'%Y-%m-%d')>='" + startTime + "' GROUP BY DATE_FORMAT(time,'%Y-%m-%d')";
                }
                Account.query(sql,cb);
            }
        },function (err,dat) {
            if(err)return res.negotiate(err);
            var total_count=dat.total;

            var items={all:[],total:total_count,ios:[],android:[],vr:[],robot:[],weixin:[]};
            if(dat){
                 console.log(dat.total);
                dat.count.forEach(function (item) {
                    if(type==1){
                        var time=(new Date(item.time)).Format("yyyy-MM-dd hh");
                    }else{
                       var time=(new Date(item.time)).Format("yyyy-MM-dd");
                    }
                    var pItem={
                        time:time,
                        total:total_count
                    };
                    pItem.cnt=item.reg;
                    if(ptype==2){
                        pItem.cnt=item.active;
                    }else if(ptype==3){
                        pItem.cnt=  item.slient;
                    }else if(ptype==4){
                        pItem.cnt=  item.startup;
                    }
                    pItem.precent=pItem.cnt/total_count||0;

                    switch(item.device){
                        case 1:
                            items.ios.push(pItem);
                            break;
                        case 2:
                            items.android.push(pItem);
                            break;
                        case 3:
                            items.vr.push(pItem);
                            break;
                        case 4:
                            items.robot.push(pItem);
                            break;
                        case 5:
                            items.weixin.push(pItem);
                            break;
                    }
                });
                items.all=dat.all;
                return res.json({
                    code:200,
                    data:items
                });
            }else{
                return  res.json({
                    code:400,
                    msg:"没有数据",
                })
            }
        });

    },
    /**
     * 用户参入度
     *@param start string 统计数据起始时间
     *@param type int 统计数据起始时间//1 hour,2 day,3=>week,4=>month
     *@param days string 统计数据总天数
     *@param end string 统计数据结束时间
     * `StatisticsController.involved()`
     */
    involved: function (req, res) {
        console.log(req.ip,req.allParams());

        var date = new Date();
        var start = req.param("start");
        var days = req.param("days", 7);
        var type = req.param("type", 1);
        var end = req.param("end", date.Format("yyyy-MM-dd"));
        if(!start){
            start=new Date((new Date()).getTime()-86400*days*1000);
            var startTime=start.Format("yyyy-MM-dd");
        }else{
            var startTime=(new Date(start)).Format("yyyy-MM-dd");
            days= ((new Date(end)).getTime()-(new Date(start)).getTime())/1000/86400;
         }
        var endTime=(new Date(end)).Format("yyyy-MM-dd");
       var days=((new Date(endTime)).getTime()-(new Date(startTime)).getTime())/86400/1000;
          days=Math.ceil(days);
          var times=[];
         for(var i=days;i>0;i--){
                var day =new Date((new Date(endTime)).getTime()-86400*1000*i);
              times.push(day.Format("yyyy-MM-dd"));
         }

        StaticsticInvole.findByDate({">=":startTime,"<=":endTime}).exec(function (err,invole) {
            if(err) return res.negotiate(err);
            if(invole&&invole.length){
                var ret={all:[],ios:[],android:[],vr:[],robot:[],weixin:[]};
                times.forEach(function(time){
                      var pItem={date:time,p1:0,p2:0,p3:0,p4:0,p5:0,p6:0};
                    invole.forEach(function (item) {
                        var itemDate=(new Date(item.date)).Format("yyyy-MM-dd");
                        if(itemDate==time){
                            item.date=time;
                            pItem.p1+=item.p1;
                            pItem.p2+=item.p2;
                            pItem.p3+=item.p3;
                            pItem.p4+=item.p4;
                            pItem.p5+=item.p5;
                            pItem.p6+=item.p6;
                            switch(item.device){
                                case 1:
                                    ret.ios.push(item);
                                    break;
                                case 2:
                                    ret.android.push(item);
                                    break;
                                case 3:
                                    ret.vr.push(item);
                                    break;
                                case 4:
                                    ret.robot.push(item);
                                    break;
                                case 5:
                                    ret.weixin.push(item);
                                    break;
                            }
                        }

                    });
                    ret.all.push(pItem);
                });
                return res.json({
                    code:200,
                    data:ret
                });
            }else{
                return res.json({
                    code:400,
                    msg:"没有数据",
                })
            }

        });


    },
    /**
     * 启动页面
     * @param req
     * @param res
     * @constructor
     */
    IncrStartUp:function (req,res) {
        console.log(req.ip,req.allParams());

        var ip=req.ip.substring("::ffff:".length);
        var md5=crypto.createHash("md5");
        var time=(new Date()).getTime()/1000;
        var keySet=md5.update(ip+time).digest("hex");
        keySet=(new Date()).Format("yyyyMMdd.hh")+":"+keySet;
        return res.json({
            code:200,
            data:{secret:keySet,time:time}}
        );
    },

    PreIncrStartUp:function (req,res) {
        return this.IncrStartUp(req, res);
    },

    AnalyzeDataByHour:function (req,res) {
        var ip=req.ip.substring("::ffff:".length);
        if(!ip||ip!="127.0.0.1"){
            return res.end("error");
        }
        var _this=this;
        var times=[];
        var today=new Date();
        var todayStr=today.Format("yyyy-MM-dd");
        var tomorrow= new Date(today.getTime()+86400*1000);
        var tomorrowStr=tomorrow.Format("yyyy-MM-dd");
        for(var i=0;i<24;i++){
            var startStr=""+i;
            var endStr=""+(i+1);
            if(i<23){
                times.push({
                    start:todayStr+" "+(startStr.length<2?"0"+startStr:startStr)+":00:00",
                    end:todayStr+" "+(endStr.length<2?"0"+endStr:endStr)+":00:00",
                });
            }else{
                times.push({
                    start:todayStr+" "+(startStr.length<2?"0"+startStr:startStr)+":00:00",
                    end:tomorrowStr+" 00:00:00",
                });
            }
        }

        async.mapSeries(times,function (hourRange,cb) {
            _this.AnalyzeDataSaved(res,hourRange.start,1,hourRange,cb);
        },function (err,ret) {
            if(err) return res.negotiate(err);
            if(ret){
                return res.json({
                    code:200,
                    msg:"保存成功"
                });
            }else{
                return res.json({
                    code:400,
                    msg:"保存失败"
                });
            }
        });
    },
    AnalyzeDataByDay:function (req,res) {
        var ip=req.ip.substring("::ffff:".length);
        if(!ip||ip!="127.0.0.1"){
            return res.end("error");
        }
        this.AnalyzeDataSaved(res,null,2);
    },
    AnalyzeDataByWeek:function (req,res) {
        var ip=req.ip.substring("::ffff:".length);
        if(!ip||ip!="127.0.0.1"){
            return res.end("error");
        }
        this.AnalyzeDataSaved(res,null,3);
    },
    AnalyzeDataByMonth:function (req,res) {
        var ip=req.ip.substring("::ffff:".length);
        if(!ip||ip!="127.0.0.1"){
            return res.end("error");
        }
        var today=new Date();
        var yesterday=new Date(today.getTime()/1000-86400*1000);
        var yesterdayStr=yesterday.Format("yyyy-MM-dd");
        this.AnalyzeDataSaved(res,null,4,{
            start:yesterday.Format("yyyy-MM")+"-01",
            end:yesterdayStr
        });
    },

    AnalyzeDataSaved:function (res,day,type,dateRange,next) {
        var format1=null,format2=null;
        var today=new Date();
        switch (type){
            case 1:
                format1="yyyy-MM-dd hh", format2="%Y-%m-%d %H";
                var execfunction=function (item,callback) {
                    StaticsticHour.create(item).exec(callback);
                };
                break;
            case 2:
                format1="yyyy-MM-dd", format2="%Y-%m-%d";
                var execfunction=function (item,callback) {
                    StaticsticDay.create(item).exec(callback);
                };
                break;
            case 3:
                var today=new Date();
                var oldWeek=new Date(today.getTime()-86400*1000*7);
                var weekendStr=oldWeek.Format("yyyy-MM-dd");
                format1="yyyy-MM-dd"; format2="%Y-%m-%d";

                dateRange={ start:weekendStr,end:today.Format("yyyy-MM-dd")};
                var execfunction=function (item,callback) {
                    console.log(item);
                    StaticsticWeek.create(item).exec(callback);
                };
                break;
            case 4:
                format1="yyyy-MM-dd"; format2="%Y-%m-%d";
                // dateRange={start:weekendStr,end:today.Format("yyyy-MM-dd")};
                var execfunction=function (item,callback) {
                    StaticsticMonth.create(item).exec(callback);
                };
                break;
        }

        this.AnalyzeData(day,format1,format2,dateRange,execfunction, function (err,ret) {
            if(err) return res.negotiate(err);
            if(next){
                next(err,ret);
            }else{
                if(ret){
                    return res.json({
                        code:200,
                        msg:"保存成功"
                    });
                }else{
                    return res.json({
                        code:400,
                        msg:"保存失败"
                    });
                }
            }
        });
    },
    AnalyzeData:function (date,format1,format2,dateRange,callback,next) {
        var day=new Date(),_this=this;
        if(date){
            day=new Date(date);
        }
        console.log(date,format1,format2,dateRange);
        var hour= day.Format(format1);//"yyyy-MM-dd HH"
        function queryStatisticHour(condition,next,type) {
            async.series({
                reg:function (cb) { //
                    if(dateRange){
                        var sql="select count(*) as cnt from account where DATE_FORMAT(createdAt,'"+format2+"')>='"+dateRange.start+"' AND DATE_FORMAT(createdAt,'"+format2+"')<'"+dateRange.end +"' "+condition.reg;
                    }else{
                        var sql="select count(*) as cnt from account where DATE_FORMAT(createdAt,'"+format2+"')='"+hour+"' "+condition.reg;
                    }
                    console.log("-----------------统计注册用户人数------------------");
                    console.log(sql);
                    console.log("-----------------统计注册用户人数------------------");
                    Creator.query(sql,cb);
                },
                activity:function (cb) {
                    if(dateRange){
                        var one=" WHERE DATE_FORMAT(createdAt,'"+format2+"')>='"+dateRange.start+"' AND DATE_FORMAT(createdAt,'"+format2+"')<'"+dateRange.end +"'";
                        var two=" WHERE DATE_FORMAT(createdAt,'"+format2+"')>='"+dateRange.start+"' AND DATE_FORMAT(createdAt,'"+format2+"')<'"+dateRange.end +"'";
                    }else{
                        var one=" WHERE DATE_FORMAT(createdAt,'"+format2+"')='"+hour+"'";
                        var two=" WHERE DATE_FORMAT(createdAt,'"+format2+"')='"+hour+"'";
                    }
                    var sql="select count(*) as cnt from account where id in (select DISTINCT userid from loguser " +one+
                        " union select  DISTINCT userid from loguserlogin "+two+")  " + condition.active;
                    console.log("-----------------统计活跃用户------------------");
                    console.log(sql);
                    console.log("------------------统计活跃用户-----------------");
                    Creator.query(sql,cb);
                },
                total:function (cb) {
                    if(dateRange){
                        var sql="select count(*) as cnt from account WHERE DATE_FORMAT(createdAt,'"+format2+"')<'"+dateRange.end +"' "+condition.total;
                    }else{
                        var sql="select count(*) as cnt from account where  DATE_FORMAT(createdAt,'"+format2+"')<='"+hour+"' "+condition.total;
                    }
                    console.log("-----------------统计总用户------------------");
                    console.log(sql);
                    console.log("------------------统计总用户-----------------");
                    Creator.query(sql,cb);
                },
                startup:function (cb) {
                    if(dateRange){
                        var where=" where DATE_FORMAT(a.createdAt,'"+format2+"')<'"+dateRange.end+"' AND DATE_FORMAT(a.createdAt,'"+format2+"')>='"+dateRange.end+"' "+condition.startup;
                    }else{
                        var where=" where DATE_FORMAT(a.createdAt,'"+format2+"')='"+hour+"' "+condition.startup;
                    }
                    var sql="select count(*) as cnt from (select token from loguser a left join account b on a.userid=b.id "+where+"  GROUP BY a.token) as c;";
                    console.log("-----------------启动用户数------------------");
                    console.log(sql);
                    console.log("---------------启动用户数--------------------");
                    Creator.query(sql,cb);
                }
            },function (err,ret) {
                var reg=ret.reg&&ret.reg.length>0?ret.reg[0]["cnt"]||0:0;
                var active=ret.activity&&ret.activity.length>0?ret.activity[0]["cnt"]||0:0;
                var total=ret.total&&ret.total.length>0?ret.total[0]["cnt"]||0:0;
                var slient=total-active;
                var startup=ret.startup&&ret.startup.length>0?ret.startup[0]["cnt"]||0:0;
                var item={
                    reg:reg,
                    active:active,
                    slient:slient,
                    total:total,
                    startup:startup,
                    time:hour,
                    device:type
                };
                callback(item,next);
            });
        };

        async.series({
            iso:function (next) {
                queryStatisticHour({
                    reg:" AND (deviceinfo='ios' or LOWER(deviceinfo) like 'iphone%')",
                    active:" AND (deviceinfo='ios' or LOWER(deviceinfo) like 'iphone%')",
                    total:" AND (deviceinfo='ios' or LOWER(deviceinfo) like 'iphone%')",
                    startup:" AND (b.deviceinfo='ios' or LOWER(b.deviceinfo) like 'iphone%')",
                },next,1);
            },
            android:function (next) {
                queryStatisticHour({
                    reg:" AND  (deviceinfo!='ios' AND LOWER(deviceinfo) not like 'iphone%' AND deviceinfo!='')",
                    active:" AND  (deviceinfo!='ios' AND LOWER(deviceinfo) not like 'iphone%' AND deviceinfo!='')",
                    total:" AND  (deviceinfo!='ios' AND LOWER(deviceinfo) not like 'iphone%' AND deviceinfo!='')",
                    startup:" AND  (b.deviceinfo!='ios' AND LOWER(b.deviceinfo) not like 'iphone%' AND b.deviceinfo!='')",
                },next,2);
            },
            vr:function (next) {
                queryStatisticHour({
                    reg:" AND  LOWER(deviceinfo) like '%protruly%'",
                    active:" AND  LOWER(deviceinfo) like '%protruly%'",
                    total:" AND  LOWER(deviceinfo) like '%protruly%'",
                    startup:" AND  LOWER(b.deviceinfo) like '%protruly%'",
                },next,3);
            },
            robot:function (next) {
                queryStatisticHour({
                    reg:" AND LOWER(deviceinfo) like '%robot%'",
                    active:" AND LOWER(deviceinfo) like '%robot%'",
                    total:" AND LOWER(deviceinfo) like '%robot%'",
                    startup:" AND LOWER(b.deviceinfo) like '%robot%'",
                },next,4);
            },
            weixin:function (next) {
                queryStatisticHour({
                    reg:" AND deviceinfo like 'wechat'",
                    active:" AND deviceinfo like 'wechat'",
                    total:" AND deviceinfo like 'wechat'",
                    startup:" AND b.deviceinfo like 'wechat'",
                },next,5);
            }
        },next);
    },
    /**
     * 分析用户参入
     * @constructor
     */
    AnalyzeInvoleData:function (req,res) {
        var ip=req.ip.substring("::ffff:".length);
        if(!ip||ip!="127.0.0.1"){
            return res.end("error");
        }
            var day=new Date();
            this.AnalyzeInvoleByDay(day.Format("yyyy-MM-dd 00:00:00"),function (err,ret) {
                if(err) return res.negotiate(err);
                if(ret){
                    return res.json({
                        code:200,
                        msg:"保存成功",
                    });
                }

            });
    },
    AnalyzeInvoleByDay:function (day,next) {
        var _this=this;
        async.series({
            ios:function (cb) {
                _this.AnalyzeInvoleByDayAndDevice(day,"where (c.deviceinfo='ios' or LOWER(c.deviceinfo) like 'iphone%')",function (item) {
                    item.device=1;
                    StaticsticInvole.create(item).exec(cb);
                });
            },
            android:function (cb) {
                _this.AnalyzeInvoleByDayAndDevice(day,"where (c.deviceinfo!='ios' AND LOWER(c.deviceinfo) not like 'iphone%' AND c.deviceinfo!='')",function (item) {
                    item.device=2;
                    StaticsticInvole.create(item).exec(cb);
                });
            },
            vr:function (cb) {

                _this.AnalyzeInvoleByDayAndDevice(day," where  LOWER(c.deviceinfo) like '%protruly%'",function (item) {
                    item.device=3;
                    StaticsticInvole.create(item).exec(cb);
                });
            },
            robot:function (cb) {
                _this.AnalyzeInvoleByDayAndDevice(day," where  LOWER(c.deviceinfo) like '%robot%'",function (item) {
                    item.device=4;
                    StaticsticInvole.create(item).exec(cb);
                });
            },
            weixin:function (cb) {
                _this.AnalyzeInvoleByDayAndDevice(day," where  LOWER(c.deviceinfo) like 'wechat'",function (item) {
                    item.device=5;
                    StaticsticInvole.create(item).exec(cb);
                });
            }

        },next);

    },
    AnalyzeInvoleByDayAndDevice:function (day,condition,next) {
       var  sql="select a.cnt,a.token,b.userid from (select count(*) as cnt,token from loguser where DATE_FORMAT(createdAt,'%Y-%m-%d')='"+day+"' GROUP BY token) a left join loguser b on a.token=b.token LEFT JOIN account c on c.id=b.userid "+condition;

        Creator.query(sql,function (err,ret) {
            var dat={
                date:day,
                p1:0,
                p2:0,
                p3:0,
                p4:0,
                p5:0,
                p6:0,
            };
            if(ret&&ret.length){
                for(var i=0;i<ret.length;i++){
                    if(ret[i]["cnt"]<=2){
                      dat.p1=dat.p1+1;
                    }else if(ret[i]["cnt"]<=5&&ret[i]["cnt"]>=3){
                        dat.p2=dat.p2+1;
                    }else if(ret[i]["cnt"]<=9&&ret[i]["cnt"]>=6){
                        dat.p3=dat.p3+1;
                    }else if(ret[i]["cnt"]<=29&&ret[i]["cnt"]>=10){
                        dat.p4=dat.p4+1;
                    }else if(ret[i]["cnt"]<=99&&ret[i]["cnt"]>=30){
                        dat.p5=dat.p5+1;
                    }else if(ret[i]["cnt"]>=100){
                        dat.p6=dat.p6+1;
                    }
                }
            }

            next(dat);
        });
    },
    saveDayAnalyzeToDb:function (req,res) {
        var days=((new Date()).getTime()-(new Date("2016-10-24")).getTime())/1000/86400;
        var days= Math.ceil(days);
        var _this=this;
        var times=[];
        for(var i=days;i>=0;i++){
            var day=new Date((new Date()).getTime()/1000-i*86400);
            times.push(day.Format("yyyy-MM-dd"));
        }
        console.log("日期:");

         return res.json({
             data:times,
         });
    },
    saveWeekAnalyzeToDb:function (req,res) {
        var days=((new Date()).getTime()-(new Date("2016-10-24")).getTime())/1000/86400;
        var days= Math.ceil(days);
        var _this=this;
        var times=[];
        for(var i=days;i>=0;i++){
            var day=new Date((new Date()).getTime()/1000-i*86400);
            if(day.getDay()==0){
                times.push(day);
           }
        }
        async.mapSeries(times,function (item,cb) {
            //AnalyzeDataSaved:function (day,type,dateRange,next)
            _this.AnalyzeDataSaved(item,3,null,cb);
        },function (err,ret) {
            if(err) return res.negotiate(err);
            if(ret){
                return res.json({
                    code:200,
                    msg:"保存成功"
                });
            }else{
                return res.json({
                    code:400,
                    msg:"保存失败"
                });
            }
        });
    },
    saveHourAnalyzeToDb:function (req,res) {
        var days=((new Date()).getTime()-(new Date("2016-10-24")).getTime())/1000/86400;
        var days= Math.ceil(days);
        var _this=this;
        var times=[];
        for(var i=days;i>=0;i++){
            var day=new Date((new Date()).getTime()/1000-i*86400);
            for(var j=0;j<24;j++){
                times.push(day.Format("yyyy-MM-dd "+j));
            }
        }
        async.mapSeries(times,function (item,cb) {
            //AnalyzeDataSaved:function (day,type,dateRange,next)
            _this.AnalyzeDataSaved(item,1,null,cb);
        },function (err,ret) {
            if(err) return res.negotiate(err);
            if(ret){
                return res.json({
                    code:200,
                    msg:"保存成功"
                });
            }else{
                return res.json({
                    code:400,
                    msg:"保存失败"
                });
            }
        });
    },
    /**
     * statisticsController.js
     * 统计联网激活用户数
     * @param devId string 设备类型唯一标示 100个长度
     * @param os [android|1] [ios|0]
     * @param model string 机型 20个长度以内
     * @param ov string 手机系统版本 10个长度以内
     * @param version app版本
     */
    activate:function (req,res) {
        var devId=req.param("devId");
        var os=req.param("os");
        var model=req.param("model");
        var version=req.param("version");
        var ov=req.param("ov");
        var platform=req.param("platform");
        if(!devId||!os||!model||!version){
            return res.json({
                code:400,
                msg:"参数不全"
            });
        }
        var atvData={};
        atvData.dev=devId;
        atvData.model=model;
        atvData.os=((os+'').toLowerCase()=="ios"||os==0)?0:1;
        atvData.version=version;
        StaticsticActivate.findOne(atvData).exec(function (err,activate) {
            if(err) return res.negotiate(err);
            if(!activate){
                atvData.ov=ov;
                atvData.platform=platform;
                StaticsticActivate.create(atvData).exec(function (err,atv) {
                    if(err) return res.negotiate(err);
                    return res.json({
                        code:200,
                        msg:"保存成功"
                    });
                });
            }else{
                return res.json({
                    code:200,
                    msg:"非第一次激活"
                });
            }
        });
    },
    /**
     * 保存统计数据到mysql数据库
     * @param req
     * @param res
     */
    saveActivate:function (req,res) {
        var yesterday=(new Date(((new Date()).getTime()-86400*1000))).Format("yyyy-MM-dd");
        var client=redis.client({db:8});
        client.get("activate_"+yesterday,function (err,cnt) {
            if(err) return res.negotiate(err);
            var record={};
            console.log(cnt);
            record.a_count=parseInt(cnt)||0;
            record.day=yesterday;
            console.log(record);
            StaticsticActivate.create(record).exec(function (err,dat) {
                if(err) return res.negotiate(err);
                client.del("activate_"+yesterday);
                return res.json({
                    code:200,
                    msg:"操作成功",
                });
            });
        });
    }
};

