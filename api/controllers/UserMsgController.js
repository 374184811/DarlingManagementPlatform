/**
 * UserMsgController
 *
 * @description :: Server-side logic for managing usermsgs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


    /**
     * 用户消息列表
     * tokenId 用户tokenid
     * mId 用户id
     * num 每次获取消息数量 非必传
     * page 页码，第几页 非必传
     * `UserMsgController.index()`
     */
    index: function (req, res) {
        var limit = req.param("num", 0);
        var page = req.param("page", 1);
        var tokenId = req.param("tokenId", 0);
        var mId = req.param("mId", 0);
        
        this.redisGet(tokenId, mId, function (err, token) {
            if (err) return res.negotiate(err);
            var member = utility.decodeToken(token);
            var tableName = "usermsg_" + (member.id % 50);
            
            UserMsgprototype.query("show tables like '"+tableName+"'",function (err,table) {
                if(err) return res.negotiate(err);
                
                if(table&&table.length>0){
                    var sql = "select id,title,content,storeid,senderid,sendername,sendavatar,rid,receiver,type,createdAt,updatedAt,status,sign from " + tableName + " where rid=" + member.id+" ";
                    sql+=" UNION select id,question as title,answer as content,0 as storeid,replyid as senderid,replyer as sendername,reply_avatar as sendavatar,askid as rid,asker as receiver,3 as type,createdAt,replytime as updatedAt,if(a_status,1,0) as status,id as sign from question_answer where askid="+member.id +" AND r_status=2 order by createdAt DESC";
                    var offset=0;
                    if(limit){
                        offset=(page-1)*limit;
                        sql+=" limit "+offset+","+limit;
                    }

                    UserMsgprototype.query(sql, function (err, records) {
                        if (err) return res.negotiate(err);
                        if (records.length > 0) {
                            return res.json({
                                code: 200,
                                msg: "",
                                data: records
                            });
                        } else {
                            return res.json({
                                code: 400,
                                msg: "没有数据",
                            });
                        }
                    });
                }else{
                    return res.json({
                        code: 400,
                        msg: "没有数据",
                    });
                }
            });

        });

    },
    /**
     * 获取消息总数
     * tokenId 用户tokenid
     * mId 用户id
     * `UserMsgController.getMsgCount()`
     */
    getMsgCount:function(req,res){

        console.log('getMsgCount. This is the function entry. ',req.allParams());

        var allParams = req.allParams();
        var status = allParams.status || 0;

        var userInfo = redis.getUserInfo();
        var id = userInfo.id || allParams.mId;

        console.log('userInfo. ',userInfo);

        var tableName = "usermsg_" + (id % 50);
        console.log('queryShowTab. ',"show tables like '"+tableName+"'");
        UserMsgprototype.query("show tables like '"+tableName+"'",function (err,list) {
            if (err) return;
            console.log('cb_tag1: The result of this insert is shown came out. check it out: ',list);

            var sqlQueryUserMsg = "select count(id) as count from " + tableName + " where rid=" + id+" AND status="+status;
                sqlQueryUserMsg+=" UNION ALL select count(id) as count from question_answer where askid="+id+" AND a_status !=1 AND r_status=2";
                console.log('sqlQueryUserMsg. check it out. ',sqlQueryUserMsg);

            UserMsgprototype.query(sqlQueryUserMsg, function (err, l) {
                if (err) return;
                
                console.log('cb_tag2_xian: The result of this insert is shown came out. check it out: ',l);
                return res.json({
                    code: 200,
                    msg: "",
                    data: l[0]["count"] + l[1]["count"]
                });
            });

        });
        
        // this.redisGet(tokenId, mId, function (err, userdata) {
        //     if (err) return res.negotiate(err);
        //     var member = utility.decodeToken(userdata);
        //     var tableName = "usermsg_" + (member.id % 50);
        //     UserMsgprototype.query("show tables like '"+tableName+"'",function (err,list) {
        //         if(err) return res.negotiate(err);

        //         var sql = "select count(id) as count from " + tableName + " where rid=" + member.id+" AND status="+status;
        //         sql+=" UNION ALL select count(id) as count from question_answer where askid="+member.id+" AND a_status !=1 AND r_status=2";
        //         console.log('sqlQueryUserMsg. check it out, ',sql);
        //         UserMsgprototype.query(sql, function (err, list) {
        //             if (err) return res.negotiate(err);
        //             console.log('1_xian');
        //             return res.json({
        //                 code: 200,
        //                 msg: "",
        //                 data: list[0]["count"] + list[1]["count"]
        //             });
        //         });
        //     });

        // });





        // console.log(req.path,req.allParams());
        // var tokenId = req.param("tokenId", 0);
        // var mId = req.param("mId", 0);
        // var status = req.param("status", 0);
        
        // this.redisGet(tokenId, mId, function (err, token) {
        //     if (err) return res.negotiate(err);
        //     var member = utility.decodeToken(token);
        //     console.log('member. ',member);
        //     var tableName = "usermsg_" + (member.id % 50);
        //     console.log('tableName. ',tableName);
        //     UserMsgprototype.query("show tables like '"+tableName+"'",function (err,table) {
        //         if(err) return res.negotiate(err);
        //         if(table&&table.length>0){
        //             var sql = "select count(id) as count from " + tableName + " where rid=" + member.id+" AND status="+status;
        //             sql+=" UNION ALL select count(id) as count from question_answer where askid="+member.id+" AND a_status !=1 AND r_status=2";
        //             console.log(sql);
        //             UserMsgprototype.query(sql, function (err, records) {
        //                 if (err) return res.negotiate(err);
                        
        //                 if (records.length > 0) {
        //                     console.log(records);
        //                     return res.json({
        //                         code: 200,
        //                         msg: "",
        //                         data: records[0]["count"]+records[1]["count"]
        //                     });
        //                 } else {
        //                     return res.json({
        //                         code: 400,
        //                         msg: "没有数据",
        //                     });
        //                 }
        //             });
        //         }
        //     });

        // });
    },
    /**
     * 查看某条消息
     * tokenId 用户tokenid
     * mId 用户id
     * id 消息id
     * `UserMsgController.view()`
     */
    view: function (req, res) {
        var tokenId = req.param("tokenId", 0);
        var mId = req.param("mId", 0);
        var name=req.param("name",0);
        this.redisGet(tokenId, mId, function (err, token) {
            if (err) return res.negotiate(err);
            var member = utility.decodeToken(token);
            name=name.replace(/[^0-9a-zA-Z]/g,"");
            var tableName = "usermsg_" + (member.id % 50);
                UserMsgprototype.query("show tables like '"+tableName+"'",function (err,table) {
                    if (err) return res.negotiate(err);
                    if (table && table.length > 0) {
                        var sql = "select id,content,storeid,senderid,sendername,rid,receiver,type,createdAt,updatedAt,status,sign from " + tableName + " where rid=" + member.id+" AND  sign='"+name+"'";

                        UserMsgprototype.query(sql, function (err, records) {
                            if (err) return res.negotiate(err);
                            if (records.length > 0) {
                                var sql="update "+tableName+" set status=1 where rid="+member.id+" AND  sign='"+name+"'";
                                UserMsgprototype.query(sql, function (err, record) {
                                    
                                    if (err) return res.negotiate(err);
                                    return res.json({
                                        code: 200,
                                        msg: "",
                                        data: records
                                    });
                                });

                            } else {
                                return res.json({
                                    code: 400,
                                    msg: "没有数据",
                                });
                            }
                        });
                    }
                });

        });
    },
    /**
     * 删除消息
     * @param req
     * @param res
     * `UserMsgController.deleteMsg()`
     */
    deleteMsg:function(req,res){
        var tokenId = req.param("tokenId", 0);
        var mId = req.param("mId", 0);
        var name=req.param("name",0);
        if(!mId || !tokenId||!name){
            return res.json({
                code: 400,
                msg: "参数缺失"
            });
        }
        name=name.replace(/[^0-9a-zA-Z]/g,"");
        this.redisGet(tokenId, mId, function (err, token) {
            if (err) return res.negotiate(err);
            if (!token) {
                return res.json({
                    code: 400,
                    msg: "用户未登录"
                });
            }
            var member = utility.decodeToken(token);
            var tableName = "usermsg_" + (member.id % 50);
            UserMsgprototype.query("show tables like '"+tableName+"'",function (err,table) {
                if (err) return res.negotiate(err);
                if (table && table.length > 0) {
                    var sql = "delete from " + tableName + " where rid=" + member.id+" AND  sign='"+name+"'";

                    UserMsgprototype.query(sql, function (err, records) {
                        if (err) return res.negotiate(err);
                        if (records) {
                            return res.json({
                                code: 200,
                                msg: "删除成功",
                                data: []
                            });

                        } else {
                            return res.json({
                                code: 400,
                                msg: "删除失败",
                            });
                        }
                    });
                }
            });

        });
    },
    /**
     * 清空消息
     * @param req
     * @param res
     */
    deleteMsgs:function (req,res) {
        var tokenId = req.param("tokenId", 0);
        var mId = req.param("mId", 0);
        common.getLoginUser(req, tokenId, mId, function (err,ret) {
            if (err) return res.negotiate(err);
            if(ret&&ret.code==200){//用户已经登录
                var member=ret.user;
                async.series({
                    qa:function (cb) {
                        var sql="delete from question_answer where  askid="+member.id+" AND r_status=2";
                        Qa.query(sql,cb);

                    },
                    msg:function (cb) {
                        UserMsgprototype.destroy({rid:member.id}).exec(cb);
                    }
                },function (err) {
                    if (err) return res.negotiate(err);
                    return res.json({
                        code: 200,
                        msg: "清空成功"
                    });
                });
            }else{
                return res.json({
                    code: 400,
                    msg: "用户未登录"
                });
            }
        });

    },
    redisGet: function (key, id, callback) {
        if (!this.redisClient) {
            var client = this.redisClient = redis.client({db: 2});
        } else {
            var client = this.redisClient;
        }

        var prefix = id + ":";
        var key = prefix + key;
        client.get(key, callback);
    },
};