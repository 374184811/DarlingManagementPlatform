module.exports={
attributes:{
  //商户 ID
  storeid: {type: 'integer',defaultsTo:0},
  aipkey: {type: 'string',size: 150,defaultsTo: ''},
  aipid: {type: 'string',size: 150,defaultsTo: ''},
  key1: {type: 'string',size: 150,defaultsTo: ''},
  key2: {type: 'string',size: 150,defaultsTo: ''}
  },
  autoPK: true,// ID
  autoCreatedAt:false,
  autoUpdatedAt:false
};
