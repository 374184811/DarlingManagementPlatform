module.exports={
attributes:{
    //商户 ID
    storeid: {type: 'integer',defaultsTo:0},
    money: {type: 'float',size:'15,4',required: true},//一件的邮费
    permoney: {type: 'float',size:'15,4',required: true},//每件累加的邮费
    //商品价格 达到上线免邮费
    limitmoney:{type: 'float',size:'15,4',required: true},
    
    //是否开启免邮费  1表示开启
    isopen:{type:'integer',defaultsTo:0}
  },
  autoPK: true,// ID
  autoCreatedAt:true,
  autoUpdatedAt:true
};
