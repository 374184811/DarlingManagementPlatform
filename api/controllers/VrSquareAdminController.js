/**
 * VRSquareController
 */
module.exports = {
  /**
   * 商户后台管理查询vr图片
   * @param req
   * @param req
   */
    selectVrPic:function(req,req){
        console.log(req.ip,req.path);

        var data = req.allParams();
        var retdata = {code:400,infor:'fail'};
        var selectObj = {};
        console.log("selectVr ==> ",data);

        if (data['title']!='') {
            selectObj.title = {'like':"%"+data['title']+"%"};
        }
        if (data['isdelete']!= -1) {
            selectObj.isdelete = data['isdelete'];
        }
        if (data['realname']!='') {
            selectObj.realname = {'like':"%"+data['realname']+"%"};
        }
        if (data['classify'] != '') {
            selectObj.classify = data['classify'];
        }
        if (data['createtime1']!=''&&data['createtime2']!='') {
            selectObj.createdAt = {'>=':data['createtime1'],'<=':data['createtime2']};
        }

        vrpicinfo.find(selectObj).exec(function(err, results) {
            if (err) {
                console.log(err);
                return;
            }
            retdata.code = 200;
            retdata.infor = 'ok';
            retdata.data = results;
            console.log(retdata.data.length);
            return res.json(retdata);
        });
    },
  /**
   * 商户后台vr图片详情接口
   * @param req
   * @param req
   */
    detailVrPic:function(req,res){
        console.log(req.ip,req.path);
        var data = req.allParams();

        vrpicinfo.findOne({id:data['id']}).exec(function(err, results) {
            if (err) {
                console.log(err);
                return;
            }
            retdata.code = 200;
            retdata.infor = 'ok';
            retdata.data = results;
            return res.json(retdata);
        });
    },
  /**
   * 商户后台vr图片修改接口
   * @param req
   * @param req
   */
    modifyVrPic:function(req,res){
        console.log(req.ip,req.path);
        var data = req.allParams();
        var set = {title:data['title'],classify:data['classify']}

        vrpicinfo.update({id:data['id']},set).exec(function(err, results) {
            if (err) {
                console.log(err);
                return;
            }
            retdata.code = 200;
            retdata.infor = 'ok';
            return res.json(retdata);
        });
    },
  /**
   * 商户后台vr图片删除接口
   * @param req
   * @param req
   */
    deleteVrPic:function(req,res){
        console.log(req.ip,req.path);
        var data = req.allParams();
        
        vrpicinfo.update({id:data['id']},{isdelete:1}).exec(function(err, results) {
            if (err) {
                console.log(err);
                return;
            }
            retdata.code = 200;
            retdata.infor = 'ok';
            return res.json(retdata);
        });
    },
  /**
   * 商户后台banner管理查询接口
   * @param req
   * @param req
   */
    selectBanner: function(req, res){
        console.log(req.ip,req.path);
        var allParams = req.allParams();
        var selectObj = {};

        if(typeof allParams.title == 'string'&&allParams.title!=''){
            selectObj.title = allParams.title;
        }else if(typeof allParams.bannernum == 'number'&&allParams.bannernum!=''){
            selectObj.bannernum = allParams.bannernum;
        }

        vrbanner.find(selectObj).exec(function(err,data){
            if(err){
                console.log(err);
                return;
            }
            return res.json({
                code:200,
                infor:'ok',
                data:data
            });
        });
    },
  /**
   * 商户后台banner添加接口
   * @param req
   * @param req
   */
    addBanner: function(req, res){
        console.log(req.ip,req.path);
        var allParams = req.allParams();

        var insertObj = {};
        insertObj.title = allParams.title;
        insertObj.bannerpic = allParams.bannerpic;
        insertObj.bannerurl = allParams.bannerurl;
        insertObj.linktype = allParams.linktype;
        insertObj.description = allParams.description;

        vrbanner.create(insertObj).exec(function(err,data){
            if(err){
                console.log(err);
                return;
            }
            return res.json({
                code:200,
                infor:'ok',
                data:data
            });
        });
    },
  /**
   * 商户后台banner删除接口
   * @param req
   * @param req
   */
    delBanner: function(req, res){
        var allParams = req.allParams();
        var delObj = {};
        delObj.id = allParams.id;

        vrbanner.destroy(delObj).exec(function(err,data){
            if(err){
                console.log(err);
                return;
            }
            return res.json({
                code:200,
                infor:'ok'
            });
        });
    },
  /**
   * 商户后台banner编辑修改接口
   * @param req
   * @param req
   */
    editBanner: function(req, res){
        console.log(req.ip,req.path);
        var allParams = req.allParams();

        var condition = {id:allParams.id};
        var updateObj = {};
        insertObj.title = allParams.title;
        insertObj.bannerpic = allParams.bannerpic;
        insertObj.bannerurl = allParams.bannerurl;
        insertObj.linktype = allParams.linktype;
        insertObj.description = allParams.description;

        vrbanner.update(condition,updateObj).exec(function(err,data){
            if(err){
                console.log(err);
                return;
            }
            return res.json({
                code:200,
                infor:'ok'
            });
        });
    },
    /*
     *标签管理接口
     */
    selectLabel: function(req, res){
        console.log(req.ip,req.path);
        var mine = req.session.mine;
        var allParams = req.allParams();

        var storeid = mine.storeid;
        var selectObj = {};

        async.auto({
            one:function(cb){
                var selectStr = "select count(*) as cnt,category from account where group by category";
                VRBanner.query(selectStr,function(err,result){
                    cb(err,result);
                });
            },
            two:['one',function(cb,data){
                var one = data.one;
                if(one.length>0){
                    vrpicinfo.bestNewPic(one,cb);
                } else {
                    cb(null,[]);
                }
            }]
        },function(err,results){
            if(err) return res.serverError(err);
            return res.json({
                code: 200,
                infor:'ok',
                data:results
            });
        });
    },
    /*
     *周期计算热点
     */
    calHotSpot: function(req, res){
        console.log(req.ip,req.path);

        var selectStr = "select clicknum,likenum,commentnum,cyclenum from vrpicinfo";
        VRBanner.find().exec(function(err,result){
            if (err){
                console.log(err);
                return;
            }
            if (result.length()>0){
                result.forEach(function(item){
                    //计算热点值
                    var hotSpot = item.clicknum*0.2+item.likenum*0.3+item.commentnum*0.5;
                    var cycleNum = 0;
                    if (cyclenum != 6){
                        cycleNum = cyclenum +1;
                    }

                    VRBanner.update({id:item.id},{hotspot:hotSpot,cyclenum:cycleNum}).exec(function(err,data){
                        if(err){
                            console.log(err);
                            return;
                        }
                    });
                });
            }
        });
    },
    /*
     *周期计算最新图片
     */
    calNewPic: function(req, res){
        console.log(req.ip,req.path);

        async.auto({
            one:function(cb){
                var selectStr = "select clicknum,likenum,commentnum from vrpicinfo";
                VRBanner.query(selectStr,function(err,result){
                    cb(err,result);
                });
            },
            two:['one',function(cb,data){
                var one = data.one;
                if(one.length>0){
                    vrpicinfo.bestNewPic(one,cb);
                } else {
                    cb(null,[]);
                }
            }]
        },function(err,results){
            if(err) return res.serverError(err);
            return res.json({
                code: 200,
                data:results
            });
        });
    },
};
