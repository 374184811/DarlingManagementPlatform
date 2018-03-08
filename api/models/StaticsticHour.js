/**
 * StaticsticHour.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  tableName:"staticstic_hour",
  attributes: {
    id:{
      type:"integer",
      size:11,
    },
    active:{ //活跃用户数
      type:"integer",
      size:5,
    },
    slient:{ //沉默用户数
      type:"integer",
      size:5,
    },
    startup:{//启动次数
      type:"integer",
      size:5,
    },
    reg:{
      type:"integer",
      size:11,
    },
    total:{//对应时间段内的某个平台的总用户数
      type:"integer",
      size:11,
    },
    time:{
      type:"string",
    },
    device:{
      type:"integer",
      size:1,
    }
  },
  autoCreatedAt:false,
  autoUpdatedAt:false,
};

