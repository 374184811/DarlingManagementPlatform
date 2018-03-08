/**
 * MerchantMsgController
 *
 * @description :: Server-side logic for managing merchantmsgs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


    /**
     *运营商查看自己的消息列表
     * @param type 消息类型， 是否已经查看 1 已查看 ,0未查看 -1 所有
     * @param num 每次获取数据条数 默认是8条
     * @param page 页数 默认是第一页
     * `MerchantMsgController.index()`
     */
    merchant: function (req, res) {

        console.log('merchant: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var userData = req.session.user;
        var allParams = req.allParams();

        var storeid = mine.storeid 
        var num = allParams.num || 8;
        var page = allParams.page || 1;
        var status = allParams.type || 0;

        var condition = {};

        condition.status = status;
        condition.rstore = storeid;
        condition.sort = { createdAt:"DESC" };

        console.log('condition. check it out. ',condition);
        MerchantMsg.find(condition).exec(function (err, list) {
            if (err) return;
            return res.json({
                code: 200,
                data: list
            });
        });

        // var mine = req.session.mine;
        // var status = req.param("type", 0);
        // var num = req.param("num", 8);
        // var page=req.param("page",1);
        // if (!mine) {
        //     return res.json({
        //         code: 400,
        //         msg: "用户未登录"
        //     });
        // }
        // var condition={rstore: mine.storeid};
        // if(status!=-1){
        //     condition.status=status;
        // }

        // condition.limit=num;
        // condition.skip=(page-1)*num;
        // condition.sort={createdAt:"DESC"};
        // console.log(condition);
        // MerchantMsg.find(condition).exec(function (err, msg) {
        //     if (err) return res.negotiate(err);
        //     if (msg && msg.length > 0) {
        //         return res.json({
        //             code: 200,
        //             data: msg
        //         });
        //     } else {
        //         return res.json({
        //             code: 400,
        //             msg: "没有数据"
        //         });
        //     }
        // });

    },

    /**
     * 添加消息
     * @param  rid 接受者id
     * @param  rname 接受者用户名
     * @param  rstore 接受者店铺id
     * @param  title 消息标题
     * @param  detailbody 消息体
     *
     * `MerchantMsgController.add()`
     */
    add: function (req, res) {
        var msg = req.allParams();
        var dat = MerchantMsg.loadData(msg);
        var mine = req.session.mine;

        if (!mine) {
            return res.json({
                code: 400,
                msg: "用户未登录"
            });
        }
        dat.sid = mine.id;
        dat.sendname = mine.username;
        dat.sendavatar = "";


        MerchantMsg.create(dat).exec(function (err, msg) {
            if (err) return res.negotiate(err);
            if (msg) {
                return res.json({
                    code: 200,
                    data: msg
                });
            } else {
                return res.json({
                    code: 400,
                    msg: "添加失败"
                });
            }
        });

    },
    /**
     * 通过商品sku 向运营商发送消息
     * @param  title 消息标题
     * @param  detailbody 消息体
     * @param req
     * @param res
     */
    sendMsgBySku:function (req,res) {
        var msg = req.allParams();
        var dat = MerchantMsg.loadData(msg);
        var mine = req.session.mine;

        var sku=req.param("sku");
        var skuObj=gcom.revertSku(sku);
        var realSku=skuObj.randomNum+"-"+skuObj.storeid+"-"+skuObj.timestamp;
        var sql="select a.userid,a.storeid,b.username from mergoodsList"+skuObj.storeid+" a left join adminuser b on a.userid=b.id where a.sku='"+realSku+"'";
        MerchantMsg.query(sql,function (err,users) {
            if (err) return res.negotiate(err);
            if(users&&users.length>0){
                var user=users[0];
                dat.sid = mine.id;
                dat.sendname = mine.username;
                dat.sendavatar = "";
                dat.rid=user.userid;
                dat.rstore=user.storeid;
                dat.username=user.username;
                MerchantMsg.create(dat).exec(function (err, msg) {
                    if (err) return res.negotiate(err);
                    if (msg) {
                        return res.json({
                            code: 200,
                            data: msg
                        });
                    } else {
                        return res.json({
                            code: 400,
                            msg: "添加失败"
                        });
                    }
                });
            }else{
                return res.json({
                    code: 400,
                    msg: "添加失败,没有该用户"
                });
            }
        });

    },
    /**
     * 查看消息
     * @param id 消息的id
     * `MerchantMsgController.view()`
     */
    view: function (req, res) {
        var mine = req.session.mine;
        var id = req.param("id");

        MerchantMsg.findOne({id: id}).exec(function (err, msg) {
            if (err) return res.negotiate(err);

            if (msg) {
                MerchantMsg.update({id:id},{status:1}).exec();
                return res.json({
                    code: 200,
                    data: msg
                });
            } else {
                return res.json({
                    code: 400,
                    msg: "没有数据"
                });
            }
        });
    },
    /**
     * 消息已查看
     * @param id int 消息id
     * @param req
     * @param res
     * @returns {*}
     */
    see:function (req,res) {
        var mine = req.session.mine;
        var id = req.param("id");
        if (!mine) {
            return res.json({
                code: 400,
                msg: "用户未登录"
            });
        }
        if (!id) {
            return res.json({
                code: 400,
                msg: "参数错误"
            });
        }
        MerchantMsg.update({id:id,rstore:mine.storeid},{status:1}).exec(function (err,ret) {
            if(err) return res.negotiate(err);
            return res.json({
                code: 200,
                data: msg
            });
        });

    },
    /**
     * @param id 消息 id
     * `MerchantMsgController.delete()`
     */
    delete: function (req, res) {
        var mine = req.session.mine;
        var id = req.param("id");
        if (!mine) {
            return res.json({
                code: 400,
                msg: "用户未登录"
            });
        }
        if (!id) {
            return res.json({
                code: 400,
                msg: "参数错误"
            });
        }
        if (mine.storeid) {
            var condition = {rstore: mine.storeid, id: id};
        } else {
            var condition = {status: 0, id: id};
        }
        MerchantMsg.destroy(condition).exec(function (err, msg) {
            if (err) return res.negotiate(err);
            if (msg && msg.length > 0) {
                return res.json({
                    code: 200,
                    data: msg
                });
            } else {
                return res.json({
                    code: 400,
                    msg: "删除失败"
                });
            }
        });
    }
};

