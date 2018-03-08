module.exports = {
  attributes: {
    //序号即为banner呈现在客户端的顺序，越大越前
    order:{type:'integer',size:'11'},
    //baner编号
    bannerserial:{type:'integer',size:'11'},
    //banner名称 标题
    bannername:{type:'string',size:'50'},
    //banner副标题
    bannersubname:{type:'string',size:'250'},
    //0 banner,1第一推荐模块,2第2推荐模块,3第3推荐模块,4第4推荐模块
    bannertype:{type:'integer',size:'11'},
    //0 表示不区分第几排,1表示在第1排,2表示在第2排
    rolnumber:{type:'integer',size:'11'},//
    description: {type:'text',defaultsTo:''},
    bannerpic:{type:'string'},
    bannerurl:{type:'string',size:'150'},
    //0无效果,1外部链接,2内部链接,3商品专场,4自定义
    linktype:{type:'integer',size:'2'},
    storeid: {type:'integer',defaultsTo:0},//运营商id
    status :{type:'integer',size:'1'}
  },
  autoPK: true,
  autoCreatedAt:true,
  autoUpdatedAt:true
};
