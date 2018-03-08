/**
 * Created by Administrator on 2016/8/10.
 */
module.exports = {
    autoPK: true,
    attributes: {
        counterno:{type:'integer',defaultsTo:0},//计数数值
        detail: {type: 'string',size: 50,defaultsTo: ''},//计数描述
    }
}