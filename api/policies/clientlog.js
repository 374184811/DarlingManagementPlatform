/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function(req, res, next) {

	//console.log('userlog. This is the function entry.');

    var options = req.options;
    var mine = req.session.mine;
    var allParams = req.allParams();


    // var controlArr = ['userlogin','userlogout'];
    // var islog = controlArr.includes(options.action.toLowerCase());
    
    
    var mId = allParams.mId;
    var token = allParams.psecret;
    var tokenId = allParams.tokenId;

    function userlog(u) {

    	//构造消息
	    var log = {};
	    log.userid = u.id;
	    log.token = token;
	    log.username = u.useralias;
	    log.usermobile = u.usermobile;
	    log.action = options.action.toLowerCase();
	    log.controller = options.controller.toLowerCase();
	    log.ipaddress = req.ip.substring("::ffff:".length);
	    log.createdAt = (new Date()).Format("yyyy-MM-dd hh:mm:ss.S");
	    log.params = JSON.stringify(allParams).replace(/('|")/g,"\\$1");

	    //console.log('log. check it out. ', log);
	    Loguser.createLog(log,function (err, l) {
	    	sails.log.info('cb_tag1: The result of this createLog is shown came out. check it out:  ok');
	    });
    }

	common.getLoginUser(req, tokenId, mId, function (err, ret) {
		if (err) return res.negotiate(err);
		if (ret && ret.code == 200) {
			var member = ret.user;
			if(member&&member.id>0){
				userlog(member);
			}
		}
	});

  //   if (islog) {
  //   	userlog(mine);
  //   }else{
  //   	common.getLoginUser(req, tokenId, mId, function (err, ret) {
		// 	if (err) return res.negotiate(err);
		// 	if (ret && ret.code == 200) {
		// 		var member = ret.user;
		// 		if(member&&member.id>0){
		// 			userlog(member);
		// 		}
		// 	}
		// });
  //   }

	

	// var option=req.options;
	// if (!(option.controller.toLowerCase() == "Member" && (option.action.toLowerCase() == "userlogin" || option.action.toLowerCase() == "userlogout"))) {
	// 	console.log("useroperate");
	// 	function recordUserLog(user){
	// 		console.log("记录日志");
	// 		var path = req.options;
	// 		var loginfo = {};
	// 		loginfo['controller'] = path.controller.toLowerCase();
	// 		loginfo['action'] = path.action.toLowerCase();
	// 		loginfo['userid'] = user.id;
	// 		loginfo['usermobile'] = user.usermobile;
	// 		loginfo['username'] = user.useralias;
	// 		loginfo['ipaddress'] = req.ip.substring("::ffff:".length);
	// 		loginfo['createdAt']=(new Date()).Format("yyyy-MM-dd hh:mm:ss");
	// 		var params=JSON.stringify(req.allParams());
	// 		params=params.replace(/('|")/g,"\\$1");

	// 		loginfo['params']=params;
	// 		loginfo['token']=req.param("psecret");

	// 		console.log(loginfo);
	// 		Loguser.createLog(loginfo,function userRegister(err, newUser) {
	// 			console.log(err);
	// 		});
	// 	}
	// 	var tokenId = req.param("tokenId");
	// 	var mId = req.param("mId");
	// 	common.getLoginUser(req, tokenId, mId, function (err, ret) {
	// 		if (err) return res.negotiate(err);
	// 		if (ret && ret.code == 200) {
	// 			var member = ret.user;
	// 			if(member&&member.id>0){
	// 				recordUserLog(member);
	// 			}
	// 		}
	// 	});
		
	// }

	utils.policiesLayer("写入日志",req);
	return next();
};
