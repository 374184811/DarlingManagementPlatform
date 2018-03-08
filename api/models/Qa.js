/**
 * Qa.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  tableName:"question_answer",
  attributes: {
      id:{
         type:"integer",
          size:11,
      },
      askid:{
         type:"integer",
         size:10,
      },
     asker:{
       type:"string",
       size:10,
     },
      ask_avatar:{
        type:"string",
        size:200,
     },
    replyid:{
      type:"integer",
      size:10,
      defaultsTo:0,
    },
    replyer:{
      type:"string",
      size:20,
      defaultsTo:''
    },
    reply_avatar:{
        type:"string",
        size:200,
        defaultsTo:"",
    },
      question:{
          type:"string",
          defaultsTo:''
      },
      answer:{
          type:"string",
          defaultsTo:''
      },
    createdAt:{
      type:"datetime",
    },
    replytime:{
      type:"string",
        defaultsTo:(new Date()).Format("yyyy-MM-dd hh:mm:ss")
    },
    a_status:{
      type:"integer",
      size:1
    },
   r_status:{
      type:"integer",
      size:1
    },
  },
  autoUpdatedAt:false,
};

