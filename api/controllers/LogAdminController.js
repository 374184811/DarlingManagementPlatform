var LogController = require('../publicController/LogController')


/**
 * LogController
 *
 * @description :: Server-side logic for managing logs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


    /**
     * 用户登陆日志
     *@param start string 日期的开始时间
     *@param end  string 日期的结束时间
     *@param username string 按名字搜索
     *@param sort objectArray 按什么排序
     *@param num int 每页显示多少个
     *@param offset int 多少页
     * `LogController.userLogin()`
     */
    userLogin: function (req, res) {
        return LogController.userLogin(req,res);
    },


    /**
     * 用户操作日志
     *@param start string 日期的开始时间
     *@param end  string 日期的结束时间
     *@param username string 按名字搜索
     *@param sort objectArray 按什么排序
     *@param num int 每页显示多少个
     *@param offset int 多少页
     * `LogController.useroperate()`
     */
    useroperate: function (req, res) {
        return LogController.userLogin(req,res);
    },

    /**
     * 用户状态操作日志
     *@param uid int 用户id
     * `LogController.userstatus()`
     */
    userstatus:function (req,res) {
        return LogController.userLogin(req,res);
    },
    /**
     * 运营商操作日志
     *@param start string 日期的开始时间
     *@param end  string 日期的结束时间
     *@param username string 按名字搜索
     *@param sort objectArray 按什么排序
     *@param num int 每页显示多少个
     *@param offset int 多少页
     * `LogController.merchant()`
     */
    merchant: function (req, res) {
        return LogController.userLogin(req,res);
    },


    /**
     * 系统操作日志
     *@param start string 日期的开始时间
     *@param end  string 日期的结束时间
     *@param username string 按名字搜索
     *@param sort objectArray 按什么排序
     *@param num int 每页显示多少个
     *@param offset int 多少页
     * `LogController.system()`
     */
    system: function (req, res) {
        return LogController.userLogin(req,res);
    },
    /**
     * 检查参数
     * @param req
     * @returns {{}}
     */
    checkParam:function(req){
        return LogController.userLogin(req,res);
    },
    /**
     * 日志中各个controller action 代表的意义
     * @param logs
     * @returns {Array}
     */
    revertLogName:function(logs){
        return LogController.userLogin(req,res);
    },
  
};

