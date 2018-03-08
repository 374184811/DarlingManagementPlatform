// Citycode.js省份城市编码表
module.exports={
attributes:{
  //  代码  
  code: {type: 'string',size: 40,defaultsTo: ''},
  //  省份名称 
  province: {type: 'string',size: 40,defaultsTo: ''},
  //  城市 
  city: {type: 'string',size: 40,defaultsTo: ''},
  // 区
  district: {type: 'string',size: 40,defaultsTo: ''},
  //父子层级
  parent: {type: 'string',size: 40,defaultsTo: ''}
  
  },
  autoPK: true,// ID
  autoCreatedAt:false,
  autoUpdatedAt:false
};
 