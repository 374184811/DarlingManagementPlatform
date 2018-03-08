var bannerController = require('../publicController/bannerController')


module.exports = {
    accountActivation: function (req, res) {
        return bannerController.accountActivation(req, res)
    },

    /**
     * 首页推荐显示的banner
     * @param req
     * @param res
     */
    getindexbanner: function (req, res) {
        return bannerController.getindexbanner(req, res)
    },

    /**
     * 获取banner和推荐
     * backend 是否是后台
     * @param req
     * @param res
     */
    gettopBanner: function (req, res) {
        return bannerController.gettopBanner(req, res)
    },
    /**
     * 后台获取首页banner列表
     * @param req
     * @param res
     */
    bannerlist: function (req, res) {
        return bannerController.bannerlist(req, res)
    },
    /**
     * 后台获取首页推荐模块列表
     * @param req
     * @param res
     */
    modularlist: function (req, res) {
        return bannerController.modularlist(req, res)
    },
    /**
     * type 类型
     * row 第几行
     * @param req
     * @param res
     */
    fetchbanner: function (res, condition, isBack, storeid) {
        return bannerController.fetchbanner(res, condition, isBack, storeid)
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
        return bannerController.bannerParameter(res, condition, isBack, storeid)
    },
    /**
     * 上传banner图片
     * @param req
     * @param res
     */
    uploadBannerImage: function (req, res) {
        return bannerController.uploadBannerImage(req, res)
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
        return bannerController.updateBanner(req, res)
    },
    /**
     * 查看一条banner信息
     * id bannerid;
     * @param req
     * @param res
     */
    view: function (req, res) {
        return bannerController.view(req, res)
    },
    getInline: function (req, res) {
        return bannerController.getInline(req, res)
    },
    /**
     * ids banner组成的字符串2,3,4或者单个id 2
     * @param req
     * @param res
     */
    delete: function (req, res) {
        return bannerController.delete(req, res)
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
        return bannerController.editBannerTitle(req, res)
    },

    /**
     * 修改内部链接
     * inline
     * @param req
     * @param res
     */
    editInlines: function (req, res) {
        return bannerController.editInlines(req, res)
    },
    /**
     * 获取banner的排序
     * @param req
     * @param res
     */
    getBannerSort:function (req,res) {
        return bannerController.getBannerSort(req, res)
    },
    /**
     * 设置banner排序
     * @param sort json [{id:2,order:1},{id:3,order:2}]
     * @param req
     * @param res
     */
    setBannerSort:function (req,res) {
        return bannerController.setBannerSort(req, res)
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
        return bannerController.addInline(req, res)
    },
    /**
     * 设置栏目显示顺序
     * @param channels json 栏目排序的[{id:1,sort:2},{id:2,sort:1}]
     * @param req
     * @param res
     * @returns {*}
     */
    setSort:function (req,res) {
        return bannerController.setSort(req, res)
    },

    /**
     * 后台获取首页底部的推荐
     * @param position int 显示位置 1是首页 不传默认是1
     * @param req
     * @param res
     */
    getMyRecommend:function (req,res) {
        return bannerController.getMyRecommend(req, res)
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
        return bannerController.getMyRecommendGoodsByChanel(req, res)
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
        return bannerController.addRecommend(req, res)
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
        return bannerController.editRecommend(req, res)
    },

    /**
     * 删除单条推荐栏目
     * @param channel int 栏目id
     * @param req
     * @param res
     * @returns {*}
     */
    deleteRecommend:function (req,res) {
        return bannerController.deleteRecommend(req, res)
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

        var allParams = req.allParams();

        //var vid = allParams.vid;
        var num = allParams.num;
        var mId = allParams.mId;
        var page = allParams.page;
        var tokenId = allParams.tokenId;
        var position = allParams.position;
        console.log("page..........",page)

        //var skip = (page - 1) * num
        var userinfo = redis.getUserInfo();
        //console.log("userinfo. ",userinfo);

        var condition = { };
        //condition.skip = skip;
        condition.position = position;
        condition.storeid = userinfo.operatorno || 4;

        condition.skus = {"!": ''};
        condition.sort = { "sort": "ASC"};

        console.log("condition. ",condition);

        //特殊处理
        if (!_.parseInt(page) || utils.isPassBuffer(page)) {
            return res.json({
                code: 403,
                data: [],
            });
        }

        GoodsRecommend.find(condition).exec(function (err,list) {
            if (err) return;

            var dataArray = [];
            var len = list.length;
            // console.log('len. ', len);

            async.times(len, function(n, next) {

                var item = list[n];
                var skus = item.skus || "";
                var skuArray = skus.split(",");

                //去重元素
                skuArray = skuArray.unique()
                var _skuArrayu = [];
                skuArray.forEach(function (sku) {
                     _skuArrayu.push("'" + sku + "'");
                });

                var queryMGoodsSql = "",currentStore = condition.storeid;
                queryMGoodsSql += "select id,storecategoryid,propertyvaluelist,brandid,storeid,name,keywords,sku,imagedefault,type,";
                queryMGoodsSql += "attachment,price,pricepoint,pricepromotion,deposit,premoneey,seckillingtime,seckillingprice,seckillingstock,homenormalprice,";
                queryMGoodsSql += "seckillingexplain,homeseckillingprice,seckillingdescription,isseckilling,seckillingflow,seckillingsell,(select count(*)  from mergoodsList" + currentStore;
                queryMGoodsSql += "  where goodsseries=0 AND parentid=" + item.cid +" AND status=3) as cnt from mergoodsList" + currentStore + " where sku in (" + _skuArrayu.join(",") + ")";
                console.log("queryMGoodsSql. check it out. ",queryMGoodsSql);

                Creator.query(queryMGoodsSql,function (err,goodslist) {
                    var products = [],cnt = 0;
                    for(var i = 0; i<goodslist.length; i++) {
                        var goods = goodslist[i];
                        cnt = goods.cnt;

                        if (skuArray.indexOf(goods.sku)>-1) {
                            delete goods.cnt;
                            products.push(goods);
                        }
                    }

                    var sortProducts = [];
                    for(var i = 0; i<skuArray.length; i++) {
                        sortProducts.push(_.find(products, _.matchesProperty("sku",skuArray[i])));
                    }

                    var id = item.id;
                    var cid = item.cid;
                    var sort = item.sort;
                    var goods = sortProducts;
                    var cname = item.cname;
                    var sname = item.sname;

                    dataArray.push({id,cid,sort,goods,cname,sname,count:cnt});
                    next(err,n);
                });

            }, function(err, r) {

                dataArray = _.sortBy(dataArray, 'sort');
                if (_.parseInt(page) === -1) {
                    var data = { goods:[],count: len - 1};
                    for(var i = 0; i<dataArray.length;i++) {
                        data.goods.push(dataArray[i]);
                    }

                    return res.json({
                        code: 200,
                        timestamp: (new Date()).getTime(),
                        data: data,
                    });
                }
                else if(_.isUndefined(dataArray[page-1])) {
                    return res.json({
                        code: 400,
                        data: [],
                    });
                }else{
                    var data = { goods:[dataArray[page-1]],count: len - 1}
                    return res.json({
                        code: 200,
                        timestamp: (new Date()).getTime(),
                        data: data,
                    });
                }

            });
        })

         // common.getLoginUser(req, tokenId, mId, function (err,ret) {
         //     if (err) return res.negotiate(err);
         //     if(ret&&ret.code==200){
         //         var member=ret.user;

         //         var currentStore=member.operatorno;//默認取打令的推薦商品
         //         var currentStore=4;
         //         var offset=(page-1)*num;
         //         async.series({
         //             goods:function (next) {
         //                  var condition={storeid:currentStore,position:position};
         //                 if(vid){
         //                     condition.id=vid;
         //                 }else{
         //                     if(num){
         //                         condition.skip=offset;
         //                         condition.limit=num;
         //                     }
         //                     condition.sort={"sort":"ASC"};
         //                     condition.skus={"!":''};
         //                 }
         //                 console.log("getIndexRecommend. ",condition);
         //                 GoodsRecommend.find(condition).exec(function (err,recommend) {
         //                     if(err) return res.negotiate(err);
         //                     if(recommend&&recommend.length>0){
         //                         async.mapSeries(recommend,function (item,cb) {
         //                            console.log('item. ',item.cname);
         //                             var skus=item.skus;
         //                             var skuArrays=skus.split(",");
         //                             if(vid){
         //                                 if(num){
         //                                     var skuArray=skuArrays.unique().slice(offset,parseInt(num)+parseInt(offset));
         //                                 }else{
         //                                     var skuArray=skuArrays.unique();
         //                                 }

         //                             }else{
         //                                 if(num){
         //                                     var skuArray=skuArrays.unique().slice(0,6);
         //                                 }else{
         //                                     var skuArray=skuArrays.unique();
         //                                 }

         //                             }
         //                             if(!skus||skus.length<=0||skuArray.length<=0){
         //                                 cb(null,null);
         //                             }else{

         //                                 var skusArray=[];
         //                                 skuArray.forEach(function (sku) {
         //                                     skusArray.push("'"+sku+"'");
         //                                 });
         //                                 var sql="select id,storecategoryid,propertyvaluelist,brandid,storeid,name,keywords,sku,imagedefault,type," +
         //                                     "attachment,price,pricepoint,pricepromotion,deposit,premoneey,seckillingtime,seckillingprice,seckillingstock,"+
         //                                     "seckillingexplain,homeseckillingprice,seckillingdescription,isseckilling,seckillingflow,seckillingsell,(select count(*)  from mergoodsList"+currentStore
         //                                     +"  where goodsseries=0 AND parentid="+item.cid+" AND status=3) as cnt from mergoodsList"+currentStore+" where sku in ("+skusArray.join(",")+")";
         //                                 console.log("getIndexRecommend. sql. ",sql);
         //                                 Creator.query(sql,function (err,goods) {
         //                                     cb(err,function(goods,skuArray,skuArrays){
         //                                         console.log("getIndexRecommend. skuArray. ",skuArray);
         //                                         var products=[];
         //                                         var cnt=0;
         //                                         if(goods&&goods.length>0){
         //                                             cnt=goods[0].cnt;
         //                                             skuArray.forEach(function (sku) {
         //                                                 console.log("getIndexRecommend. sku. ",sku);
         //                                                 goods.forEach(function (product) {
         //                                                     if(sku==product.sku){
         //                                                         delete product.cnt;
         //                                                         products.push(product);
         //                                                     }
         //                                                 });
         //                                             });
         //                                         }

         //                                         return {
         //                                             id:item.id,
         //                                             cid:item.cid,
         //                                             cname:item.cname,
         //                                             sname:item.sname,
         //                                             sort:item.sort,
         //                                             goods:products,
         //                                             count:cnt
         //                                         };
         //                                     }(goods,skuArray,skuArrays));

         //                                 });
         //                             }
         //                         }, next);
         //                     }else{
         //                         next(err,null);
         //                     }
         //                 });
         //             },
         //             count:function (next) {
         //                 GoodsRecommend.countByStoreid(currentStore).exec(next);
         //             }
         //         },function (err,ret) {
         //             if(err) return res.negotiate(err);
         //             if(ret.count>0&&ret.goods&&ret.goods.length>0&&ret.goods[0]){
         //                 return res.json({
         //                     code:200,
         //                     timestamp:(new Date()).getTime(),
         //                     data:ret
         //                 });
         //             }else{
         //                 return res.json({
         //                     code:400,
         //                     msg:"没有数据"
         //                 });
         //             }
         //         });

         //     }else{
         //         return res.json({
         //             code: 400,
         //             msg: "用户未登录，或登录已失效"
         //         });
         //     }
         // });
        //return bannerController.getIndexRecommend(req, res)
     },
};
