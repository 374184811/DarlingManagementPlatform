/**
 * vrcommentmsg.js
 */

module.exports = {
    tableName: "vrcommentmsg",
    attributes: {
        userid: {type: "integer",size: 11, defaultsTo: 0},//评论的用户id
        vrpicid: {type: "integer",size: 11, defaultsTo: 0},//被评论的vr图片id
        commentcontent: {type: "string",size: 100, defaultsTo: ''},//评论内容
    },
    autoPk: true,
    autoCreatedAt: true,
    autoUpdatedAt: true,
};
