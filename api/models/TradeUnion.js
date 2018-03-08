/**
 * TradeUnion.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  tableName:"trade_union",
  description:"异业联盟表",
  attributes: {
    storeid:{
      type:"integer",
      size:11
    },
    store_name:{
      type:"string",
      size:20
    },

    friend_id:{
      type:"integer",
      size:11
    },
    friend_name:{
      type:"string",
      size:20
    },
    profit:{
      type:"float",
      size:"11,5"
    },
    status:{
      type:"integer",
      size:1
    }
  },
  autoPK:true,
  autoCreatedAt:true,
  autoUpdatedAt:true
};

