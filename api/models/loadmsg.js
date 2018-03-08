/**
 * loadmsg.js
 * 应用
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
module.exports = {
    attributes: {
      type:{ // 类型，如android,ios,版本号
        type: 'string',
        size: 10,
        defaultsTo: '',
      },
      loadurl:{ // 下载地址,或者是数字标识
        type: 'string',
        size: 150,
        defaultsTo: '',
      }
    },

    autoPK: true,
    autoCreatedAt: true,
    autoUpdatedAt: true,
};
