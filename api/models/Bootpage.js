/**
 * Bootpage.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
      storeid:{
          type:"integer", //店铺id
      },
      picurl:{
          type:"string",//图片d地址
      },
      linkurl:{//链接地址
          type:"string",
      },
      linktype:{//链接类型，0无效果,1外部链接,2内部链接,3商品专场,4自定义
          type:"integer",
      },
      status:{ //开启状态，0-关闭，1-开启
          type:"integer",
      },
  },
  autoPK:true,
  autoCreatedAt:true,
  autoUpdatedAt:true,

};

