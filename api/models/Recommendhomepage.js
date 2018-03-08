module.exports = {
  attributes: {
    //0 banner,1第一推荐模块,2第2推荐模块,3第3推荐模块,4第4推荐模块
    recommendtype:{type:'string',size:'50'},
    //推荐标题名称
    titlename:{type:'string',size:'50'},
    description:{type:'string',size:'50'}, //详细描述
    status :{type:'boolean',size:'1'} //状态1:启用  0:不启用
  },
  autoPK: true,
  autoCreatedAt:true,
  autoUpdatedAt:true
};
