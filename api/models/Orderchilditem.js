/*
Orderchilditem
子订单详细信息表
按月份动态创建原型表
预先创建1年的（12张表）
orderchilditem201611
orderchilditem201612
orderchilditem201701
create table orderchilditem201702 like orderchilditem
*/
module.exports={
attributes:{
        ordernumber: {type: 'string',size: 100,defaultsTo: ''},//订单号
        refundrnumber: {type: 'string',size: 100,defaultsTo: ''},//订单号
        storeid: {type: 'integer',defaultsTo:0},//运营商商家商户 ID
        goodsid: {type: 'integer',defaultsTo:0},//商品ID
        categoryid: {type: 'integer',defaultsTo:0},//商品类别ID
        sku: {type: 'string',size: 100,defaultsTo: ''},//商品编号
        goodsname: {type: 'string',size: 100,defaultsTo: ''},//商品名称
        goodsimage: {type: 'string',size: 100,defaultsTo: ''},//商品图片
        goods_property: {type: 'string',size: 100,defaultsTo: ''},//商品属性
        description: {type: 'string',size: 250,defaultsTo: ''},//商品详细信息（以 json 格式进行存储） 
        buy_price: {type: 'float',size:'15,4',required: true},//购买价格
        buy_num: {type: 'integer',defaultsTo:0},//购买数量
        is_comment: {type:'boolean',size:'1'},//是否已经评价 0.否 1.是
        is_package: {type: 'integer',defaultsTo:0},//是否已经退款。1：是；0：否
        is_delivery: {type:'boolean',size:'1'},//是否填写退单物流单号
        is_delivery2: {type:'boolean',size:'1'},//商户后台 是否填写退单物流单号
        is_invoice: {type:'boolean',size:'1'},//是否有发票。1：有；0：无
        original_price: {type: 'float',size:'15,4',required: true},//原始价格
        //0:正常 1:申请退货 2:商户同意 4:用户已退货；5:已退款 6:拒绝 7:售后已经完成 
        //  18(预售已退定金即将退尾款)  17(预售已退定金和尾款等待用户将订单变成已完成状态)
        is_refund: {type: 'integer',defaultsTo:0},
        mer_agree: {type: 'integer',defaultsTo:0},//0:商户没有处理 1 商户不同意   2:商户同意 
        refund_type: {type: 'integer',defaultsTo:0},//0:正常 1:换货 2:退款退货   3退款不退货  
        refund_reason: {type: 'string',size: 250,defaultsTo: ''},//退货原因2refuse
        refuse_reason: {type: 'text', defaultsTo: ''},//拒绝退货原因  也是remark 
        refund_amount: {type: 'float',size:'15,4',required: true},//退货金额
        refund_num: {type: 'integer',defaultsTo:0},//退货数目
        refund_pic: {type: 'string',size: 250,defaultsTo: ''},//退货图片
        pre_price:  {type: 'float',size:'15,4',required: true},//预售定金
        remark:     {type: 'string',size: 100,defaultsTo: ''},//订单备注
        refund_time1: {type: 'datetime',defaultsTo:''},//售后申请时间
        refund_time2: {type: 'datetime',defaultsTo:''},//售后申请同意时间
        refund_time3: {type: 'datetime',defaultsTo:''},//售后完成时间
        refund_time4: {type: 'datetime',defaultsTo:''},//上次撤销时间
        
        refund_time5: {type: 'datetime',defaultsTo:''},//商户换货快递确认时间
        mer_agree2: {type: 'integer',defaultsTo:0},//0:总后台没有处理 1 总后台不同意   2:总后台同意 
        discount_price: {type: 'float',size:'15,4',required: true},//优惠券折扣金额
        maintenance:{type: 'integer',defaultsTo:0},//申请售后撤销次数  还包括 大于100表示申请延长3天填写售后快递
        is_finished  :{type: 'integer',defaultsTo:0},  //是否售后已经完成 或者自动完成
        logisticsnumber: {type: 'string',size: 100,defaultsTo: ''},//退单物流单号
        expire_agree_time: {type: 'datetime',defaultsTo:''},//3天到期商家自动同意售后时间
        expire_delivery_time: {type: 'datetime',defaultsTo:''},//7天给买家填写退单物流单号
        expire_finished_time: {type: 'datetime',defaultsTo:''},//7天自动售后完成时间
        secKillType  :{type: 'integer',defaultsTo:0},  //是否是秒杀商品
        //goods_ori_price: {type: 'float',size:'15,4',required: true},//商品原始价格
    },
    autoPK: true,//id
    autoCreatedAt:true,// 快递确认 时间createdAt  客户端结合is_delivery字段判断
    autoUpdatedAt:true//售后完成时间
};

// UPDATE orderchilditem201611 SET `is_refund`='2',`refund_type`='2', remark='换货转换退款' WHERE ordernumber=100000000001706
// UPDATE orderchilditem201611 SET `is_refund`='2' WHERE ordernumber=100000000001667 \G;
// UPDATE orderchilditem201612 SET `is_refund`='5',`refund_type`='2',mer_agree2=2,mer_agree=2,remark='财务线下退款' WHERE ordernumber=100000000012667

// UPDATE orderchilditem201611 SET `is_refund`='5',`refund_type`='2',mer_agree2=2,mer_agree=2,refund_time1='2017-01-11 19:15:12',refund_time2='2017-01-11 19:15:12',refund_time3='2017-01-11 19:15:12', refund_amount=pre_price*buy_num,remark='财务线下退款' WHERE ordernumber=100000000001715
// select tablenameofitem from ordermain WHERE  is_refund=1  and ordernumber=xxxxxx
// UPDATE orderchilditem2016xx SET `is_refund`='1',`refund_type`='2', remark='换货转换退款' WHERE ordernumber=xxxxxxxx
