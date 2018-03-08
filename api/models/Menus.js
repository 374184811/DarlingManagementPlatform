/**
 * Menus.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    m_id:{type:'integer',size:'3',autoPk:true}, //菜单id
    title:{type:'string',size:'25',defaultsTo:""},//菜单标题
    url:{type:'string',size:'25',defaultsTo:""},//菜单url链接
    controller:{type:'string',size:'25',defaultsTo:""},//菜单controller
    action:{type:'string',size:'25',defaultsTo:""},//菜单action
    pid:{type:'integer',size:'3',defaultsTo:0},//菜单父id
    sort:{type:'integer',size:'3',defaultsTo:0},//短描述
    is_store:{type:'integer',size:'1',defaultsTo:0},//是否是店铺，1是店铺，0是总后天
    icon:{type:'string',size:'1',defaultsTo:""},//图标
  },
  autoCreatedAt:false,
  autoUpdatedAt:false,
};

