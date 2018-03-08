/**
 * MerchantNotifyController
 *
 * @description :: Server-side logic for managing Merchantnotifies
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var schedule = require('node-schedule');

module.exports = {
    /**
     * 显示运营商公告列表
     *@param start datetime 起始时间 非必须
     *@param end   datetime 起始时间 非必须
     *@param title  string 标题  非必须
     *@param destroy int 是否已经删除  非必须
     *@param num  int 每次显示多少页  非必须
     *@param page  int 页码  非必须
     * `MerchantNotifyController.index()`
     */
    index: function (req, res) {

        console.log('index: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var allParams = req.allParams();

        var end = allParams.end || 0;
        var num = allParams.num || 0;
        var page = allParams.page || 1;
        var title = allParams.title || "";
        var start = allParams.start || 0;
        var destroy = allParams.destroy || 0;

        // var condition;
        
        // condition = {};

        //condition.isdelete = destroy;
        //condition.createdAt = {">": start};
        //condition.title = {"like": "'" + title + "%'"};
        //condition.sort=[{updatedAt:"DESC"},{createdAt:"DESC"}];
        //condition.sort = [{updatedAt:"DESC"},{createdAt:"DESC"}];
        //condition.createdAt = start > 0 ? {"<": end, ">": start} : {"<": end};

        var queryNoticeinfoSql = "select * from noticeinfo order by updatedAt DESC,createdAt DESC";
        console.log('queryNoticeinfoSql. check it out. ',queryNoticeinfoSql);
        Noticeinfo.query(queryNoticeinfoSql, function (err, list) {
            if (err)  return res.negotiate(err);
            console.log('cb_tag1: The result of this find is shown came out. check it out: ',list.length);
            return res.json({
                code: 200,
                msg: "获取成功",
                data: list
            });
        });
        // query = Noticeinfo.find(condition);
        // query.exec(function (err, list) {
        //     if (err)  return res.negotiate(err);
        //     return res.json({
        //         code: 200,
        //         msg: "获取成功",
        //         data: list
        //     });
        // });

        // var mine = req.session.mine;
        // if (!mine) {
        //     return res.json({
        //         code: 400,
        //         msg: "需要登录"
        //     });
        // }
        // var condition = {};
        // var start = req.param("start", false);
        // var end = req.param("end", false);
        // var title = req.param("title", false);
        // var isDelete = req.param("destroy", false);
        // var num = req.param("num", 0);
        // var page = req.param("page", 1);
        // if (isDelete !== false) {
        //     condition.isdelete = isDelete
        // }
        // if (start) {
        //     condition.createdAt = {">": start};
        // }
        // if (end) {
        //     if (start) {
        //         condition.createdAt = {"<": end, ">": start};
        //     } else {
        //         condition.createdAt = {"<": end};
        //     }
        // }
        // if (title) {
        //     condition.title = {"like": "'" + title + "%'"};
        // }
        // condition.sort=[{updatedAt:"DESC"},{createdAt:"DESC"}];
        // query = Noticeinfo.find(condition);
        // console.log(condition);
        // if (num) {
        //     offset = (page - 1) * num;
        //     query.limit(num).skip(offset);
        // }
        // query.exec(function (err, notifices) {
        //     if (err)  return res.negotiate(err);
        //     if (notifices.length > 0) {
        //         return res.json({
        //             code: 200,
        //             msg: "获取成功",
        //             data: notifices
        //         });
        //     }
        //     return res.json({
        //         code: 400,
        //         msg: "获取失败,没有数据"
        //     });
        // });
    },
    /**
     * 运营商获取自己公告列表
     * `MerchantNotifyController.index()`
     */
    merchant: function (req, res) {
        var mine = req.session.mine;
        if (!mine) {
            return res.json({
                code: 400,
                msg: "需要登录"
            });
        }
        var condition = {};
        var date=new Date();

        var start=date.Format("yyyy-MM-dd");
        console.log(start,new Date(start));
        var time=(new Date(start)).getTime()/1000;
        condition.publishtime = {"<": date.getTime()/1000};
        console.log(condition);
        Noticeinfo.find(condition).exec(function (err, notifices) {
            if (err)  return res.negotiate(err);
            if (notifices.length > 0) {
                return res.json({
                    code: 200,
                    msg: "获取成功",
                    data: notifices
                });
            }
            return res.json({
                code: 400,
                msg: "获取失败,没有数据"
            });
        });
    },

    /**
     * 添加公告
     * publishtype int 0立即发布 1定时发布 非必须
     * publishtime  datetime 发布时间 非必须
     * title  string 标题 非必须
     * detailbody  string 内容 必须
     * `MerchantNotifyController.add()`
     */
    add: function (req, res) {
        var mine = req.session.mine, _this = this;
        if (!mine) {
            return res.json({
                code: 400,
                msg: "需要登录"
            });
        }
        var set = {}, date;
        set.userid = mine.id;
        set.publishtype = req.param("publishtype");
        date = req.param("publishtime", new Date());
        set.publishtime = new Date(date).getTime() / 1000;//Format("yyyy-MM-dd hh:mm:ss.S");
        console.log(set.publishtime);
        set.title = req.param("title", "");
        set.detailbody = req.param("detailbody", false);
        if (((new Date(date)).getTime()) + 1000*60 < (new Date()).getTime()) {
            return res.json({
                code: 400,
                msg: "发布时间不能低于当前时间"
            });
        }
        for(var key in set){
            if(set[key]==false){
                delete set[key];
            }
        }
        set.createdAt =set.updatedAt= new Date(date).Format("yyyy-MM-dd hh:mm:ss.S");
        Noticeinfo.create(set).exec(function(err,notice){
            if(err) return res.negotiate(err);
            if(notice){
                return res.json({
                    code:200,
                    msg:"添加成功"
                });

            }
            return res.json({
                code:400,
                msg:"添加失败"
            });

        });


    },
    /**
     * update 更新公告
     * publishtype int 0立即发布 1定时发布 非必须
     * publishtime  datetime 发布时间 非必须
     * title  string 标题 非必须
     * detailbody  string 内容 非必须
     * id int 公告id 必须
     * `MerchantNotifyController.update()`
     */
    update: function (req, res) {
        var mine = req.session.mine, _this = this;
        if (!mine) {
            return res.json({
                code: 400,
                msg: "需要登录"
            });
        }
        var set = {}, date;
        set.userid = mine.id;
        set.publishtype = req.param("publishtype");
        var id = req.param("id", false);
        date = req.param("publishtime", new Date());
        set.publishtime = (new Date(date)).getTime() / 1000;
        set.title = req.param("title", "");
        set.detailbody = req.param("detailbody", false);

        if (!id) {
            return res.json({
                code: 400,
                msg: "id未传入"
            });
        }
        if (((new Date(date)).getTime()) + 1000 < (new Date()).getTime()) {
            return res.json({
                code: 400,
                msg: "发布时间不能低于当前时间"
            });
        }
        set.updatedAt= new Date(date).Format("yyyy-MM-dd hh:mm:ss.S");
        for(var key in set){
            if(set[key]==false){
                delete set[key];
            }
        }
        Noticeinfo.update({id:id},set).exec(function(err,notice){
            if(err) return res.negotiate(err);
            if(notice){
                return res.json({
                    code:200,
                    msg:"操作成功"
                });

            }
            return res.json({
                code:400,
                msg:"操作失败"
            });
        });

    },
    /**
     * 删除公告
     * id int 公告id 必须
     * `MerchantNotifyController.delete()`
     */
    delete: function (req, res) {
        var mine = req.session.mine;
        if (!mine) {
            return res.json({
                code: 400,
                msg: "需要登录"
            });
        }
        var id = req.param("id", false);
        if (!id) {
            return res.json({
                code: 400,
                msg: "id未传入"
            });
        }
        Noticeinfo.destroy({id: id}).exec(function (err, info) {
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
     * @param id int 公告id
     * 发布
     * @param req
     * @param res
     */
    publish:function(req,res){
        var id=req.param("id");
        var mine=req.session.mine;
       
        var date = new Date().Format("yyyy-MM-dd hh:mm:ss.S");
        var set={publishtime:(new Date()).getTime()/1000};
        Noticeinfo.update({id:id},set).exec(function(err,notice){
            if(err) return res.negotiate(err);
            if(notice){
                return res.json({
                    code:200,
                    msg:"操作成功"
                });

            }
            return res.json({
                code:400,
                msg:"操作失败"
            });
        });
    },
    /**
     * 查看公告
     * id int 公告id 必须
     * `MerchantNotifyController.view()`
     */
    view: function (req, res) {
        var mine = req.session.mine;
        if (!mine) {
            return res.json({
                code: 400,
                msg: "需要登录"
            });
        }
        var id = req.param("id", false);
        if (!id) {
            return res.json({
                code: 400,
                msg: "id未传入"
            });
        }
        Noticeinfo.findOne({id: id}).exec(function (err, notice) {
            if (err)  return res.negotiate(err);
            if (notice) {
                return res.json({
                    code: 200,
                    msg: "",
                    data: notice,
                });
            }
            return res.json({
                code: 400,
                msg: "没有数据",
            });
        });
    },
    /**
     *更改商户后台公告消息阅读状态
     * @param noticeid 公告id
     * @param readstore 公告readstore的值
     */
    updateNoticeFlag:function(req,res){
        console.log(req.ip,req.allParams());
        var mine = req.session.mine;
        var storeId =  mine.storeid;
        var readStore = req.param('readstore');
        if (readStore.indexOf(',')< 0 && readStore == '-1'){
            readStore = storeId + '';
        }else{
            readStore += ','+storeId;
        }

        var noticeId = req.param('noticeid');
        Noticeinfo.update({id:noticeId},{readstore:readStore}).exec(function(err,info){
            if (err){
                console.log(err);
                return;
            }
            if(info){
                return res.json({code:200,readstore:info.readstore});
            }
            return res.json({code:400,readstore:'err'});
        });
    },
};

