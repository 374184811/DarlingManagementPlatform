/**
 * AppinfoController
 *
 * @description :: Server-side logic for managing Appinfoes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var fs=require("fs");
module.exports = {
    /**
     *
     * 上传app文件
     * @param app file 上传的app
     * `AppinfoController.upload()`
     */
    upload: function (req, res) {
        upload.uploadFile(req, res, "app", "static");
    },
    /**
     * 显示app版本信息列表
     * @param platform string 平台ios|android 非必传
     * `AppinfoController.index()`
     */
    index: function (req, res) {
        var platform = req.param("platform");
        var condition = {};
        if (platform) {
            condition = {platform: platform};
        }
        Appinfo.find({
            where: condition,
            sort: "version DESC"
        }).exec(function (err, info) {
            if (err) return res.negotiate(err);
            if (info.length) {
                return res.json({
                    code: 200,
                    data: info
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
     * 添加app信息
     * @param name string app名称
     * @param version string app版本号
     * @param remark string app更新描述
     * @param icon string app图标
     * @param size string app大小
     * @param url string app上传地址
     * @param platform string app上传地址
     * `AppinfoController.add()`
     */
    add: function (req, res) {
        var msg = req.allParams();
        Appinfo.create(msg).exec(function (err, appInfo) {
            if (err) return res.negotiate(err);
            if (appInfo) {
                sails.sockets.broadcast('appupdate', 'upgradge', { version: appInfo.version}, req);
                return res.json({
                    code: 200,
                    msg: "保存成功",
                    data: appInfo
                });
            } else {
                return res.json({
                    code: 400,
                    msg: "保存失败"
                });
            }
        });

    },
    /**
     * 删除app
     * @param id int 记录id
     * `AppinfoController.delete()`
     */
    delete: function (req, res) {

        var id = req.param("id", false);
        Appinfo.destory({id: id}).exec(function (err, appInfo) {
            if (err) return res.negotiate(err);
            if (appInfo) {
                var filePath=appInfo.url;
                if(filePath){

                    fs.unlinkSync(filePath);
                }
                return res.json({
                    code: 200,
                    msg: "删除成功"
                });
            } else {
                return res.json({
                    code: 400,
                    msg: "删除失败"
                });
            }
        });

    },

    /**
     * 下载app
     * @param version string app版本
     * @param platform string app平台
     * `AppinfoController.download()`
     */
    download: function (req, res) {
        var curVersion = req.param("version", 0);
        var platform = req.param("platform", false);
        Appinfo.findOne({
            where: {platform: platform, version: {">": curVersion}},
            sort: "version DESC"
        }).exec(function (err, info) {
            if (err) return res.negotiate(err);
            if (info) {
                var filepath = info.url;
                var extension=filepath.substring(filepath.lastindexOf(".")+1,filepath.length);
                return res.download(filepath, info.name+"_"+info.version+"."+extension);
            } else {
                return res.json({
                    code: 400,
                    msg: "没有最新版本app下载"
                });
            }
        });

    },

    upgradge: function (req, res) {
        if(!req.isSocket){
            return res.badRequest();
        }
        sails.sockets.join(req, 'appupdate');
        // var version=req.param("version");

        var curVersion = req.param("version", 0);
        var platform = req.param("platform", false);
        var channel = req.param("channel", false);
        if (platform == false) {
            return res.json({
                code: 400,
                msg: "平台不能为空"
            });
        }

        var condition={platform: platform, version: {">": curVersion}};

        if(platform=="android"){
            condition.channel=channel;
        }
        Appinfo.findOne({
            where:condition,
            sort: "version DESC"
        }).exec(function (err, info) {
            if (err) return res.negotiate(err);
            if (info) {
                delete info.url;
                return res.json({
                    code: 200,
                    data: info
                });
            } else {
                return res.json({
                    code: 400,
                    msg: "你的app是最新版本"
                });
            }
        });

    },

    /**
     * 检测app版本
     * @param version string app版本
     * @param platform string app平台
     * `AppinfoController.checkVersion()`
     */
    checkVersion: function (req, res) {
        var curVersion = req.param("version", 0);
        var platform = req.param("platform", false);
        var channel = req.param("channel", false);
        if (platform == false) {
            return res.json({
                code: 400,
                msg: "平台不能为空"
            });
        }

        var condition={platform: platform, version: {">": curVersion}};

        if(platform=="android"){
            condition.channel=channel;
        }

        Appinfo.findOne({
            where:condition,
            sort: "version DESC"
        }).exec(function (err, info) {
            if (err) return res.negotiate(err);
            console.log(info);
            if (info) {
                delete info.url;
                return res.json({
                    code: 200,
                    data: info
                });
            } else {
                return res.json({
                    code: 400,
                    msg: "你的app是最新版本"
                });
            }
        });

    }
};

