/**
 * MerchantInfoController
 *
 * @description :: Server-side logic for managing merchantinfoes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var xss = require('xss');
module.exports = {


    /**
     * 已推送消息列表
     * `MerchantInfoController.index()`
     */
    index: function (req, res) {
        var mine = req.session.mine;

        var sql = "select a.*,b.receivers from(select DISTINCT title,content,storeid,senderid,sendername," +
            "createdAt,updatedAt,sign,type from usermsgprototype  where storeid=" + mine.storeid +
            "  order by updatedAt DESC,createdAt DESC) a left JOIN (select GROUP_CONCAT(receiver) as receivers,sign " +
            "from usermsgprototype where storeid=" + mine.storeid + " GROUP BY sign ) b on a.sign=b.sign  order by a.createdAt,a.updatedAt ";

        UserMsgprototype.query(sql, function (err, messages) {
            if (err) return res.negotiate(err);
            if (messages.length > 0) {
                return res.json({
                    code: 200,
                    msg: "获取成功",
                    data: messages
                });
            }
            return res.json({
                code: 400,
                msg: "没有数据"
            });
        });
    },


    /**
     *查看详情
     *
     * name string sign的值 必传
     * `MerchantInfoController.view()`
     */
    view: function (req, res) {
        var mine = req.session.mine;
        if (!mine) {
            return res.json({
                code: 400,
                msg: "需要登录"
            });
        }
        var id = req.param("name", false);
        if (!id) {
            return res.json({
                code: 400,
                msg: "id未传入"
            });
        }
        var sql = "select id,title,content,storeid,senderid,sendername,(select GROUP_CONCAT(receiver) as receivers from usermsgprototype where  sign='" +
            id + "' group by sign ) users,type,createdAt,updatedAt,sign from usermsgprototype where sign='" + id + "' LIMIT 1;";
        console.log(sql);
        UserMsgprototype.query(sql, function (err, info) {
            if (err)  return res.negotiate(err);
            if (info && info.length > 0) {
                return res.json({
                    code: 200,
                    msg: "操作成功",
                    data: info[0],
                })
            } else {
                return res.json({
                    code: 400,
                    msg: "操作失败"
                });
            }
        });
    },


    /**
     * 删除消息
     * name string sign的值 必传
     * `MerchantInfoController.delete()`
     */
    delete: function (req, res) {
        var mine = req.session.mine;
        if (!mine) {
            return res.json({
                code: 400,
                msg: "需要登录"
            });
        }
        var name = req.param("name", false);
        if (!name) {
            return res.json({
                code: 400,
                msg: "id未传入"
            });
        }
        UserMsgprototype.destroy({sign: name}).exec(function (err, info) {
            if (err)  return res.negotiate(err);
            if (info.length > 0) {
                return res.json({
                    code: 200,
                    msg: "操作成功"
                })
            } else {
                return res.json({
                    code: 400,
                    msg: "操作失败"
                });
            }
        });
    },


    /**
     * 发送消息
     * content string 内容
     * type  int  类型是【0普通,1系统】
     * sendid int 发送者id
     * sender  string 发送者名字
     * target  string 用户id组成的字符串，用,分割
     * `MerchantInfoController.send()`
     */
    send: function (req, res) {
        var mine = req.session.mine;
        if (!mine) {
            return res.json({
                code: 400,
                msg: "用户未登录"
            });
        }
        var content = req.param("content");
        var sendid = req.param("sendid", mine.id);
        var sender = req.param("sender", "");
        var sendavatar = req.param("sendavatar", 0);
        var target = req.param("target", 0);
        // console.log("------------------");
        // console.log(mine);
        // console.log("------------------");
        content = xss(content);
        var type = mine.storeid == 0 ? 1 : 0;
        if (type == 0) {
            if (!target) {
                return res.json({
                    code: 400,
                    msg: "目标用户不能为空"
                });
            }
            sender = mine.shop_name;
            sendavatar = mine.logo;
        }
        var uids = target.split(",");
        condition = {id: uids};
        var sign = utility.generateMixed(3, false);
        sign += Math.ceil((new Date()).getTime() / 1000);
        var detail = content.replace(/<[^>]+>/g, '');

        var title = detail.substring(0, 40);
        Account.find(condition).exec(function (err, accounts) {
            if (err) return res.negotiate(err);
            if (accounts.length > 0) {
                //console.log(accounts);
                async.series({
                    online: function (next) {

                        console.log("保存数据");
                        async.mapSeries(accounts, function (item, cb) {
                            var kVal = {};
                            kVal.senderid = sendid;
                            kVal.sendername = sender;
                            kVal.rid = item.id;
                            kVal.receiver = item.usermobile;
                            if (mine.storeid == 0) {
                                kVal.type = 1
                            } else {
                                kVal.type = 0;
                            }

                            kVal.status = 0;
                            kVal.storeid = mine.storeid;
                            kVal.title = title;
                            kVal.content = content;
                            kVal.sign = sign;
                            kVal.sendavatar = sendavatar;

                            kVal.createdAt = kVal.updatedAt = (new Date()).Format("yyyy-MM-dd hh:mm:ss");
                            UserMsgprototype.sendMsg(kVal, cb);
                            // cb(err, null);
                        }, next);
                    },
                    save: function (next) {

                        var extra = {
                            sign: sign,
                            sender: sender,
                            sendavatar: sendavatar
                        };
                        // var aliasIOSArray = [], aliasAndArray = [];
                        // for (var i = 0; i < accounts.length; i++) {
                        //     if (i % 50 == 0) {
                        //         var targetAndUids = [];
                        //         var targetIOSUids = [];
                        //     }
                        //     if (i / 50 == 0 || (accounts.length < 50 && i == accounts.length)) {
                        //         aliasAndArray.push(targetAndUids);
                        //         aliasIOSArray.push(targetIOSUids);
                        //     }
                        //     var IOSAlias = '@"' + accounts[i].id + '@darling.com"';
                        //     var AndAlias = accounts[i].id + "@darling.com";
                        //     targetAndUids.push(AndAlias);
                        //     targetIOSUids.push(IOSAlias);
                        //
                        // }
                        var sendUsers=[];
                        accounts.forEach(function (ac) {
                            sendUsers.push("dl_"+ac.id);
                        });
                        common.pushMessage(sendUsers.join(","),title,content,extra,next);

                    }
                }, function (err, ret) {
                    console.log(err,ret);
                    return res.json({
                        code: 200,
                        msg: "发送成功"
                    });
                });

            } else {
                return res.json({
                    code: 400,
                    msg: "你要发送的用户不存在"
                });
            }
        });

    },
    /**
     *添加推送账号
     * @param name 用户帐号名
     * @param gid  用户组id
     * @param avatar 用户图像
     */
    AddMember: function (req, res) {
        var mine = req.session.mine;
        if (!mine) {
            return res.json({
                code: 400,
                msg: "用户没有登录"
            });
        }
        var mem = {};
        mem.name = req.param("name");
        mem.gid = req.param("gid");
        mem.avatar = req.param("avatar");
        if (!mem.name || !mem.gid) {
            return res.json({
                code: 400,
                msg: "参数不全",
            })
        }
        PushAccount.create(mem).exec(function (err, user) {
            if (err) {

                return res.json({code:400,msg:"服务器错误,可能名称重复"});
            }
            if (user) {
                return res.json({
                    code: 200,
                    msg: "添加成功",
                })
            } else {
                return res.json({
                    code: 400,
                    msg: "添加失败",
                })
            }
        });
    },
    /**
     * 上传推送账号
     * @param avatar file 图像
     * @param req
     * @param res
     */
    uploadAvatar: function (req, res) {
        upload.uploadFile(req, res, "avatar", "avatar");
    },
    /**
     * 获取推送账号
     * @param req
     * @param res
     */
    getMember: function (req, res) {
        var mine = req.session.mine;
        if (!mine) {
            return res.json({
                code: 400,
                msg: "用户没有登录"
            });
        }
        var condition={};

        if(mine.groupid!=1){
            condition={gid: mine.groupid};
        }
        PushAccount.find(condition).exec(function (err, accounts) {
            if (err)  return res.json({code: 400, msg: "服务器错误"});
            if (accounts && accounts.length) {
                return res.json({
                    code: 200,
                    data: accounts,
                });
            } else {
                return res.json({
                    code: 400,
                    msg: "没有该用户"
                })
            }
        });
    },
    /**
     * 编辑推送账号
     * @param id int 账号id
     * @param name 用户帐号名
     * @param gid  用户组id
     * @param avatar 用户图像
     * @param req
     * @param res
     */
    editMember:function(req,res){
        var mine = req.session.mine;
        if (!mine) {
            return res.json({
                code: 400,
                msg: "用户没有登录"
            });
        }
        var mem = {};
        var id=req.param("id");
        mem.name = req.param("name");
        mem.gid = req.param("gid");
        mem.avatar = req.param("avatar");
        if (!id) {
            return res.json({
                code: 400,
                msg: "参数不全",
            })
        }
        for(var key in mem){
            if(mem[key]){
                delete mem[key];
            }
        }
        var condition={};
        if(mine.groupid!=1){
            condition={gid: mine.groupid,id:id};
        }else{
            condition={id:id};
        }
        PushAccount.update(condition).set(mem).exec(function (err, user) {
            if (err) {
                return res.json({code:400,msg:"服务器错误,可能名称重复"});
            }
            if (user) {
                return res.json({
                    code: 200,
                    msg: "添加成功",
                })
            } else {
                return res.json({
                    code: 400,
                    msg: "添加失败",
                })
            }
        });
    },
    /**
     * 删除推送账号
     * @param id int 账号id
     * @param req
     * @param res
     */
    deleteMember:function(req,res){
        var mine = req.session.mine;
        if (!mine) {
            return res.json({
                code: 400,
                msg: "用户没有登录"
            });
        }

        var id=req.param("id");
        if(!id){
            return res.json({
                code:400,
                msg:"没有传递id"
            });
        }

        var sql="delete from push_account where id="+id;
        if(mine.groupid!=1){
          sql+=" AND gid="+mine.groupid;
        }

        PushAccount.query(sql,function(err,member){
            if(err){
                return res.json({code:400,msg:"删除失败1001"});
            }
            return res.json({
                code:200,
                msg:"删除成功"
            });

        });
    }


};

