module.exports={
attributes:{
  id: {type: 'integer'},
  
  //所属商户的商品分类 ID
   storecategoryid: {type:'integer',defaultsTo:0},
   parentid: {type:'integer',defaultsTo:0},
   goodsseries: {type:'integer',defaultsTo:0},
   // 商品详情页面信息 <p style=\"text-align:center\"><span style=\"color:#B22222\">ware is having good looking</span></p>
   detailbody: {type:'text',defaultsTo:''},
  // //品牌 ID
   brandid:{type:'integer',defaultsTo:0},
   // 商品状态 0 未审核   1 审核失败 2 未上架  3 正常 
   status:{type:'integer',defaultsTo:0},
  // //商品所属商户的用户 ID
   userid:{type:'integer',defaultsTo:0},
  // //商品所属商户的店铺 ID
   storeid:{type:'integer',defaultsTo:0},
  // //商品名称
   name:{type: 'string',size: 200,defaultsTo:''},
   //页面关键词
  keywords:{type: 'string',size: 250,defaultsTo:''},
  // //商品货号
   sku:{type:'string',defaultsTo:''},
  // //默认图片，即封面
   imagedefault: {type: 'string',size: 250,defaultsTo:''},
  // //属性关联组合，记作：property_id:property_value_id,property_id:property_value_id。比如颜色,尺码
   propertyrelated: {type: 'string',size: 250,defaultsTo:''},
   propertypic: {type: 'string',size: 250,defaultsTo:''},// 商品规格图片
  // //属性关联组合，记作：property_id:property_value_id,property_id:property_value_id。比如颜色,尺码
   propertyvaluelist: {type: 'text', defaultsTo: '白色:32G:套餐2'},
  // //商品图片 ID，多个以半角逗号分隔
   attachment:{type: 'string',size: 250,defaultsTo:''},
  // //库存
   stock:{type: 'integer',defaultsTo:0},
  //商品价格
   price:{type: 'float',size:'15,4',required: true},
   //商品点卷价格
   pricepoint:{type: 'float',size:'15,4',required: true},
   //商品活动价格
   pricepromotion:{type: 'float',size:'15,4',required: true},
   //商品活动价格
   pricepromotion: {type: 'float', size: '15,4', required: true},
   reserve1: {type: 'text', defaultsTo: 0},//预留
   reserve2: {type: 'text', defaultsTo: 0},//预留
   reserve3: {type: 'text', defaultsTo: 0},//商城管理异业联盟数据缓存
   reserve4: {type: 'text', defaultsTo: 0},//预留
   reserve5: {type: 'text', defaultsTo: 0},//审核意见
   reserve6: {type: 'text', defaultsTo: 0},//商户展示商品的排序  权重(商城管理)
   reserve7: {type: 'text', defaultsTo: 0},//商铺主页设置数据缓存
   reserve8: {type: 'text', defaultsTo: 0},//预留
   reserve9: {type: 'text', defaultsTo: 0},//预留
   reserve10: {type: 'integer', defaultsTo: 0},//用于统计商品已售数量
   //重量。单位：克 
   weight:{type: 'integer',defaultsTo:0},

    // // 1:常规商品 2:预收商品
    type: {type: 'integer', size: '15,4', required: true},
    // // 预售价格
    premoneey: {type: 'float', size: '15,4', required: true},
    // // 定金
    deposit: {type: 'float', size: '15,4', required: true},
    // // 预售结束时间
    presaleendtime: {
        type: 'date',
        defaultsTo: new Date()
    },
    // //预售流程
    presaleflow: {type: 'text', defaultsTo: 0},
    // //预售说明
    presaledescript: {type: 'text', defaultsTo: 0},
    // //预售流程说明
    presaleflowdescript: {type: 'text', defaultsTo: 0}
  },
   autoPK: false,
   autoCreatedAt:true,
   autoUpdatedAt:false

};
 