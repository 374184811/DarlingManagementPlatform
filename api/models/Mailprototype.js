/*
Mailprototype.js
个人邮件表模板
Mail_id
*/
module.exports={
attributes:{
  type: {type: 'integer',defaultsTo:0},//邮件类型 0：普通邮件 1：系统邮件
  content: {type:'text',defaultsTo:''},//邮件内容
  //运营商商家商户 ID
  storeid:{type:'integer',defaultsTo:0},
  senderid: {type: 'integer',defaultsTo:0},//发送者ID
  sendername: {type: 'string',size: 100,defaultsTo: ''},//发送者名称
  reserve1:{type: 'string',size: 250,defaultsTo:''},//预留
  reserve2:{type:'integer',defaultsTo:0},//预留
  isdelete: {type:'integer',defaultsTo:0},//是否删除。1：删除；0：无删除
  },
  autoPK: true,//id
  autoCreatedAt:true,//创建时间
  autoUpdatedAt:true//更新时间
};
