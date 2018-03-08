/**
 * LogController
 *
 * @description :: Server-side logic for managing logs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


    /**
     * 用户登陆日志
     *@param start string 日期的开始时间
     *@param end  string 日期的结束时间
     *@param username string 按名字搜索
     *@param sort objectArray 按什么排序
     *@param num int 每页显示多少个
     *@param offset int 多少页
     * `LogController.userLogin()`
     */
    userLogin: function (req, res) {
        var msg = msg || {};
        console.log('userLogin: This is the function entry.  check it out: ', msg);
        
        var num = req.param("num", 20);
        var offset = req.param("offset", 1);
        offset=(offset-1)*num;
        var condition=this.checkParam(req);
        var _this=this;

        async.series({
            logs:function(cb){
                Loguserlogin.find(condition).skip(offset).limit(num).exec(cb);
            },
            count:function(cb){
                Loguserlogin.count(condition).exec(cb);
            }
        },function (err,ret) {
            if(err) return res.negotiate(err);
            if(ret.count>0){
                for(var i=0;i<ret.logs.length;i++){
                    if(ret.logs[i].islogin==1){
                        ret.logs[i].operate="登陆";
                    }else if(ret.logs[i].islogin==2){
                        ret.logs[i].operate="登出";
                    }else if(ret.logs[i].islogin==3){
                        ret.logs[i].operate="注册";
                    }

                }

                return res.json({
                    "success": true,
                    "code": 200,
                    "msg": "",
                    "data": ret
                });
            }else{
                return res.json({
                    code:400,
                    msg:"暂无日志"
                });
            }
        });

    },


    /**
     * 用户操作日志
     *@param start string 日期的开始时间
     *@param end  string 日期的结束时间
     *@param username string 按名字搜索
     *@param sort objectArray 按什么排序
     *@param num int 每页显示多少个
     *@param offset int 多少页
     * `LogController.useroperate()`
     */
    useroperate: function (req, res) {
        var msg = msg || {};
        console.log('useroperate: This is the function entry.  check it out: ', msg);

        var num = req.param("num", 20);
        var offset = req.param("offset", 1);
         offset=(offset-1)*num;
        var condition=this.checkParam(req);
        var _this=this;
        async.series({
            logs:function(cb){
                Loguser.find(condition).skip(offset).limit(num).exec(cb);
            },
            count:function(cb){
                Loguser.count(condition).exec(cb);
            }
        },function (err,ret) {
            if(err) return res.negotiate(err);
            if(ret.count>0){
                ret.logs=_this.revertLogName(ret.logs);
                return res.json({
                    "success": true,
                    "code": 200,
                    "msg": "",
                    "data": ret
                });
            }else{
                return res.json({
                    code:400,
                    msg:"暂无日志"
                });
            }
        });
    },

    /**
     * 用户状态操作日志
     *@param uid int 用户id
     * `LogController.userstatus()`
     */
    userstatus:function (req,res) {
       var uid=req.param("uid");
        LogOperateUser.find({uid:uid}).exec(function (err,logs) {
            if(err) return res.negotiate(err);
            if(logs&&logs.length>0){
                return res.json({
                    code:200,
                     data:logs,
                });
            }else{
                return res.json({
                    code:200,
                    data:logs,
                });
            }
        });
    },
    /**
     * 运营商操作日志
     *@param start string 日期的开始时间
     *@param end  string 日期的结束时间
     *@param username string 按名字搜索
     *@param sort objectArray 按什么排序
     *@param num int 每页显示多少个
     *@param offset int 多少页
     * `LogController.merchant()`
     */
    merchant: function (req, res) {
        var msg = msg || {};
        console.log('merchant: This is the function entry.  check it out: ', msg);

        var num = req.param("num", 20);
        var offset = req.param("offset", 1);
        var _this=this;
        offset=(offset-1)*num;
        var condition=this.checkParam(req);
        async.series({
            logs:function(cb){
                Logmerchant.find(condition).skip(offset).limit(num).exec(cb);
            },
            count:function(cb){
                Logmerchant.count(condition).exec(cb);
            }
        },function (err,ret) {
            if(err) return res.negotiate(err);
            if(ret.count>0){
                ret.logs=_this.revertLogName(ret.logs);
                return res.json({
                    "success": true,
                    "code": 200,
                    "msg": "",
                    "data": ret
                });
            }else{
                return res.json({
                    code:400,
                    msg:"暂无日志"
                });
            }
        });

    },


    /**
     * 系统操作日志
     *@param start string 日期的开始时间
     *@param end  string 日期的结束时间
     *@param username string 按名字搜索
     *@param sort objectArray 按什么排序
     *@param num int 每页显示多少个
     *@param offset int 多少页
     * `LogController.system()`
     */
    system: function (req, res) {
        var msg = msg || {};
        console.log('system: This is the function entry.  check it out: ', msg);

        var num = req.param("num", 20);
        var offset = req.param("offset", 1);
        offset=(offset-1)*num;
        var condition=this.checkParam(req);
        var grpid=req.param("group",false);
        var _this=this;

        if(grpid){
            condition.groupid=grpid;
        }
        async.series({
            logs:function(cb){
                Logsystem.find(condition).skip(offset).limit(num).exec(cb);
            },
            count:function(cb){
                Logsystem.count(condition).exec(cb);
            }
        },function (err,ret) {
            if(err) return res.negotiate(err);
            if(ret.count>0){
                ret.logs=_this.revertLogName(ret.logs);
                return res.json({
                    "success": true,
                    "code": 200,
                    "msg": "",
                    "data": ret
                });
            }else{
                return res.json({
                    code:400,
                    msg:"暂无日志"
                });
            }
        });

    },
    /**
     * 检查参数
     * @param req
     * @returns {{}}
     */
    checkParam:function(req){
        var msg = msg || {};
        console.log('checkParam: This is the function entry.  check it out: ', msg);

        var startTime = req.param("start", 0);
        var endTime = req.param("end", 0);
        var username = req.param("username", 0);
        var sort = req.param("sort", 0);
        var condition = {};
        var where = [];
        var date=null;
        if (startTime) {
            date={'>': startTime};
            // where.push({createAt: {'<': endTime}});
        }
        if (endTime) {
            if(startTime){
                date={'>': startTime,'<': endTime};
            }else{
                date={'<': endTime};
            }

            // where.push({createAt: {'<': endTime}});
        }
        if(date){
            condition.createdAt=date;
        }
        if (username) {
            condition.username={like:username+'%'};
        }
        if(sort) {
            for(var key in sort){
                if(sort[key]==1){
                    condition.sort[key] = "DESC";
                }else{
                    condition.sort[key] = "ASC";
                }
            }
        }else{
            condition.sort={createdAt:"DESC"};
        }

        return condition;
    },
    /**
     * 日志中各个controller action 代表的意义
     * @param logs
     * @returns {Array}
     */
    revertLogName:function(logs){
        var operates=sails.config.operatename;
        var result=[];
        logs.forEach(function (log) {
              var item=log;
            item.operate="";
            var controller=(log.controller||"").toLowerCase();
            var action=(log.action||"").toLowerCase();

                if(operates[controller]){
                    if(operates[controller][action]){
                        item.operate=operates[controller][action];
                    }
                }
                result.push(item);
        });
        return result;
    },
  
};

