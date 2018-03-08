/**
 *servMsgController
 *
 */
module.exports = {
    /**
    *接口servMsg/curTime
    *获取当前服务器时间
    *@param  flag 判断时间返回形式
    *return  时间值
    */
    curTime: function(req, res){
        var flag = req.param('flag', false);

        if (flag) {
            return res.json({
                code: 200,
                date: new Date().getTime()});
        } else {
            return res.json({
                code: 200,
                date: new Date().Format("yyyy-MM-dd hh:mm:ss")
            });
        }
    },
    /**
    *接口servMsg/redirect
    *判断应用类型下载URL
    *@param  userAgent
    *return  重定向URL
    */
    redirect: function(req, res){
        console.log('redirect headers:  ', req.headers);
        var userAgent = req.headers['user-agent'] || 'user-agent';
        var mobileType = '';

        if ((/android/i.test(userAgent.toLowerCase()))) {
            console.log('mobileType: ' + "android");
            mobileType = "android";
        } else if((/iphone|ipod|ipad|Macintosh/i.test(userAgent.toLowerCase()))){
            console.log('mobileType: ios');
            mobileType = "ios";
        } else {
            console.log('mobileType: other');
            mobileType = 'other';
        }

        if(mobileType == 'other'){
            return res.ok();
        }

        loadmsg.findOne({type:mobileType}).exec(function(err,one){
            if(err) {
                console.log("servMsg redirect: ", err);
                return;}
            if(one){
                console.log("redirect ==> " + one.loadurl);
                var loadUrl = one.loadurl;
                return res.redirect(loadUrl);
            }
        });
    },
    /**
    *接口servMsg/getDomainName
    *返回审核的域名
    *@param version 版本号
    *return 域名
    */
    getDomainName: function(req,res){
        console.log(req.ip,req.path);

        console.log(req.allParams());

        var version = req.allParams().version;
        loadmsg.findOne({type:version}).exec(function(err,result){
            if (err){
                console.log(err);
                return;
            }
            var loadurl = '1';
            if (result){
                loadurl = result.loadurl;
            }
            res.json({
                code:200,
                name:loadurl
            });
        });
    }
};
