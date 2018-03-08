/**
 * OauthController
 *
 * @description :: Server-side logic for managing oauths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var express = require("express");
var crypto = require("crypto");
// var bodyParser=require("body-parser");
// var oauthserver=require("oauth2-server");

module.exports = {


    /**
     * `OauthController.callback()`
     */
    login: function (req, res) {
        var type = req.param("type");
        var access_token = req.param("access_token");
        var uid = req.param("uid");
        var _this = this;
        OAuth.getUserInfo(res, type, access_token, uid, function (err, ret) {
            if (err) {
                return res.json({
                    code: 400,
                    msg: "操作失败"
                });
            }
            if (ret.code == 200 || ret.code == 202) {
                var md5 = crypto.createHash("md5");
                var account = ret.data;
                var user = {
                    userId: account.id,
                    userMobile: account.usermobile,
                    userAlias: account.useralias,
                    shop_name: account.shop_name,
                    nickName: account.nickname,
                    sex: account.sex,
                    birthday: account.birthday,
                    bqlId: 0,
                    paypwd: account.psecret ? true : false,
                    storeid: account.operatorno,
                    userpic: account.userpic,
                    money: account.money,
                    access_token: access_token,
                    type: type
                };
                var content = JSON.stringify(user);
                var time = (new Date()).getTime();
                user.tokenId = md5.update(content + "" + time).digest("hex").toUpperCase();

                var token = utility.generateToken(user);
                var client = redis.client({db: 2});
                client.set(user.id + ":" + user.tokenId, token, function (err, red) {
                    var loginfo = {
                        userid: account.id,
                        username: account.userAlias,
                        ipaddress: utility.getClientIp(req),
                        islogin: 1,
                        createdAt: (new Date()).Format("yyyy-MM-dd hh:mm:ss")
                    };
                    Loguserlogin.createLog(loginfo, function userRegister(err, newUser) {

                    });
                    return res.json({
                        "success": true,
                        "msgCode": 0,
                        "msg": "登录成功",
                        "result": user
                    });

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
     * `OauthController.login()`
     */
    logout: function (req, res) {
        var type = req.param("type");
        var access_token = req.param("access_token");
        var uid = req.param("uid");



    },

};

