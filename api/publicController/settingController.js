/**
 * SettingController
 * @description :: Server-side logic for managing settings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var xss=require("xss");
module.exports = {
    /**
     * 要设置的键值
     *@param name 键名
     *@param title 键的名称
     *@param val 值
     */
    update: function (req, res) {
        console.log(req.ip,req.path);
        var mine = req.session.mine;
        
        var title = req.param("title", "");
        var key = req.param("name", false);
        var val = req.param("val", false);
       
        xss.whiteList.div = xss.whiteList.div || [];
        xss.whiteList.strike = xss.whiteList.strike || [];

        for (var key in xss.whiteList) {
            xss.whiteList[key].push("style", "class", "text-align", "height", "width");
        }
        val=xss(val);
        SystemSetting.findOne({key: key}).exec(function (err, setting) {
            if (err)  return res.negotiate(err);
            if (setting) {
                SystemSetting.update({key: key}, {value: val}).exec(function (err, record) {
                    if (err)  return res.negotiate(err);
                    if (record.length>0) {
                        return res.json({
                            code: 200,
                            msg: "设置成功"
                        });
                    }
                    return res.json({
                        code: 400,
                        msg: "设置失败"
                    });
                });
            } else {
                var data = {};
                data.name = title ? title : key;
                data.key = key;
                data.value = val;
                if (isNaN(val)) {
                    data.type = 1;
                } else {
                    data.type = 0;
                }

                data.is_system = 0;

                SystemSetting.create(data).exec(function (err, record) {
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
                });
            }
        });
    },
    /**
     * name 要获取的数据名称
     * @param req
     * @param res
     */
    get: function (req, res) {
        console.log(req.ip,req.path);
        var key = req.param("name", false);
        if (!key) {
            return res.json({
                code: 400,
                msg: "没有传递name"
            });
        }
        SystemSetting.findOne({key: key}).exec(function (err, record) {
            if (err)  return res.negotiate(err);
            if (record) {
                return res.json({
                    code: 200,
                    msg: "获取成功",
                    data: record
                });
            }
            return res.json({
                code: 400,
                msg: "获取失败"
            });
        });
    },

    /**
     * 上传图片文件
     * @param req
     * @param res
     */
    uploadImg: function (req, res) {
        console.log(req.ip,req.path);
        upload.uploadFile(req, res, "pic", "static");
    },
    /**
     * 通用设置多行设置
     * @param setting string[array] 必传
     * @param req
     * @param res
     */
    multiSet:function(req,res){
        console.log(req,res);
        var settings=req.allParams();
        if(!settings){
            return res.json({
                code:400,
                msg:"参数不能为空"
            });
        }
        
        var updateStr="CASE `key`";
         var whereArray=[];
        xss.whiteList.div = xss.whiteList.div || [];
        xss.whiteList.strike = xss.whiteList.strike || [];

        for (var key in xss.whiteList) {
            xss.whiteList[key].push("style", "class", "text-align", "height", "width");
        }
        for(var key in settings){
            key=key.replace(/[^0-9a-zA-Z]/g,"");
            var value=xss(settings[key]);

            updateStr+=" WHEN '"+key+"' THEN '"+value+"'";
            whereArray.push("'"+key+"'");
        }

        updateStr+=" END ";
        var updateSql="UPDATE settings_system set value="+updateStr+"WHERE `key` in("+whereArray.join(",")+")";
        
        SystemSetting.query(updateSql,function(err,setting){

            if(setting){
                return res.json({
                    code:200,
                    msg:"更新成功"
                });
            }
            return res.json({
                code:400,
                msg:"操作失败"
            });
        });
    },
    /**
     *@param type int [1系统设置,2通用设置] 必传
     * @param req
     * @param res
     */
    multiGet: function (req, res) {
        console.log(req.ip,req.path);
        console.log('multiGet: This is the function entry. check it out: ', req.allParams());
        var type = req.param("type", 2);
        SystemSetting.find({type: type}).exec(function (err, setting) {
            if (err) return res.negotiate(err);
            if (setting.length > 0) {
                return res.json({
                    code: 200,
                    data: setting,
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
     *@agreement 上传用户协议
     * agreement file 协议文件docx类型
     * @param req
     * @param res
     */
    uploadAgreement:function(req,res){
        console.log(req.ip,req.path);
        var savePath=sails.config.globals.uploadPath;
        var saveUrl=sails.config.globals.ImageUrl;
        var setting={};
        setting.dirname=savePath+"/static/agreement/";
        saveUrl=saveUrl+"static/agreement/agreement.html";

        req.file("agreement").upload(setting, function (err, uploadFiles) {
            if (err) return res.serverError(err);
            if (uploadFiles.length > 0) {
                common.docxToHTML(uploadFiles[0].fd,setting.dirname+"agreement.html",function(err,out){
                    return res.json({
                        code: 200,
                        msg: "ok",
                        data:saveUrl
                    });
                });
            } else {
                return res.json({
                    msg: '上传文件失败',
                    code: 400
                });
            }
        });
    }

};

