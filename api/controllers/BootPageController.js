/**
 * BootPageController
 *
 * @description :: Server-side logic for managing bootpages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    /**
     * 获取广告管理数据
     * @param req
     * @param res
       */
    get: function (req, res) {
        console.log(req.ip,req.path);
        console.log('get: This is the function entry.  check it out: ', req.allParams());

        var mine = req.session.mine;

        //console.log('mine: check it out: ',mine);
        var storeid = mine.storeid;
        Bootpage.find({or:[{storeid: storeid},{storeid:0}]}).exec(function (err, Bootpages) {
            if (err)  return res.negotiate(err);

            if(Bootpages.length>0){
                var bootPage=null;
                Bootpages.forEach(function(item){

                    if(item.storeid==storeid){
                        bootPage=item;
                    }else{
                        if(bootPage==null){
                            bootPage=item;
                        }
                    }
                });
                return res.json({
                    code:200,
                    data:bootPage
                });
            }else{
                return res.json({
                    code:400,
                    data:"没有数据"
                });

            }
        });
    },
    /**
     * 广告管理设置
     * @param req
     * @param res
       */
    set: function (req, res) {
        console.log(req.ip,req.path);

        var mine = req.session.mine;
        var picurl = req.param("picurl", '');
        var linkurl = req.param("linkurl", '');
        var linktype = req.param("linktype", 0);
        var status = req.param("status", 0);
        var createdAt = (new Date()).Format('yyyy-MM-dd hh:mm:ss ');

        var set = {
            picurl: picurl,
            linkurl: linkurl,
            linktype: linktype,
            status: status,
            createdAt: createdAt
        };
        var storeid = mine.storeid;
        Bootpage.findOne({storeid: storeid}).exec(function (err, botpage) {
            if (err)  return res.negotiate(err);
            if (botpage) {
                Bootpage.update({storeid: storeid}, set).exec(function (err, record) {
                    if (err)  return res.negotiate(err);
                    if (record) {
                        return res.json({
                            code: 200,
                            msg: "更新成功"
                        });
                    }
                    return res.json({
                        code: 400,
                        msg: "更新失败"
                    });
                });
            } else {
                set.storeid = storeid;

                Bootpage.create(set).exec(function (err, record) {
                    if (err)  return res.negotiate(err);
                    if (record) {
                        return res.json({
                            code: 200,
                            msg: "设置成功"
                        });
                    }
                    return res.json({
                        code: 400,
                        msg: "设置失败"
                    });
                })
            }
        });


    },
    /**
     * 上传图片文件
     * `SettingController.uploadImg()`
     */
    uploadImg: function (req, res) {
        console.log('uploadImg: This is the function entry.  check it out: ', req.allParams());

        upload.uploadFile(req, res, "pic", "static/bootpage");
    }

};

