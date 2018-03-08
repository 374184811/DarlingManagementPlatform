/**
 * QaController
 *
 * @description :: Server-side logic for managing qas
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  /**
   * `QaController.index()`
   * @param type int 是否是已查看 1未查看 2已查看
   * @param num int 每页显示多少个
   * @param page int 页数
   */
  index: function (req, res) {
      console.log(req.ip,req.path);
      var mine=req.session.mine;
      var type=req.param("type",0);
      var num=req.param("num");
      var page=req.param("page",1);
      
      var condition={};
      if(type==1){
          condition.r_status=0;
      }else if(type==2){
          condition.r_status=1;
      }
      condition.sort={replytime:"DESC",createdAt:"DESC"};
      if(num){
          condition.skip=(page-1)*num;
          condition.limit=num;
      }
      async.series({
          count:function (cb) {
              Qa.count().exec(cb);
          },
          question:function (cb) {
              Qa.find(condition).exec(cb);
          }
      },function (err,ret) {
          if (err) return res.negotiate(err);
          
          if(ret.count>0){
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
  },
  /**
   * `QaController.ask()`
   * @param tokenId 用户登录token
   * @param mId int 用户id
   * @param ask 用户反馈内容
   */
  ask: function (req, res) {
      console.log(req.ip,req.path);
      var tokenId = req.param("tokenId", 0);
      var mId = req.param("mId", 0);
      var ask=req.param("ask");
      if(!tokenId||!mId||!ask){
          return res.json({
              code:400,
              msg:"参数不正确"
          });
      }
      common.getLoginUser(req, tokenId, mId, function (err,ret) {
          if (err) return res.negotiate(err);
          if(ret&&ret.code==200){//用户已经登录
              var user=ret.user;
              var question={};
              question.askid=user.id;
              question.asker=user.usermobile;
              question.ask_avatar=user.userpic;
              question.question=ask;
              question.replyid=0;
              question.createdAt=question.replytime=(new Date()).Format("yyyy-MM-dd hh:mm:ss");
      
              Qa.create(question).exec(function (err,q) {
                  if (err) return res.negotiate(err);
                
                  if(q){
                     return res.json({
                        code:200,
                        msg:"操作成功",
                        data:q
                     })
                  }else{
                     return res.json({
                        code:400,
                        msg:"操作失败"
                     });
                  }
              });
          }else{
              return res.json({
                  code: 400,
                  msg: "用户未登录"
              });
          }
      });
  },
  /**
   * `QaController.reply()`
   * @param content 内容
   * @param id int 反馈id
   */
  reply: function (req, res) {
      console.log(req.ip,req.path);
      var mine=req.session.mine;
      var content=req.param("content",false);
      var id=req.param("id");
      if(!mine){
          return res.json({
              code:400,
              msg:"需要登录"
          });
      }
      if(!content||!id){
          return res.json({
              code:400,
              msg:"参数未传递"
          });
      }
      var vSet={};
      vSet.replyid=mine.id;
      vSet.replyer=mine.userAlias;
      vSet.reply_avatar='';
      vSet.answer=content;
      vSet.r_status=2;
      vSet.replytime=(new Date()).Format("yyyy-MM-dd hh:mm:ss");
      
      Qa.update({id:id}).set(vSet).exec(function (err,qa) {
          if (err) return res.negotiate(err);
          
          if(qa&&qa.length){
              return res.json({
                  code:200,
                  msg:"ok",
                  data:qa
              });
          }else{
              return res.json({
                  code:400,
                  msg:"没有该问题"
              });
          }
      });
  },
  /**
   * `QaController.view()`
   * @param id int 反馈id
   */
  view: function (req, res) {
      console.log(req.path,req.allParams());
      var allParams = req.allParams();
    
      var id = parseInt(allParams.id);
      var tokenId = allParams.tokenId;
      var mId = allParams.mId;
      var mine = req.session.mine;
    
      if((!tokenId||!mId) && !mine){
          return res.json({
              code:400,
              msg:"需要登录"
          });
      }
      if(!id){
          return res.json({
              code:400,
              msg:"参数未传递"
          });
      }
      var vSet = {}, condition = {id:id};
      common.getLoginUser(req, tokenId, mId, function (err,ret) {
          if (err) return res.negotiate(err);
          if(ret&&ret.code==200){//用户已经登录
              var where = condition;
              vSet.a_status = 1;
              where.a_status = {"!":1};
            
              updateAsk(where,vSet);
          }else if(mine){
              var where = condition;
              vSet.r_status = 1;
              where.r_status = {"!":[2,1]};
            
              updateAsk(where,vSet);
          }else{
              return res.json({
                  code: 400,
                  msg: "用户未登录"
              });
          }
      });
    
      function updateAsk(where,content){
          Qa.findOne({id:id}).exec(function (err,ret) {
              if (err) return res.negotiate(err);console.log(ret);
              if(ret){
                  Qa.update(where).set(content).exec(function(err,qa){
                      if (err) return res.negotiate(err);
                  });
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
      }
  },
  /**
   * @param tokenId 登录后获取token
   * @param mId 用户id
   * @param id 反馈id
   * @param req
   * @param res
     */
  delete:function (req,res) {
      console.log(req.ip,req.path);
      var tokenId = req.param("tokenId", 0);
      var mId = req.param("mId", 0);
      var id = req.param("id", 0);
      common.getLoginUser(req, tokenId, mId, function (err,ret) {
          if (err) return res.negotiate(err);
          if(ret&&ret.code==200){//用户已经登录
              var member=ret.user;
              var sql="delete from question_answer where id="+parseInt(id)+" AND askid="+member.id+" AND r_status=2";
              Qa.query(sql,function (err, records) {
                  if (err) return res.negotiate(err);
                  
                  if (records) {
                      return res.json({
                          code: 200,
                          msg: "删除成功",
                          data: []
                      });
                  } else {
                      return res.json({
                          code: 400,
                          msg: "删除失败",
                      });
                  }
              });
          }else{
              return res.json({
                code: 400,
                msg: "用户未登录"
              });
          }
      });
  }
};
