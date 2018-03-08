/**
 * vrpicinfo.js
 */

module.exports = {
    tableName: "vrpicinfo",
    attributes: {
        userid: {type: "integer",size: 11, defaultsTo: 0},//用户id
        realname: {type: "string",size: 50, defaultsTo: ''},//用户名
        nickname: {type: "string",size: 50, defaultsTo: ''},//用户昵称
        title:{type: "string",size: 100, defaultsTo: ''},//图片的标题
        classify: {type: "string",size: 150, defaultsTo: ''},//标签分类
        picurl: {type: "string",size: 300, defaultsTo: ''},//VR图片地址
        vrxmlurl: {type: 'text',defaultsTo: ''},//vr图片配置文件地址
        description: {type: "text"},//图片的描述
        upvotenum: {type: "integer",size: 11, defaultsTo: 0},//点赞数
        commentnum: {type: "integer",size: 11, defaultsTo: 0},//评论数
        isreport: {type: "integer",size: 11, defaultsTo: 0},//举报，1-举报
        isdelete: {type: "integer",size: 11, defaultsTo: 0},//删除标识，1-删除
    },
    autoPk: true,
    autoCreatedAt: true,
    autoUpdatedAt: true,
    /**
     * 最新照片
     * cb 回调函数
     */
    bestNewPic:function(cb){
        vrpicinfo.find({isnew:1}).exec(function(err,result){
            if (err){
                cb(err,[]);
            }
            cb(null,data);
        });
    },
    /**
     * 最热照片
     * cb 回调函数
     */
    bestHotPic:function(cb){
        vrpicinfo.find({ishot:1}).exec(function(err,result){
            if (err){
                cb(err,[]);
            }
            cb(null,data);
        });
    },
};
