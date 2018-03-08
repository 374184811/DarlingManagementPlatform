/**
 * StaticsticInvole.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  tableName:"staticstic_invole",
  attributes: {
    id:{
      type:"integer",
      size:11,
    },
    p1:{ //访问1-2
      type:"integer",
      size:5,
      defaultsTo:0
    },
    p2:{//访问3-5
      type:"integer",
      size:5,
      defaultsTo:0
    },
    p3:{//访问6-9
      type:"integer",
      size:5,
      defaultsTo:0
    },
    p4:{//访问10-29
      type:"integer",
      size:5,
      defaultsTo:0
    },
    p5:{ //访问30-99
      type:"integer",
      size:5,
      defaultsTo:0
    },
    p6:{//访问100+
      type:"integer",
      size:5,
      defaultsTo:0
    },
    date:{
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

