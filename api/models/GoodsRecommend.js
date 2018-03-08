/**
 * CategoryRecommend.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  tableName:"goods_recommend",
  attributes: {
    // id:{
    //   type:"integer",
    //   size:11,
    //   // primaryKey:true
    // },
    cid:{//分类id
      type:"integer",
      size:11,
    },
    cname:{//类别名称
      type:"string",
      size:20,
    },
    sname:{
      type:"string",
      size:20,
    },
    skus:{//推荐的商品sku
      type:"string"
    },
    sort:{//排序
      type:"integer",
      size:2,
    },
    storeid:{//店铺id
      type:"integer",
      size:11,
    },
    position:{ //保存位置 1是在首页显示
      type:"integer",
      size:1,
    },
  },
  autoPK:true,
  autoCreatedAt:true,
  autoUpdatedAt:true
};

