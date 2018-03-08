module.exports = {
  attributes: {
    aliasid:{type:'integer',size:'11'},//类别别名id
    categoryid:{type:'integer',size:'11'},//商品类别id
    aliasname:{type:'string',size:'50'},//别名名称
    description:{type:'string',size: '255'},//别名描述
    aliasorder:{type:'integer',size:'8'},//别名排序
    categoryorder:{type:'integer',size:'8'},//类别排序
    status :{type:'boolean',size:'1'}//类别状态1:启用  0:不启用
  },
  autoPK: true,
  autoCreatedAt:true,
  autoUpdatedAt:true
};
