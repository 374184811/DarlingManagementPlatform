/**
 * PresaleController
 *
 * @description :: Server-side logic for managing presales
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


    /**
     * 显示更多预售信息
     * num int 每次显示多少个
     * page int  页码
     * toekenId string 用户tokenid
     * mId int 用户id
     * `PresaleController.index()`
     */
    index: function (req, res) {
        var num = req.param("num", 0);
        var page = req.param("page", 1);
        var date = new Date();
        var tokenId = req.param("tokenId", 0);
        var mId = req.param("mId", 0);
        var offset = 0;
        if (num) {
            offset = (page - 1) * num;
        }
        console.log("huangt::---presale index---");
        common.getLoginUser(req, tokenId, mId, function (err, ret) {
            if (err) return res.negotiate(err);
            if (ret && ret.code == 200) {
                var member = ret.user;
                var storeid = member.operatorno || 0;
                var date = (new Date()).Format("yyyy-MM-dd hh:mm:ss");
                // var condition = {presaleendtime: {">": date.Format("yyyy-MM-dd")}, storeid: storeid};
                var condition = "where a.storeid=" + storeid + " AND a.presaleendtime>'" + date + "'" + " AND  b.status=3 AND a.display>=0";
                getPresaleGoods(storeid, condition, 1, num, offset);

            } else if (req.session.mine) {
                var storeid = req.session.mine.storeid;
                if (storeid) {
                    // var condition = {storeid: storeid};
                    var condition = "where a.storeid=" + storeid;
                    getPresaleGoods(storeid, condition, 1, num, offset);
                } else {
                    return res.json({
                        code: 400,
                        msg: "你是总后台,不能查看"

                    });
                }

            } else {
                return res.json({
                    code: 400,
                    msg: "用户未登录"
                });
            }
        });
        function getPresaleGoods(storeid, condition, isFront, limit, offset) {

            var sql = "select a.id,a.goodsname,a.sku,a.goodsresidue,a.orderbeing,a.reservegold,b.presalestarttime," +
                "a.presaleendtime,a.imagedefault,b.deposit,b.imagedefault as src_image,b.attachment" +
                ",a.robot_image,a.mobi_image,b.premoneey as price,b.stock" +
                " from presellgoodsmsg a left join mergoodsList"
                + storeid + " b on a.sku=b.sku " + condition + " order by  a.display DESC,a.sort ASC,a.orderbeing DESC,a.createdAt DESC,a.orderstarttime ASC";
            if (limit) {
                sql += " limit " + offset + "," + limit;
            }
            
            presellgoodsmsg.query(sql, function (err, sales) {
                if (err) return res.negotiate(err);
                if (sales.length > 0) {
                    for(var i=0;i<sales.length;i++){
                        sales[i].presaleendtime = gcom.calcPretime(true, sales[i].presaleendtime);
                        sales[i]= setDisplayStatus(sales[i]);
                    }

                    function setDisplayStatus(sale) {
                        switch (sale.status == 0) {
                            // 商品状态 0 未审核   1 审核失败 2 未上架  3 正常
                            case 0:
                                sale.display = -2;
                                break;
                            case 1:
                                sale.display = -3;
                                break;
                            case 2:
                                sale.display = -4;
                                break;
                        }
                        return sale;
                    }
                  return res.json({
                                  code: 200,
                                  data: sales,
                              });
                } else {
                    return res.json({
                        code: 400,
                        msg: "没有数据"
                    });
                }

            });

        }

    },
    /**
     *
     * @param req
     * @param res
     * @returns {*}
     */
    goods: function (req, res) {
        var mine = req.session.mine;
        if (!mine) {
            return res.json({
                code: 400,
                msg: "用户未登录"
            });
        }
        var storeid = mine.storeid;
        this.fetchGoods(res, storeid, 0, 0);

    },
    fetchGoods: function (res, storeid, num, page) {
        var sql = "select  presaleendtime,presalestarttime,createdAt,reserve10,premoneey,deposit,price,name,sku,stock,imagedefault,attachment,name,keywords from mergoodsList" + storeid +
            " where  type=2 AND status=3 AND goodsseries=0  ";
        sql += " order by presaleendtime ASC,createdAt DESC ";

        if (num > 0) {
            offset = (page - 1) * num;
            sql += " limit " + num + "," + offset;
        }
        
        Goodscontent.query(sql, function (err, sales) {
            if (err) return res.negotiate(err);
            for (var i = 0; i < sales.length; i++) {
                sales[i].presaleendtime = gcom.calcPretime(true, sales[i].presaleendtime);
                switch (sales[0]["status"] == 0) {
                    // 商品状态 0 未审核   1 审核失败 2 未上架  3 正常
                    case 0:
                        sales[i].display = -2;
                        break;
                    case 1:
                        sales[i].display = -3;
                        break;
                    case 2:
                        sales[i].display = -4;
                        break;
                }
            }
            if (sales.length > 0) {
                return res.json({
                    code: 200,
                    data: sales,
                });
            } else {
                return res.json({
                    code: 400,
                    msg: "没有数据"
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
    /**
     * 设置首页显示预售的序号
     * @param id int 在首页显示的预售编号
     * @param req
     * @param res
     */
    setHomeDisplay: function (req, res) {
        var mine = req.session.mine;
        if (!mine) {
            return res.json({
                code: 400,
                msg: "用户未登陆"

            })
        }
        var id = req.param("id");
        if (!id) {
            return res.json({
                code: 400,
                msg: "参数错误"
            });
        }
        presellgoodsmsg.update({storeid: mine.storeid}, {display: 0}).exec(function (err, old) {
            if (err) return res.negotiate(err);
            presellgoodsmsg.update({id: id, storeid: mine.storeid}, {display: 1}).exec(function (err, msg) {
                if (err) return res.negotiate(err);
                if (msg) {
                    return res.json({
                        code: 200,
                        data: msg,
                        msg: "修改成功"
                    });
                } else {
                    return res.json({
                        code: 400,
                        msg: "修改失败"
                    });
                }
            });
        });

    },
    /**
     * 显示首页预售
     * @param tokenId 用户token
     * @param mId 用户id
     * `PresaleController.home()`
     */
    home: function (req, res) {
        var tokenId = req.param("tokenId", false);
        var mId = req.param("mId", false);
        common.getLoginUser(req, tokenId, mId, function (err, ret) {
            if (err) return res.negotiate(err);
            if (ret && ret.code == 200) {
                var member = ret.user;
                var storeid = member.operatorno || 0;
                presaleGoods(storeid);

            } else {
                return res.json({
                    code: 400,
                    msg: "用户未登录"
                });
            }
        });

        function presaleGoods(storeid) {
            var date = (new Date()).Format("yyyy-MM-dd hh:mm:ss");

            function one(cb) {
                var sql = "select a.id,a.goodsname,a.sku,a.goodsresidue,a.orderbeing,a.reservegold,b.presalestarttime," +
                    "a.presaleendtime,a.imagedefault,a.robot_image,a.mobi_image," +
                    "b.imagedefault as src_image,b.attachment,b.premoneey as price,b.stock,b.deposit" +
                    " from presellgoodsmsg a left join mergoodsList"
                    + storeid + " b on a.sku=b.sku where a.storeid=" + storeid + " AND a.presaleendtime>'" + date + "'" +
                    " AND  b.status=3 AND a.display>=0 order by  a.display DESC,a.sort ASC limit 1";

                presellgoodsmsg.query(sql, cb);
                /*
                 function (err, sales) {
                 if (err) {
                 cb(err, null);
                 }
                 if (sales && sales.length > 0) {
                 var skuObj = gcom.revertSku(sales[0].sku);
                 var realSku = skuObj.randomNum + "-" + skuObj.storeid + "-" + skuObj.timestamp;
                 var sql = "select imagedefault as src_image,attachment,premoneey as price,stock,deposit from mergoodsList"
                 + storeid + " where  sku like '" + realSku + "%' AND type=2  ORDER BY createdAt ASC,goodsseries DESC limit 1";
                 
                 presellgoodsmsg.query(sql, function (err, goods) {
                 if (err) {
                 cb(err, null);
                 }
                 if(goods&&goods.length>0){
                 for(var key in goods[0]){
                 sales[0][key]= goods[0][key];
                 }
                 
                 cb(null,sales);
                 }else{
                 cb(null,sales);
                 }
                 });
                 } else {
                 cb(err, null);
                 }

                 }
                 */
            }

            function two(cb) {
                var sql = "select  count(*) as cnt from presellgoodsmsg a left join mergoodsList"
                    + storeid + " b on a.sku=b.sku where a.storeid=" + storeid + " AND a.presaleendtime>'" + date + "'" +
                    " AND  b.status=3 AND a.display>=0";
                presellgoodsmsg.query(sql, cb);
            }

            async.series({one: one, two: two}, function (err, result) {
                if (err) return res.negotiate(err);
                var product = {}, preCnt = 0;
                var goods = result.one;

                if (goods && goods.length > 0) {
                    
                    product = goods[0];
                    // 转化为毫秒数（当前时间与结束时间差值）
                    product.presaleendtime = gcom.calcPretime(true, product.presaleendtime);
                }
                if (result.two && result.two.length > 0) {
                    preCnt = parseInt(result.two[0]["cnt"]);
                }
                if (preCnt > 0) {
                    return res.json({
                        code: 200,
                        data: {
                            goods: product,
                            preCnt: preCnt
                        }
                    });
                } else {
                    return res.json({
                        code: 400,
                        msg: "暂无预售商品"
                    })
                }


            });

        }

    },

    /**
     * 新增首页预售产品
     * @param sku string　预售商品sku
     * @param buytotal int　已售商品数量
     * @param robot string　预售商品机器人图片
     * @param mobile string　预售商品手机端图片
     *@param type int 0获取
     * `PresaleController.add()`
     */
    add: function (req, res) {
        var mine = req.session.mine;
        
        if (!mine) {
            return res.json({
                code: 400,
                msg: "用户未登陆"
            })
        }
        var presale = {};
        presale.sku = req.param("sku");
        presale.orderbeing = req.param("buytotal", 0);
        presale.robot_image = req.param("robot", 0);
        presale.mobi_image = req.param("mobile");
        presale.storeid = mine.storeid;
        presale.shop_name = mine.shop_name;

        if (!presale.sku) {
            return res.json({
                code: 400,
                msg: "sku不能为空"
            });
        }
        for (var key in presale) {
            if (!presale[key]) {
                delete presale[key];
            }
        }
        presale.type = req.param("type", 0);
        var skuArray = presale.sku.split("-");
        if (!skuArray[1]) {
            return res.json({
                code: 400,
                msg: "sku错误"
            });
        }
        
        var sql = "select a.name,a.premoneey,a.deposit,a.presaleendtime,a.presalestarttime,a.presaleflow,a.stock,a.price,a.imagedefault,a.createdAt,b.count " +
            "from mergoodsList"+skuArray[1]+" a left join (select sum(reserve10) as count from mergoodsList"+skuArray[1]+" where sku like '"+presale.sku
            +"%' ) b on 1=1 where a.sku like '"+presale.sku+"%' AND a.type=2  ORDER BY a.createdAt ASC,a.goodsseries DESC limit 1";
        Creator.query(sql, function (err, goods) {
            if (err) return res.negotiate(err);
            if (goods.length > 0) {
                var product = goods[0];
                presale.goodsname = product.name;
                presale.goodstotal = product.stock;
                presale.goodsresidue = parseInt(product.stock)-parseInt(product.count);
                
                presale.reservegold = product.deposit || 0;
                if (0 == presale.type) {
                    presale.orderbeing = product.count;
                }
                if (presale.orderbeing > 0) {
                    presale.goodsresidue = product.stock - presale.orderbeing;
                }
                presale.orderstarttime = product.createdAt;
                presale.price = product.premoneey;
                presale.imagedefault = product.imagedefault;
                presale.presaleendtime = product.presaleendtime;
                if (presale.presaleendtime < (new Date()).Format("yyyy-MM-dd hh:mm:ss.S")) {
                    return res.json({
                        code: 400,
                        msg: "预售产品最后时间小于当前时间"
                    });
                }
                // presale.ordervalidtime = ((new Date(presale.presaleendtime)).getTime() - (new Date(presale.orderstarttime)).getTime()) / 1000;
                presale.is_orderstop = 0;
                presale.is_paystart = -1;
                presale.is_paystop = 0;
                if (!presale.robot_image) {
                    presale.robot_image = product.imagedefault;
                }
                if (!presale.mobi_image) {
                    presale.mobi_image = product.imagedefault;
                }
                presellgoodsmsg.create(presale).exec(function (err, msg) {
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
            } else {
                return res.json({
                    code: 400,
                    msg: "不存在该sku的产品"
                });
            }
        });

    },
    /**
     *
     * 编辑预售商品
     * @param sku string　预售商品sku
     * @param buytotal int　已售商品数量
     * @param robot string　预售商品机器人图片
     * @param mobile string　预售商品手机端图片
     * @param id int　预售商品id
     *
     * `PresaleController.edit()`
     */
    edit: function (req, res) {
        var mine = req.session.mine;
        if (!mine) {
            return res.json({
                code: 400,
                msg: "用户未登陆"

            })
        }
        var presale = {};
        presale.storeid = mine.storeid;
        presale.sku = req.param("sku");
        presale.orderbeing = req.param("buytotal");
        presale.robot_image = req.param("robot");
        presale.mobi_image = req.param("mobile");
        presale.shop_name = mine.username;
        var id = req.param("id");

        if (!presale.sku || !id) {
            return res.json({
                code: 400,
                msg: "参数错误"
            });
        }
        for (var key in presale) {
            if (!presale[key]) {
                delete presale[key];
            }
        }
        presale.type = req.param("type", 0);
        
        var skuArray = presale.sku.split("-");
        if (!skuArray[1]) {
            return res.json({
                code: 400,
                msg: "sku错误"
            });
        }

        
        var sql = "select a.name,a.premoneey,a.deposit,a.presaleendtime,a.presaleflow,a.stock,a.price,a.imagedefault,a.createdAt,b.count " +
            "from mergoodsList"+skuArray[1]+" a left join (select sum(reserve10) as count from mergoodsList"+skuArray[1]+" where sku like '"+presale.sku
            +"%' ) b on 1=1 where a.sku like '"+presale.sku+"%' AND a.type=2  ORDER BY a.createdAt ASC,a.goodsseries DESC limit 1";
        Creator.query(sql, function (err, goods) {
            if (err) return res.negotiate(err);
            if (goods.length > 0) {
                var product = goods[0];
                presale.goodsname = product.name;
                presale.goodstotal = product.stock;
                presale.goodsresidue = product.stock-product.count;
                presale.reservegold = product.deposit || 0;
                if (0 == presale.type) {
                    presale.orderbeing = product.count;
                }
                if (presale.orderbeing > 0) {
                    presale.goodsresidue = product.stock - presale.orderbeing;
                }
                presale.orderstarttime = product.createdAt;
                presale.price = product.premoneey;
                presale.presaleendtime = product.presaleendtime;
                presale.imagedefault = product.imagedefault;
                if (presale.presaleendtime < (new Date()).Format("yyyy-MM-dd hh:mm:ss.S")) {
                    return res.json({
                        code: 400,
                        msg: "预售产品最后时间小于当前时间"
                    });
                }
                // presale.ordervalidtime = ((new Date(presale.presaleendtime)).getTime() - (new Date(presale.orderstarttime)).getTime()) / 1000;
                presale.is_orderstop = 0;
                presale.is_paystart = -1;
                presale.is_paystop = 0;
                if (!presale.robot_image) {
                    presale.robot_image = product.imagedefault;
                }
                if (!presale.mobi_image) {
                    presale.mobi_image = product.imagedefault;
                }

                presellgoodsmsg.update({id: id, storeid: mine.storeid}, presale).exec(function (err, msg) {
                    if (err) return res.negotiate(err);
                    if (msg) {
                        return res.json({
                            code: 200,
                            data: msg
                        });
                    } else {
                        return res.json({
                            code: 400,
                            msg: "修改失败"
                        });
                    }
                });
            } else {
                return res.json({
                    code: 400,
                    msg: "不存在该sku的产品"
                });
            }
        });

    },


    /**
     *  查看预售商品
     * @param id int　预售商品id
     *
     * `PresaleController.view()`
     */
    view: function (req, res) {
        var id = req.param("id");
        if (!id) {
            return res.json({
                code: 400,
                msg: "参数错误"
            });
        }
        presellgoodsmsg.findOne({id: id}).exec(function (err, msg) {
            if (err) return res.negotiate(err);
            if (msg) {
                var sku = msg.sku;
                var skuArray = sku.split("-");
                var storeid = 0;
                if (skuArray[1]) {
                    storeid = skuArray[1];
                }
                var sql = "select imagedefault,stock,reserve10,premoneey,status from mergoodsList" + storeid + " where sku='" + sku + "'";
                Goodscontent.query(sql, function (err, goods) {
                    if (err) return res.negotiate(err);
                    if (goods.length > 0) {
                        var val = goods.pop();
                        msg.imagedefault = val.imagedefault;
                        msg.stock = val.stock;
                        msg.sale_count = val.reserve10;
                        msg.premoneey = val.premoneey;
                        switch (val.status == 0) {
                            // 商品状态 0 未审核   1 审核失败 2 未上架  3 正常
                            case 0:
                                msg.display = -2;
                                break;
                            case 1:
                                msg.display = -3;
                                break;
                            case 2:
                                msg.display = -4;
                                break;
                        }
                    }
                    return res.json({
                        code: 200,
                        data: msg
                    });
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
     *  删除预售商品
     * @param id int　预售商品id
     *
     * `PresaleController.delete()`
     */
    delete: function (req, res) {
        var id = req.param("ids");
        if (!id) {
            return res.json({
                code: 400,
                msg: "参数错误"
            });
        }
        presellgoodsmsg.destroy({id: id}).exec(function (err, msg) {
            if (err) return res.negotiate(err);
            if (msg) {

                return res.json({
                    code: 200,
                    msg: "删除成功"
                });
            } else {
                return res.json({
                    code: 400,
                    msg: "没有数据"
                });
            }
        });
    },

};

