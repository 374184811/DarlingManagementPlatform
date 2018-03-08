/**
 * Appinfo.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    tableName: "app_info",
    attributes: {
        name: {type: "string", defaultsTo: ""},//app的名称
        version: {type: "string", defaultsTo: ""},//app 版本
        remark: {type: "string", defaultsTo: ""},//更新标记
        icon: {type: "string", defaultsTo: ""},//app 小图标
        url: {type: "string", defaultsTo: ""},//app 下载链接
        platform: {type: "string", defaultsTo: ""},//app 平台
        size: {type: "string", defaultsTo: ""},//app包大小
        channel: {type: "string", defaultsTo: ""},//app 渠道
        upgrade: {type: "integer", defaultsTo: 0},//是否强制更新
    },
    autoPk: true,
    autoCreatedAt: true,
    autoUpdatedAt: true
};

