module.exports = {
  attributes: {
    //异业联盟发起方 运营商id
    shipA:{type:'integer',size:'11'},
    //异业联盟发起方被请求方   运营商id
    shipB:{type:'integer',size:'11'},
    
    //0等待对方同意 ,1对方同意 ,2 解除异业联盟
    status :{type:'boolean',size:'1'}
  },
  autoPK: true,
  autoCreatedAt:true,
  autoUpdatedAt:true
};
