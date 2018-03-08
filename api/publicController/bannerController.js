module.exports = {
    accountActivation: function (req, res) {
        console.log("password: ", req.param('password'));
        Cepcommonmember.findOne({
            username: req.param('username')
        }, function userCreated(err, newUser) {
            if (err) {
                //console.log("err: ", err);
                //console.log("err.invalidAttributes: ", err.invalidAttributes)
                return res.negotiate(err);
            }

            if (req.param('password') != newUser.password) {
                console.log("newUser.password: ", newUser.password);
                console.log("newUser.password2: ", newUser);
                return res.negotiate(err);
            } else {
                Cepcommonmember.update({
                    username: req.param('username')
                }, {
                    emailstatus: true
                }, function userCreated(err, updated) {
                    if (err) {
                        //console.log("err: ", err);
                        //console.log("err.invalidAttributes: ", err.invalidAttributes);
                        return res.negotiate(err);
                    }
                    req.session.me = updated.id;

                    //console.log("password ok: ", updated);
                    req.session.userdata = updated;
                    return res.json({
                        id: updated.id
                    });
                });
            }

        });
    },

    /**
     * 首页推荐显示的banner
     * @param req
     * @param res
     */
    getindexbanner: function (req, res) {

        var bannerType = req.param("type", false);
        var rolnumber = req.param("row", 1);
        var tokenId = req.param("tokenId", false);
        var mId = req.param("mId", false);
        var isMobile = req.param("isMobile", false);
        var offset = req.param("offset", 0);
        var num = req.param("num", false);
        if (bannerType === false || ((bannerType == 2 || bannerType == 3) && !rolnumber)) {
            return res.json({
                "success": false,
                "msgCode": 419,
                "msg": "参数解析错误，请检查传入参数",
                "result": {}
            });
        }
        var _this = this;
        if (req.session.user) {
            var user = req.session.user;
            getbanner();
        } else {
            var client = redis.client({db: 2});
            client.get(mId + ":" + tokenId, function (err, value) {
                if (err) return res.negotiate(err);
                if (user = utility.decodeToken(value)) {
                    getbanner();
                }

            });
        }
        function getbanner() {
            if (bannerType == 2) {
                if (isMobile) {
                    condition = {
                        storeid: user.operatorno,
                        bannertype: bannerType,
                        rolnumber: rolnumber,
                    };
                } else {
                    condition = {
                        storeid: user.operatorno,
                        bannertype: bannerType
                    };
                }

            } else if (bannerType == 3) {
                condition = {
                    storeid: user.operatorno,
                    bannertype: bannerType,
                    rolnumber: rolnumber,
                };
            } else {
                condition = {
                    storeid: user.operatorno,
                    bannertype: bannerType,
                };
            }
            num = parseInt(num);
            if (!num) {
                switch (bannerType) {
                    case 0:
                        num = 6;
                        break;
                    case 1:
                        if (isMobile) {
                            num = 2;
                        } else {
                            num = 6;
                        }
                        break;
                    case 2:
                        if (isMobile) {
                            if (rolnumber == 1) {
                                num = 9;
                            } else {
                                num = 3;
                            }
                        } else {
                            num = 12;
                        }
                        break;
                    case 3:
                        if (rolnumber == 1) {
                            num = 1;
                        } else {
                            num = 9;
                        }
                        break;
                    case 4:
                        num = 9;
                        break;
                    default:
                        num = 10;
                        break;
                }
            } else {
                num = 10;
            }
            if (num) {
                offset = offset || 0;
                offset = (offset - 1) * num;
            }

            Banner.find({where: condition, skip: offset, limit: num}).sort("order desc").exec(function (err, records) {
                if (err) {
                    return res.negotiate(err);
                }


                if (!records || records.length <= 0) {
                    return res.json({
                        "success": false,
                        "msgCode": 400,
                        "msg": "操作失败，没有数据",
                        "result": {}
                    });
                }
                return res.json({
                    "success": false,
                    "msgCode": 0,
                    "msg": "操作成功",
                    "result": records
                });
            })
        }
    },

    /**
     * 获取banner和推荐
     * backend 是否是后台
     * @param req
     * @param res
     */
    gettopBanner: function (req, res) {

        var self = this;
        var tokenId = req.param("tokenId", false);
        var mId = req.param("mId", false);
        var type = req.param("type", false);

        if (type == 2) {
            getIndexbanner(self, 4);
        } else {
            common.getLoginUser(req, tokenId, mId, function (err,ret) {
                if (err) return res.negotiate(err);
                if(ret&&ret.code==200){//用户已经登录
                   var user=ret.user;
                    // var storeid = user.operatorno;
                   var storeid=4;//现在平台没有其他商铺id,所以取打令商铺id
                    getIndexbanner(self, storeid);

                }else{
                    return res.json({
                        code: 400,
                        msg: "用户未登录"
                    });
                }
            });

        }

        function getIndexbanner(self, storeid) {
            var condition = {};
            if (storeid) {
                condition = {or: [{storeid: storeid}, {storeid: 0}]};
            }
            condition.status = 1;
            condition.bannertype = {">=": 0, "<=": 5};
            self.fetchbanner(res, condition, false, storeid);
        }

    },
    /**
     * 后台获取首页banner列表
     * @param req
     * @param res
     */
    bannerlist: function (req, res) {
        var mine = req.session.mine;
        var storeid = mine.storeid;
        var condition = {};
        if (storeid) {
            condition.storeid = storeid;
        } else {
            condition.storeid = 0;
        }
        condition.bannertype = 0;
        condition.sort={bannerserial:"ASC",order:"ASC","updatedAt":"DESC"};
        console.log(condition);
        Banner.find(condition).exec(function (err, banners) {
            if (err) return res.negotiate(err);
            if (banners.length > 0) {
                return res.json({
                    code: 200,
                    data: banners,
                });
            } else {
                return res.json({
                    code: 200,
                    msg: "没有数据",
                    data: [],
                });
            }
        });


    },
    /**
     * 后台获取首页推荐模块列表
     * @param req
     * @param res
     */
    modularlist: function (req, res) {
       
        var mine = req.session.mine;
        var storeid = mine.storeid;
        if (storeid) {
            var condition = {or: [{storeid: storeid}, {storeid: 0}]};
        } else {
            var condition = {};
            condition.storeid = storeid;
        }
        condition.bannertype = {">=": 1, "<=": 3};
        this.fetchbanner(res, condition, true, storeid);
    },
    /**
     * type 类型
     * row 第几行
     * @param req
     * @param res
     */
    fetchbanner: function (res, condition, isBack, storeid) {

        var series = {
            one: function (cb) {
                condition.sort={order:"ASC",updatedAt:"DESC"};
                var query = Banner.find(condition);
                query.exec(function (err, banners) {
                    if (err) return res.negotiate(err);
                    cb(null, banners);
                });
            },
            two: function (cb) {
                var where = {};
                if (storeid) {
                    where.or = [{"storeid": storeid}, {"storeid": 0}];
                }
                where.bannertype = {">=": 0, "<=": 5};

                BannerTitle.find(where).exec(function (err, bannerTitle) {
                    if (err) return res.negotiate(err);
                    cb(null, bannerTitle);
                });
            }
        };
        if (isBack) {


            if (storeid) {//运营商
                series.presale = function (cb) {
                    storeid=parseInt(storeid);
                    var sql = "select a.*,b.status,b.presaleendtime as endtime from presellgoodsmsg a left join mergoodsList" + storeid + " b on a.sku=b.sku where a.storeid=" + storeid + " order by a.sort ASC";
                    presellgoodsmsg.query(sql, function (err, sales) {
                        if (sales && sales.length > 0) {
                            for (var i = 0; i < sales.length; i++) {
                                switch (sales[i]["status"]) {
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
                                if(sales[i].endtime<=(new Date()).Format("yyyy-MM-dd hh:mm:ss.S")){
                                    sales[i].display =-1;
                                }
                            }
                        }
                        cb(err, sales);
                    });
                }
                series.curIndex = function (cb) {
                    var sql = "select a.id,a.goodsname,a.sku,a.goodsresidue,a.orderbeing,a.reservegold," +
                        "b.presaleendtime,a.imagedefault,a.price,a.robot_image,a.mobi_image,b.type,b.deposit,b.premoneey from presellgoodsmsg a left join mergoodsList"
                        + storeid+" b on a.sku=b.sku where a.storeid="+ storeid + " AND a.presaleendtime>=DATE_FORMAT(NOW(),'%Y-%m-%d %h:%m:%s') " +
                        "AND  b.status=3 AND a.display>=0 order by  a.display DESC,a.sort ASC";
                        presellgoodsmsg.query(sql, function (err,msg) {
                            var pre={};
                            if(msg&&msg.length){
                                    pre=msg[0];
                            }
                            cb(err,pre);
                        });
                }
            } else {//总后台
                // cb(null, null);
            }
        }
        async.series(series, function (err, result) {
            if (err) return res.negotiate(err);
            var banners = result.one;
            var bannerTitle = result.two;
            var items = {};
            items.presale = result.presale;
            items.curIndex = result.curIndex?result.curIndex.id:null;
            items.presale_count = result.preCnt?result.preCnt[0]["cnt"]:null;

            if (bannerTitle.length > 0) {
                var titles = {first:null,second:null,three:null,four:null,five:null};
                var titleIndex={ first:1,second:2,three:3,four:4,five:5};

                bannerTitle.forEach(function (title) {
                    delete title.created_uid;
                    for(var index in titleIndex){
                        if(title.bannertype==titleIndex[index]){
                            if (title.storeid == storeid&&title.title) {
                                titles[index] = title;
                            }else if(title.storeid==0){
                                titles[index] = title;
                            } else if (titles.first == null) {
                                titles[index] = title;
                            }

                        }
                    }
                });
                items.titles = titles;
            }

            if (banners.length > 0) {

                if (!isBack) {
                    items.banners = [];
                }

                items.first = [];
                items.second = {};
                items.second.row1 = [];
                items.second.row2 = [];
                items.three = {};
                items.three.row1 = [];
                items.three.row2 = [];

                var  itemsIndex={
                    first:1,
                    second:[1,2,2],
                    three:[1,2,3],
                };
                banners.forEach(function (item) {
                    if (item.bannertype == 0 && !isBack) {//banner
                        if (item.storeid == storeid) {
                            if (item.order>0) {
                                items.banners.push(item);
                            }
                        }
                     } else{

                        for(var index in itemsIndex){

                            if((item.bannertype==itemsIndex[index]&&common.isArray(items[index]))) {

                                if (item.storeid == storeid) {
                                    items[index].push(item);
                                }
                            }else if(!common.isArray(items[index])&&item.bannertype==itemsIndex[index][itemsIndex[index].length-1]){

                                if (item.storeid == storeid) {
                                    if(item.rolnumber==1){
                                        items[index].row1.push(item);
                                    }else if(item.rolnumber==2){
                                        items[index].row2.push(item);
                                    }
                                }else if(item.bannertype == 3&&item.rolnumber == 1){
                                    if(items.three.row1.length <= 0){
                                        items.three.row1.push(item);
                                    }
                                }

                            }
                        }
                    }

                });

            }

            return res.json({
                "success": true,
                "code": 200,
                "msg": "",
                "data": items
            });
        });
    },


    /**
     * banner参数
     *
     * @param  order                    //序号即为banner呈现在客户端的顺序，越大越前
     * @param  bannerserial             //baner编号
     * @param  bannername               //banner名称 标题
     * @param  bannersubname            //banner副标题
     * @param  bannertype               //0 banner,1第一推荐模块,2第2推荐模块,3第3推荐模块,4第4推荐模块
     * @param  rolnumber                //0 表示不区分第几排,1表示在第1排,2表示在第2排
     * @param  description              //banner描述
     * @param  bannerpic                //banner图片
     * @param  bannerurl                //banner地址
     * @param  linktype                 //0无效果,1外部链接,2内部链接,3商品专场,4自定义
     * @param  storeid                  //运营商id
     * @param  status                   //
     *
     * @return {}                       1//返回结果集
     */
    bannerParameter: function (req, res) {

        var msg = msg || {};
        msg.status = req.param('status', 1);
        msg.order = req.param('order', 0);
        msg.linktype = req.param('linktype', 0);
        msg.bannerurl = req.param('bannerurl', "不跳转");
        msg.rolnumber = req.param('rolnumber', 0);
        msg.bannertype = req.param('bannertype', 1);
        msg.storeid = req.param('storeid', 0);
        msg.bannername = req.param('bannername', "");
        msg.description = req.param('description', "");
        msg.bannerserial = req.param('bannerserial', 0);
        msg.bannersubname = req.param('bannersubname', "");
        msg.bannerpic = req.param('bannerpic', "");

        var categorety = categorety || {};
        categorety.bannner = 6                 //横幅模块   bannertype = 0;
        categorety.firstModule = 6             //第一模块   bannertype = 1;
        categorety.secondModule_A = 9          //第二模块 第一排 bannertype = 2 , rolnumber = 1;
        categorety.secondModule_B = 3          //第二模块 第二排 bannertype = 2 , rolnumber = 2;

        categorety.thirdModule = 6             //第三模块        bannertype = 3 , rolnumber = 1; 推荐banner，只能修改，不能删除;
                                               //第三模块        bannertype = 3 , rolnumber = 2; 图文类别， 可以 修改/删除;

        //console.log('bannerParameter: This is the function entry.  check it out: ', msg);

        if (req.session.mine) {
            msg.storeid = req.session.mine.storeid;
        }

        var isFind = true;
        if (msg.storeid == undefined) {
            isFind = false;
        }

        if (isFind) {
            Banner.find({
                storeid: msg.storeid,
                bannertype: msg.bannertype,
                rolnumber: msg.rolnumber
            }, function (err, bannerlist) {

                if (err) {
                    //console.log("err_tag1: When this error is returned, the query fails.", err);
                    return res.negotiate(err);
                }

                console.log('cb_tag1: The result of this \' find \' is shown came out. check it out: ', bannerlist.length);

                var bIsMax = false;
                switch (parseInt(msg.bannertype)) {
                    case 0:
                        bIsMax = (bannerlist.length >= categorety.banner);
                        break;

                    case 1:
                        bIsMax = (bannerlist.length >= categorety.firstModule);
                        break;

                    case 2:

                        var total = 0
                        for (var i = 0; i < bannerlist.length; i++) {
                            if (bannerlist[i].bannertype == 2) {
                                if (bannerlist[i].rolnumber == msg.rolnumber) {
                                    total = total + 1
                                }
                            }
                        }

                        if (msg.rolnumber == 1) {
                            bIsMax = (total >= categorety.secondModule_A);
                        } else {
                            bIsMax = (total >= categorety.secondModule_B);
                        }
                        break;

                    case 3:
                        var total = 0
                        for (var i = 0; i < bannerlist.length; i++) {
                            if (bannerlist[i].bannertype == 3) {
                                //第三模块推荐banner，只能修改，不能删除;
                                if (bannerlist[i].rolnumber == 1) {
                                    total = total + 1;
                                } else
                                //第三模块 图文类别，可以 修改/删除;
                                if (bannerlist[i].rolnumber == 2) {
                                    total = total + 1
                                }
                            }

                        }

                        bIsMax = (total >= categorety.thirdModule);
                        break;

                    default:
                        console.log('err: check it out: addBanner');
                }
                ;

                if (bIsMax) {
                    return res.json({
                        data: [],
                        code: 211
                    });
                }

                Banner.create(msg, function (err, newbanner) {

                    if (err) {
                        //console.log("err_tag2: When this error is returned, the query fails.", err);
                        return res.negotiate(err);
                    }

                    console.log('cb_tag2: The result of this \' create \' is shown came out. check it out: ok');
                    return res.json({
                        data: [],
                        code: 200
                    });
                });

            });
        } else {
            return res.json({
                data: [],
                code: 211
            });
        }
    },
    /**
     * 上传banner图片
     * @param req
     * @param res
     */
    uploadBannerImage: function (req, res) {
        upload.uploadFile(req, res, "banner", "banner");
    },

    /**
     * 更新banner
     *
     * @param  order                    //序号即为banner呈现在客户端的顺序，越大越前
     *  @param  id                    //产品id
     * @param  bannerserial             //baner编号
     * @param  bannername               //banner名称 标题
     * @param  bannersubname            //banner副标题
     * @param  bannertype               //0 banner,1第一推荐模块,2第2推荐模块,3第3推荐模块,4第4推荐模块
     * @param  rolnumber                //0 表示不区分第几排,1表示在第1排,2表示在第2排
     * @param  description              //banner描述
     * @param  bannerpic                //banner图片
     * @param  bannerurl                //banner地址
     * @param  linktype                 //0无效果,1外部链接,2内部链接,3商品专场,4自定义
     * @param  storeid                  //运营商id
     * @param  status                   //
     *
     * @return {}                       //返回结果集
     */
    updateBanner: function (req, res) {

        if (!req.session.mine) {
            return res.json({
                code: 400,
                msg: "请先登录再操作"
            });
        }
        var msg = msg || {};
        msg.id = req.param('id');                               //ID
        status = req.param('status', 0);
        msg.order = req.param('order');                         //序号即为banner呈现在客户端的顺序，越大越前
        msg.storeid = req.session.mine.storeid;                     //运营商编号
        msg.linktype = req.param('linktype');                   //0无效果,1外部链接,2内部链接,3商品专场,4自定义
        msg.bannerurl = req.param('bannerurl', '');
        msg.rolnumber = req.param('rolnumber');
        msg.bannertype = req.param('bannertype');
        msg.bannerpic = req.param('bannerpic', '');
        msg.bannername = req.param('bannername');               //banner副标题
        msg.description = req.param('description', '');
        msg.bannerserial = req.param('bannerserial');           //baner编号
        msg.bannersubname = req.param('bannersubname', '');         //0 banner,1第一推荐模块,2第2推荐模块,3第3推荐模块,4第4推荐模块



        function doUpdateBanner() {

            var ukey = ukey || {}, skey = skey || {};
            for (var key in msg) {

                if (msg[key] == undefined) {
                    delete msg[key];
                } else if (key == 'id') {

                    ukey[key] = msg[key];
                } else {

                    skey[key] = msg[key];
                }
            }
            skey["status"] = status;
            if (ukey.id == undefined || ukey.id == '') {
                return res.json({err: 'fail', code: 4015});
            }


            Banner.update(ukey).set(skey).exec(function (err, banner) {

                if (err) {
                    //console.log("err_tag1: information to add merchandise module;", err);
                    return res.negotiate(err);
                }

                console.log("cb_tag1: The result of this \' update \' is shown came out. check it out: ok");
                return res.json({
                    msg: "操作成功",
                    info: banner,
                    code: 200
                });
            });

        }

        if (msg.storeid != 0 && msg.bannertype == 3 && msg.rolnumber == 1) {//运营商修改自己的首页第三行banner推荐
            var condition = {storeid: msg.storeid, bannertype: 3, rolnumber: 1};

            Banner.findOne(condition).exec(function (err, banner) {

                if (err) {
                    //console.log("err_tag1: information to add merchandise module;", err);
                    return res.negotiate(err);
                }

                console.log(banner);
                for (key in msg) {
                    if (msg[key] == undefined) {
                        delete msg[key];
                    }
                }

                if (banner == undefined || banner == null || banner.length <= 0) {
                    delete msg.id;

                    Banner.create(msg).exec(function (err, record) {
                        if (err) {
                            //console.log("err_tag1: information to add merchandise module;", err);
                            return res.negotiate(err);
                        }
                        if (record) {
                            return res.json({
                                msg: "操作成功",
                                info: banner,
                                code: 200,
                            });
                        }
                    })
                } else {
                    doUpdateBanner();
                }
            });
        } else {

            doUpdateBanner();
        }

    },
    /**
     * 查看一条banner信息
     * id bannerid;
     * @param req
     * @param res
     */
    view: function (req, res) {
        var id = req.param("id");
        var mine = req.session.mine;
        var condition = {};
        if (!mine) {
            return res.json({
                code: 400,
                msg: "需要登录"
            });
        }

        condition.id = id;
        Banner.findOne(condition).exec(function (err, banner) {
            if (err)  return res.negotiate(err);
            if (banner) {
                if (banner.bannertype == 5) {//预售商品
                    var bannerurl = banner.bannerurl;
                    var url = JSON.parse(bannerurl);
                    var sku = url.params.sku;
                    var skuArray = sku.split("-");
                    var storeid = 0;
                    if (skuArray[1] != undefined) {
                        storeid = skuArray[1]
                    }
                    if (storeid > 0) {
                        var sql = "select sum(reserve10) as sale_count from mergoodsList4  where sku like '" + sku + "%'";
                        Creator.query(sql, function (err, val) {
                            if (err) {
                                return res.negotiate(err);
                            }
                            banner.presale = val[0]["sale_count"];
                            return res.json({
                                code: 200,
                                msg: "",
                                data: banner
                            });
                        });
                    } else {
                        return res.json({
                            code: 200,
                            msg: "",
                            data: banner
                        });
                    }

                } else {
                    return res.json({
                        code: 200,
                        msg: "",
                        data: banner
                    });
                }

            }
            return res.json({
                code: 400,
                msg: "没有数据",
                data: banner
            });
        });
    },
    getInline: function (req, res) {
        Innerlink.find().exec(function (err, records) {
            if (err)  return res.negotiate(err);
            if (records.length > 0) {
                return res.json({
                    code: 200,
                    msg: '',
                    data: records
                });
            }
            return res.json({
                code: 400,
                msg: '',
                data: ''
            });
        });
    },
    /**
     * ids banner组成的字符串2,3,4或者单个id 2
     * @param req
     * @param res
     */
    delete: function (req, res) {
        var ids = req.param("ids");
        if (!req.session.mine) {
            return res.json({
                code: 400,
                msg: "账户未登录"
            });
        }
        if (!ids) {
            return res.json({
                code: 400,
                msg: "ids参数未传"
            });
        }
        var mine = req.session.mine;
        var storeid = mine.storeid;
        var idArray = [];
        var nIds = (ids + "").split(",");

        for (var i = 0; i < nIds.length; i++) {
            idArray.push(parseInt(nIds[i]));
        }
        Banner.destroy({storeid: storeid, id: idArray}).exec(function (err, banner) {
            if (err)  return res.negotiate(err);
            //console.log(banner);
            if (banner.length > 0) {
                return res.json({
                    code: 200,
                    msg: "删除成功"
                });
            }
            return res.json({
                code: 400,
                msg: "删除失败"
            });
        });
    },
    /**
     * id
     * name 名称
     * sort  排序
     * title 标题
     * remark 额外信息
     * bannertype 1为功能区块1 ,2,为模块2，3为模块3，4为模块4， 5为预售
     * @param req
     * @param res
     */
    editBannerTitle: function (req, res) {
        if (!req.session.mine) {
            return res.json({
                code: 400,
                msg: "需要登录"
            });
        }
        var mine = req.session.mine;
        var id = req.param("id");
        var set = {};
        set.name = req.param("name", "");
        set.sort = req.param("sort", 0);
        set.title = req.param("title", "");
        set.remark = req.param("remark", "");
        set.bannertype = req.param("bannertype", 0);
        if (!set.bannertype) {
            return res.json({
                code: 400,
                msg: "bannertype未传递"
            });
        }
        for (key in set) {
            if (!set[key]) {
                delete set;
            }
        }

        set.storeid = mine.storeid;
        BannerTitle.findOne({storeid: set.storeid, bannertype: set.bannertype}).exec(function (err, title) {
            if (err) return res.negotiate(err);
            if (!title) {
                set.created_uid = mine.id;
                BannerTitle.create(set).exec(function (err, bannerTitle) {
                    if (err) return res.negotiate(err);
                    if (bannerTitle || bannerTitle != undefined) {
                        return res.json({
                            code: 200,
                            msg: "保存成功"
                        });
                    } else {
                        return res.json({
                            code: 400,
                            msg: "保存失败"
                        });
                    }
                });
            } else {
                BannerTitle.update({
                    bannertype: set.bannertype,
                    storeid: set.storeid
                }, set).exec(function (err, bannerTitle) {
                    if (err) return res.negotiate(err);
                    if (bannerTitle && bannerTitle != undefined) {
                        return res.json({
                            code: 200,
                            msg: "修改成功"
                        });
                    } else {
                        return res.json({
                            code: 400,
                            msg: "修改失败"
                        });
                    }
                });
            }
        });


    },

    /**
     * 修改内部链接
     * inline
     * @param req
     * @param res
     */
    editInlines: function (req, res) {

        var inline = req.param("inline");
        if (inline.length <= 0) {
            return res.json({
                code: 400,
                msg: "内部链接不能为空"
            });
        }
        var inlines = eval(inline);
        async.mapSeries(inlines, function (item, callback) {

            Innerlink.update({id: item.id}, item).exec(function (err, record) {
                if (err)  return res.negotiate(err);
                if (record) {
                    callback(null, item);
                }
            });
        }, function (err, result) {
            if (err) {
                return res.json({
                    code: 400,
                    msg: "修改失败:" + err.getMessage(),
                    data: result
                });
            }
            return res.json({
                code: 200,
                msg: "修改成功",
                data: result
            });
        });
    },
    /**
     * 获取banner的排序
     * @param req
     * @param res
     */
    getBannerSort:function (req,res) {

        console.log('getBannerSort: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var allParams = req.allParams();

        var storeid = mine.storeid;

        var queryBannerSql = "select id,`order`,bannerserial from banner where storeid="+storeid+" and bannertype=0 and `order` > 0 order by `order` ASC limit 5";
        console.log('queryBannerSql. check it out. ',queryBannerSql);
        Banner.query(queryBannerSql,function (err,list) {
            if(err) return;

            console.log('cb_tag1: The result of this \' findOne \' is shown came out. check it out: ',list.length);
            list = list || [];
            for(var i = 0; i<5; i++) {
                list[i] = list[i] || {};
                list[i].id = list[i].id || "";
                list[i].bannerserial = list[i].bannerserial || "";
                list[i].order = list[i].order || 0;
                if (list[i].order === 0) {
                    list[i].id = "";
                }
            }

            var temp,idx;
            for(var i = 1; i<6; i++) {
                idx = i - 1;
                temp = [];
                for(var j = 0; j<5; j++) {
                    if (list[j].order === i) {
                        temp[idx] = list[idx];
                        list[idx] = list[j];
                        list[j] = temp[idx];
                        break;
                    }
                }
            }

            return res.json({
                code:200,
                data:list
            });

            // if(banners&&banners.length>0){
            //     return res.json({
            //         code:200,
            //         data:banners
            //     });
            // }else{
            //     return res.json({
            //         code:400,
            //         msg:"没有数据"
            //     });
            // }
        })

        // var mine=req.session.mine;
        // if(!mine){
        //     return res.json({
        //         code:400,
        //         msg:"需要登录"
        //     });
        // }
        // var storeid=mine.storeid;
        // var sql="select id,`order` from banner where storeid="+storeid+" AND bannertype=0 order by `order` ASC limit 5";
        // //console.log(sql);
        // Banner.query(sql,function (err,banners) {
        //     if(err) return res.negotiate(err);
        //     if(banners&&banners.length>0){
        //         return res.json({
        //             code:200,
        //             data:banners
        //         });
        //     }else{
        //         return res.json({
        //             code:400,
        //             msg:"没有数据"
        //         });
        //     }
        // })
    },
    /**
     * 设置banner排序
     * @param sort json [{id:2,order:1},{id:3,order:2}]
     * @param req
     * @param res
     */
    setBannerSort:function (req,res) {

        console.log('setBannerSort: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var allParams = req.allParams();

        var storeid = mine.storeid;
        var listItem = allParams.sort;

        if (!listItem.length) {
            return res.json({
                code: 200,
                data: []
            });
        }

        var updateStr="CASE id";
        var whereArray=[];
        for(var i = 0; i<listItem.length; i++){
            var id = listItem[i].id || 0;
            var order = listItem[i].order;
            updateStr +=" WHEN " +id + " THEN " + order + "";
            whereArray.push(id);
        }

        updateStr +=" END ";
        var updateSql="UPDATE banner set `order`="+updateStr+" WHERE id in("+whereArray.join(",")+") AND storeid="+storeid;

        console.log('queryBannerSql. check it out. ',updateSql);
        Banner.query(updateSql,function (err,list) {
            if(err) return;

            list = list || [];
            console.log('cb_tag1: The result of this \' findOne \' is shown came out. check it out: ',list.length);
            return res.json({
                code:200,
                msg:"修改成功"
            });
        })



        // var order=req.param("sort");
        // var mine=req.session.mine;
        // if(!mine){
        //     return res.json({
        //         code:400,
        //         msg:"需要登录"
        //     });
        // }
        // if(!order){
        //     return res.json({
        //         code:400,
        //         msg:"参数不全"

        //     });
        // }
        // var storeid=mine.storeid;
        // var updateStr="CASE id";
        // var whereArray=[];
        // for(var i=0;i<order.length;i++){
        //     var id=parseInt(order[i].id)||0;
        //     updateStr+=" WHEN "+id+" THEN "+parseInt(order[i].order)+"";
        //     whereArray.push(id);
        // }
        // updateStr+=" END ";
        // //console.log(whereArray);
        // var updateSql="UPDATE banner set `order`="+updateStr+" WHERE id in("+whereArray.join(",")+") AND storeid="+storeid;
        // //console.log(updateSql);
        // Banner.query(updateSql,function (err,banners) {
        //     if(err) return res.negotiate(err);
        //     if(banners){
        //         return res.json({
        //             code:200,
        //             msg:"修改成功"
        //         });
        //     }else{
        //         return res.json({
        //             code:400,
        //             msg:"修改失败"
        //         });
        //     }
        // })

    },
    /**
     * 添加内部链接
     * labelname 显示标签
     * url 内部链接url
     * params 内部链接参数
     * @param req
     * @param res
     */
    addInline: function (req, res) {
        var set = {};
        set.labelname = req.param("labelname");
        set.url = req.param("url");
        set.params = req.param("params");
        Innerlink.findOne({or: [{labelname: set.labelname}, {url: set.url}]}).exec(function (err, record) {
            if (err)  return res.negotiate(err);
            if (!record) {
                Innerlink.create(set).exec(function (err, inline) {
                    if (err)  return res.negotiate(err);
                    if (inline) {
                        return res.json({
                            code: 200,
                            msg: "添加成功",
                            data: inline,
                        });
                    }
                    return res.json({
                        code: 400,
                        msg: "添加失败"
                    });
                });
            } else {
                return res.json({
                    code: 400,
                    msg: "数据已经存在"
                });
            }

        });
    },
    /**
     * 设置栏目显示顺序
     * @param channels json 栏目排序的[{id:1,sort:2},{id:2,sort:1}]
     * @param req
     * @param res
     * @returns {*}
     */
    setSort:function (req,res) {
        
        var mine=req.session.mine;
        var channels=req.param("channels");
         if(channels.length<=0){
             return res.json({
                 code:400,
                 msg:"保存失败"
             });
         }
        // console.log("========================");
        // console.log(channels);
        // console.log("========================");
        async.mapSeries(channels,function (item,cb) {
            GoodsRecommend.update({id:item.id,storeid:mine.storeid}).set({sort:item.sort}).exec(cb);
        },function (err,ret) {
            if(err) return res.negotiate(err);
            if(ret&&ret.length>0){
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
     * 后台获取首页底部的推荐
     * @param position int 显示位置 1是首页 不传默认是1
     * @param req
     * @param res
     */
    getMyRecommend:function (req,res) {
        var position=req.param("position",1);
        var mine=req.session.mine;
        GoodsRecommend.find({storeid:mine.storeid,position:position,sort:{"sort":"ASC"}}).exec(function (err,cateogries) {
            if(err) return res.negotiate(err);
            if(cateogries&&cateogries.length>0){
                return res.json({
                    code:200,
                    data:cateogries
                })
            }else{
                return res.json({
                    code:400,
                    msg:"没有数据"
                });
            }
        });
    },
    /**
     * 获取推荐详情和产品列表
     * @param position int 显示位置 1是首页 不传默认是1
     * @param channel int 栏目的id
     * @param category int 分类id
     * @param req
     * @param res
     * @returns {*}
     */
    getMyRecommendGoodsByChanel:function (req,res) {
        var position=req.param("position",1);
        var channel=req.param("channel");
        var category=req.param("category");
       
        var mine=req.session.mine;
        if(!channel||!category){
            return res.json({
                code:400,
                msg:"参数不全"
            });
        }
        async.series({
            all:function (cb) {
                if(mine.storeid){
                    var sql="select name,sku,imagedefault from mergoodsList"+mine.storeid+" where status=3 AND goodsseries=0 AND parentid="+parseInt(category);
                    Creator.query(sql,cb);
                }else{
                    Creator.query("show tables like 'mergoodsList%'",function (err,tables) {
                        if (err) return cb(err,null);
                        if(tables&&tables.length>0){
                            var sql="";
                            tables.forEach(function (table) {
                                sql+="select name,sku,imagedefault from "+table['Tables_in_oneinstack (mergoodsList%)']+" where status=3 AND goodsseries=0 AND parentid="+parseInt(category)+" UNION ";
                            });
                            var sql=sql.substring(0,sql.length-6);
                            Creator.query(sql,cb);
                        }
                    });
                }

            },
            add:function (cb) {
                GoodsRecommend.findOne({id:channel,storeid:mine.storeid,sort:{"sort":"ASC"}}).exec(cb);
            }
        },function(err,ret){
            if(err) return res.negotiate(err);
            console.log(ret);
            var dat=ret.add||{};
            dat.goods=ret.all;
            return res.json({
                code:200,
                data:dat
            });
        });

    },
    /**
     * 添加首页底部的推荐
     * @param cid int 栏目所关联分类id
     * @param cname string 栏目显示名称
     * @param sname string 分类原显示名称
     * @param sort int 栏目排序
     * @param position int 显示位置 1是首页 不传默认是1
     * @param goods string 商品sku组成的字符串，用,号分割
     * @param req
     * @param res
     */
    addRecommend:function (req,res) {
        var cid=req.param("cid");
        var cname=req.param("cname");
        var sname=req.param("sname");
        var sort=req.param("sort");
        var position=req.param("position",1);
        var goods=req.param("goods",0);

        var mine=req.session.mine;

        GoodsRecommend.findOne({cname:cname,storeid:mine.storeid,position:position}).exec(function (err,category) {
            if(err) return res.negotiate(err);
            if(category){
               return res.json({
                   code:400,
                   msg:"栏目已存在",
               })
            }else{ //栏目不存在
                var cat={
                    cid:cid,
                    cname:cname,
                    sname:sname,
                    storeid:mine.storeid,
                    position:position,
                    sort:sort,
                    skus:goods
                };
                GoodsRecommend.create(cat).exec(function (err,record) {
                     if(err) return res.negotiate(err);
                    console.log(record);
                     if(record){
                         res.json({
                             code:200,
                             data:record
                         });
                     }else{
                         res.json({
                             code:400,
                             msg:"操作失败"
                         });
                     }
                 });

            }
        });
    },
    /**
     * 编辑首页推荐
     * @param cid int 栏目所关联分类id
     * @param cname string 栏目显示名称
     * @param sname string 栏目原显示名称
     * @param sort int 栏目排序
     * @param position int 显示位置 1是首页 不传默认是1
     * @param goods string 商品sku组成的字符串，用,号分割
     * @param id int 栏目的id
     * @param req
     * @param res
     */
    editRecommend:function (req,res) {
        var cid=req.param("cid");
        var cname=req.param("cname");
        var sname=req.param("sname");
        var sort=req.param("sort");
        var position=req.param("position",1);
        var goods=req.param("goods",0);
        var id=req.param("id",0);

        var mine=req.session.mine;
        GoodsRecommend.findOne({cname:cname,storeid:mine.storeid,position:position,id:{"!":id}}).exec(function (err,category) {
            if(err) return res.negotiate(err);
            if(category){
                return res.json({
                    code:400,
                    msg:"栏目已存在",
                })
            }else{ //栏目不存在
                var cat={
                    cid:cid,
                    sort:sort,
                    cname:cname,
                    skus:goods
                };
                if(sname) cat.sname=sname;
                GoodsRecommend.update({storeid:mine.storeid,id:id}).set(cat).exec(function (err,record) {
                    if(err) return res.negotiate(err);
                    if(record){
                        res.json({
                            code:200,
                            data:record
                        });
                    }else{
                        res.json({
                            code:400,
                            msg:"操作失败"
                        });
                    }
                });

            }
        });
    },
    
    /**
     * 删除单条推荐栏目
     * @param channel int 栏目id
     * @param req
     * @param res
     * @returns {*}
     */
    deleteRecommend:function (req,res) {
        var id=req.param("channel");
        var mine=req.session.mine;
       
        GoodsRecommend.destroy({id:parseInt(id)}).exec(function (err,ret) {
            if(err) return res.negotiate(err);
            if(ret){
                return res.json({
                    code:200,
                    msg:"操作成功"
                });
            }else{
                return res.json({
                    code:400,
                    msg:"操作失败"
                });
            }

        });
    },
    /**
     * 获取首页底部的推荐
     * @param num int 每次获取多少个栏目
     * @param page int 当前第几页
     * @param tokenId string 用户token
     * @param mId int 用户id
     * @param position int 显示位置 1是首页显示，不传默认是1
     * @param req
     * @param res
     * @returns {*}
     */
     getIndexRecommend:function (req,res) {
         var num=req.param("num",0);
         var page=req.param("page",1);
         var tokenId = req.param("tokenId", 0);
         var mId = req.param("mId", 0);
         var position = req.param("position", 1);
         var vid=req.param("vid");
         
         common.getLoginUser(req, tokenId, mId, function (err,ret) {
             if (err) return res.negotiate(err);
             if(ret&&ret.code==200){
                 var member=ret.user;

                 var currentStore=member.operatorno;//默認取打令的推薦商品
                 var currentStore=4;
                 var offset=(page-1)*num;
                 async.series({
                     goods:function (next) {
                          var condition={storeid:currentStore,position:position};
                         if(vid){
                             condition.id=vid;
                         }else{
                             if(num){
                                 condition.skip=offset;
                                 condition.limit=num;
                             }
                             condition.sort={"sort":"ASC"};
                             condition.skus={"!":''};
                         }
                         console.log("getIndexRecommend. ",condition);
                         GoodsRecommend.find(condition).exec(function (err,recommend) {
                             if(err) return res.negotiate(err);
                             if(recommend&&recommend.length>0){
                                 async.mapSeries(recommend,function (item,cb) {
                                    console.log('item. ',item.cname);
                                     var skus=item.skus;
                                     var skuArrays=skus.split(",");
                                     if(vid){
                                         if(num){
                                             var skuArray=skuArrays.unique().slice(offset,parseInt(num)+parseInt(offset));
                                         }else{
                                             var skuArray=skuArrays.unique();
                                         }

                                     }else{
                                         if(num){
                                             var skuArray=skuArrays.unique().slice(0,6);
                                         }else{
                                             var skuArray=skuArrays.unique();
                                         }

                                     }
                                     if(!skus||skus.length<=0||skuArray.length<=0){
                                         cb(null,null);
                                     }else{

                                         var skusArray=[];
                                         skuArray.forEach(function (sku) {
                                             skusArray.push("'"+sku+"'");
                                         });
                                         var sql="select id,storecategoryid,propertyvaluelist,brandid,storeid,name,keywords,sku,imagedefault,type," +
                                             "attachment,price,pricepoint,pricepromotion,deposit,premoneey,seckillingtime,seckillingprice,seckillingstock,"+
                                             "seckillingexplain,homeseckillingprice,seckillingdescription,isseckilling,seckillingflow,seckillingsell,(select count(*)  from mergoodsList"+currentStore
                                             +"  where goodsseries=0 AND parentid="+item.cid+" AND status=3) as cnt from mergoodsList"+currentStore+" where sku in ("+skusArray.join(",")+")";
                                         console.log("getIndexRecommend. sql. ",sql);
                                         Creator.query(sql,function (err,goods) {
                                             cb(err,function(goods,skuArray,skuArrays){
                                                 console.log("getIndexRecommend. skuArray. ",skuArray);
                                                 var products=[];
                                                 var cnt=0;
                                                 if(goods&&goods.length>0){
                                                     cnt=goods[0].cnt;
                                                     skuArray.forEach(function (sku) {
                                                         console.log("getIndexRecommend. sku. ",sku);
                                                         goods.forEach(function (product) {
                                                             if(sku==product.sku){
                                                                 delete product.cnt;
                                                                 products.push(product);
                                                             }
                                                         });
                                                     });
                                                 }

                                                 return {
                                                     id:item.id,
                                                     cid:item.cid,
                                                     cname:item.cname,
                                                     sname:item.sname,
                                                     sort:item.sort,
                                                     goods:products,
                                                     count:cnt
                                                 };
                                             }(goods,skuArray,skuArrays));

                                         });
                                     }
                                 }, next);
                             }else{
                                 next(err,null);
                             }
                         });
                     },
                     count:function (next) {
                         GoodsRecommend.countByStoreid(currentStore).exec(next);
                     }
                 },function (err,ret) {
                     if(err) return res.negotiate(err);
                     if(ret.count>0&&ret.goods&&ret.goods.length>0&&ret.goods[0]){
                         return res.json({
                             code:200,
                             data:ret
                         });
                     }else{
                         return res.json({
                             code:400,
                             msg:"没有数据"
                         });
                     }
                 });

             }else{
                 return res.json({
                     code: 400,
                     msg: "用户未登录，或登录已失效"
                 });
             }
         });
     },


};
