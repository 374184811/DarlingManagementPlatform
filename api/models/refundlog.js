module.exports={
attributes:{
    //详细商品信息存放的表名:按月变化
    tablenameofitem: {type: 'string',size: 100,defaultsTo: ''},
    // 详细表单的id
    tablenameofitemid: {type: 'integer',defaultsTo:0},
    //订单号生成公式为字符串拼接(共20位) 10位+x位：10 0000 0000 + userid
    ordernumber: {type: 'string',size: 100,defaultsTo: ''},
    // status
    status:  {type: 'integer',defaultsTo:0},
    //拒绝退货原因  
    refuse_reason: {type: 'text', defaultsTo: ''},
    // status
    code:  {type: 'integer',defaultsTo:0},
    //拒绝退货原因  
    codeInfo: {type: 'text', defaultsTo: ''},
  },
  autoPK: true,// ID
  autoCreatedAt:false,
  autoUpdatedAt:false
};
