/**
 * vrlikemsg.js
 */

module.exports = {
    tableName: "vrlikemsg",
    attributes: {
        userid: {type: "integer",size: 11, defaultsTo: 0},//点赞的用户id
        vrpicid: {type: "integer",size: 11, defaultsTo: 0},//被点赞的vr图片id
    },
    autoPk: true,
    autoCreatedAt: true,
    autoUpdatedAt: true,
};
