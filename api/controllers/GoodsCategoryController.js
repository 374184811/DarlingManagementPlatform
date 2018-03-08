/**
 * GoodsCategoryController
 *
 * @description :: Server-side logic for managing goodscategories
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


    /**
     *@param parentid int 父类iD
     * @param hid  string   非必传
     * @param categoryname string 类别管理 非必传
     * @param description string 描述
     * @param sortorder  int 排序 非必传
     * @param status    int 状态  非必传 默认0不开启 1开启
     * @param ischannel
     *
     * `GoodsCategoryController.add()`
     */
    add: function (req, res) {

        var msg = msg || {};
        console.log('add: This is the function entry.  check it out: ', msg);

        var set = {};
        set.parentId = req.param("parentid", 0);
        set.hid = req.param("hid", 0);
        set.categoryname = req.param("categoryname");
        set.description = req.param("description");
        set.sortorder = req.param("sortorder",0);
        set.status = req.param("status",1);
        set.ischannel = req.param("ischannel",0);
        var mine = req.session.mine;
        
        for (key in set) {
            if (set[key] == undefined) {
                delete  set[key];
            }
        }
        set.hid="0:"+set.parentId;
        set.storeid = mine.storeid;
        Goodscategory.findOne({categoryname: set.categoryname}).exec(function (err, category) {
            if (err) return res.negotiate(err);
            if (category) {
                return res.json({
                    code: 400,
                    msg: "类别已经存在"
                });
            } else {
                Goodscategory.create(set).exec(function (err, record) {
                    if (err) return res.negotiate(err);
                    if (record) {
                        return res.json({
                            code: 200,
                            msg: "创建成功"
                        });
                    }
                    return res.json({
                        code: 400,
                        msg: "创建失败"
                    });
                });
            }
        });
    },


    /**
     *@param parentid int 父类iD
     * @param hid  char   非必传
     * @param categoryname string 类别管理 非必传
     * @param description string 描述
     * @param sortorder  int 排序 非必传
     * @param status    int 状态  非必传 默认0不开启 1开启
     * @param ischannel
     * `GoodsCategoryController.edit()`
     */
    edit: function (req, res) {
        var msg = msg || {};
        console.log('edit: This is the function entry.  check it out: ', msg);

        var set = {};
        set.parentId = req.param("parentid", 0);
        set.hid = req.param("hid", 0);
        set.categoryname = req.param("categoryname");
        set.description = req.param("description");
        set.sortorder = req.param("sortorder");
        set.status = req.param("status");
        set.ischannel = req.param("ischannel");
        set.storeid = req.param("storeid");
        var id = req.param("id", false);

        var mine = req.session.mine;
        
        async.auto({
            one: function (next) {
                Goodscategory.query("START TRANSACTION;",next);
                console.log("one");
            },
            two:["one",function (next) {
                console.log("two");
                Goodscategory.update({id: id}, set).exec(next);
            }],
            three: ["two",function (next) {
                Goodscategory.update({parentid: id}, {storeid: set.storeid}).exec(next);
            }],
            four:["three",function(next){
                Goodscategory.find({parentid: id}).exec(function(err,category){
                    if (err) {
                        Goodscategory.query('ROLLBACK');
                        if(err) return res.negotiate(err);
                    }
                    if(category.length){
                        async.mapSeries(category,function(record,cb){
                            Goodscategory.update({parentid: record.id}, {storeid: set.storeid}).exec(cb);
                        },function(err,result){
                            if (err) {
                                Goodscategory.query('ROLLBACK');
                                if(err) return res.negotiate(err);

                            }
                             next(result);
                        });
                    }else{
                        next(null);
                    }

                });
            }]
        }, function (err, results) {
            if (err) {
                Goodscategory.query('ROLLBACK');
                if(err) return res.negotiate(err);
            }
            console.log(results);
            Goodscategory.query('COMMIT', function (err, record) {
                if (err) {
                    Goodscategory.query('ROLLBACK');
                    if(err) return res.negotiate(err);
                }
                res.json({
                    code: 200,
                    msg: "操作成功"
                });
            });
        });
    },
    saveAll: function (req, res) {
        var category = req.param("category");
        if (!category) {
            return res.json({
                code: 400,
                msg: "参数未传递"
            });
        }
        var goodsCategory = JSON.parse(category);
        Goodscategory.query("BEGIN　transaction",function(err,record){
            async.mapSeries(goodsCategory, function (item, cb) {
                if(!item.id){
                    Goodscategory.query('ROLLBACK');
                    return res.json({
                        code:400,
                        msg:"id未传递"
                    });
                }
                var id=item.id;
                async.auto({
                    one: function (next) {
                        Goodscategory.update({id: id}, item);
                    },
                    two: ["one", function (next) {
                        Goodscategory.update({parentid: id}, {storeid: item.storeid});
                    }],
                }, function (err, results) {
                    if (err) {
                        Goodscategory.query('ROLLBACK');
                        return res.json({code: 400, "msg": "操作失败"});
                    }
                    cb(null, results);
                });
            }, function (err, result) {
                if (err) {
                    Goodscategory.query('ROLLBACK');
                    return res.json({code: 400, "msg": "操作失败"});
                }
                Goodscategory.query('COMMIT', function (err, record) {
                    if (err) {
                        Goodscategory.query('ROLLBACK');
                        return res.json({code: 400, "msg": "操作失败"});
                    }
                    res.json({
                        code: 200,
                        msg: "操作成功"
                    });
                });
            });
        });


    }


};

