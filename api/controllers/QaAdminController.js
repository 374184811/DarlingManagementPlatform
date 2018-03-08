/**
 * QaAdminController
 * @description :: Server-side logic for managing qas
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var qaController = require('../publicController/qaController');
module.exports = {
  /**
   * `QaController.index()`
   * @param type int 是否是已查看 1未查看 2已查看
   * @param num int 每页显示多少个
   * @param page int 页数
   */
  index: function (req, res) {
      return qaController.index(req,res);
  },
  /**
   * `QaController.ask()`
   * @param tokenId 用户登录token
   * @param mId int 用户id
   * @param ask 用户反馈内容
   */
  ask: function (req, res) {
      return qaController.ask(req,res);
  },
  /**
   * `QaController.reply()`
   * @param content 内容
   * @param id int 反馈id
   */
  reply: function (req, res) {
      return qaController.reply(req,res);
  },
  /**
   * `QaController.view()`
   * @param id int 反馈id
   * @param req
   * @param res
   */
  view: function (req, res) {
      return qaController.view(req,res);
  },
  /**
   * @param tokenId 登录后获取token
   * @param mId 用户id
   * @param id 反馈id
   * @param req
   * @param res
     */
  delete:function (req,res) {
      return qaController.delete(req,res);
  }
};
