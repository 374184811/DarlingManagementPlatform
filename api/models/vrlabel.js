/**
 * vrlabel.js
 */

module.exports = {
    tableName: "vrlabel",
    attributes: {
        name: {type: "string",size: 50, defaultsTo: ''},//标签名字
        coverpic: {type: "text"},//封面图片
        isdelete: {type: "text"},//是否被删除，0-未删除，1-已删除
    },
    autoPk: true,
    autoCreatedAt: true,
    autoUpdatedAt: true,
};
