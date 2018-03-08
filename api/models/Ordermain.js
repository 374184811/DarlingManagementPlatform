 /*
Ordermain
主订单表
ordermain_0
ordermain_1
ordermain_2
ordermain_3
ordermain_4
ordermain_5
ordermain_6
ordermain_7
ordermain_8
ordermain_9
*/
module.exports={
    attributes:{
        paymentid: {type: 'integer',defaultsTo:0},//支付方式ID 1 合约金 2 支付宝app  3 支付宝h5  4 支付宝扫码  5 微信app  6 微信公众账号扫码 7微信h5
        paymentid2: {type: 'integer',defaultsTo:0},//支付方式ID 1 合约金 2 支付宝app  3 支付宝h5  4 支付宝扫码  5 微信app  6 微信公众账号扫码 7微信h5
        paymentalias: {type: 'string',size: 100,defaultsTo: ''},//网关标志别名
        ordernumber: {type: 'string',size: 100,defaultsTo: ''},//订单号生成公式为字符串拼接(共20位) 10位+x位：10 0000 0000 + userid
        ordernumber1: {type: 'string',size: 100,defaultsTo: ''},//订单号生成公式为字符串拼接(共20位) 10位+x位：10 0000 0000 + userid
        ordernumber2: {type: 'string',size: 100,defaultsTo: ''},//订单号生成公式为字符串拼接(共20位) 10位+x位：10 0000 0000 + userid

        outordernumber: {type: 'string',size: 100,defaultsTo: ''},//外部交易流水号
        outordernumber1: {type: 'string',size: 100,defaultsTo: ''},//外部交易流水号
        chargeid: {type: 'string',size: 100,defaultsTo: ''},//外部交易流水号
        chargeid2: {type: 'string',size: 100,defaultsTo: ''},//外部交易流水号
        ordertype: {type: 'integer',defaultsTo:0},//订单类型。0：普通；   10未支付预售定金 11是已经定金 12 可以交尾款 13是已经交尾款
        buyerid: {type: 'integer',defaultsTo:0},//买家ID
        buyername: {type: 'string',size: 100,defaultsTo: ''},//买家名
        storeid: {type: 'integer',defaultsTo:0},//运营商商家商户 ID
        tablenameofitem: {type: 'string',size: 100,defaultsTo: ''},//详细商品信息存放的表名:按月变化
        remark: {type: 'string',size: 100,defaultsTo: ''},//订单备注

        status: {type: 'integer',defaultsTo:0},//订单状态。0待付款 1待发货（进行中） 2待确认收货（进行中） 3待评价 4交易完成 
        paystatus: {type: 'integer',defaultsTo:0},//支付状态。   0待支付 1已支付
        paytype: {type: 'integer',defaultsTo:0},//支付类型。1：货到付款；0：在线支付
        logisticsid: {type: 'integer',defaultsTo:0},//物流 ID，对应物流表id
        logisticsnumber: {type: 'string',size: 100,defaultsTo: ''},//物流单号

        consigneename: {type: 'string',size: 100,defaultsTo: ''},//收货人姓名
        consignee_region_id: {type: 'string',size: 100,defaultsTo: ''},//收货人所在地区 ID，填写最后一级
        consignee_region_name: {type: 'string',size: 100,defaultsTo: ''},//地区名称
        consignee_address: {type: 'string',size: 100,defaultsTo: ''},//收货人详细地址
        consignee_zipcode: {type: 'string',size: 100,defaultsTo: ''},//收货人邮编
        consignee_email: {type: 'string',size: 100,defaultsTo: ''},//收货人邮箱
        consignee_mobile: {type: 'string',size: 100,defaultsTo: ''},//收货人电话

        isinvoice: {type:'boolean',size:'1'},//是否有发票。1：有；0：无
        invoice_tax: {type: 'float',size:'15,4',required: true},//发票税额
        invoice_belong: {type: 'string',size: 100,defaultsTo: ''},//发票抬头

        freight: {type: 'float',size:'15,4',required: true},//运费
        count: {type: 'float',size:'15,4',required: true},//订单金额
        total_amount: {type: 'float',size:'15,4',required: true},//总金额
        promotion_amount: {type: 'float',size:'15,4',required: true},//活动抵用金额
        coupon_id: {type: 'string',size: 250,defaultsTo: ''},//优惠券ID
        coupon_amount: {type: 'float',size:'15,4',required: true},//优惠券抵用金额
        coupon_number: {type: 'integer',defaultsTo:0},//优惠券张数
        payment_amount: {type: 'float',size:'15,4',required: true},//实付金额
        is_cancel: {type: 'integer',defaultsTo:0},//是否确认收货0否，1是
        is_urgent: {type: 'integer',defaultsTo:0},//是否 交易完成(或者自动完成) 1是 0否
        is_refund: {type: 'integer',defaultsTo:0},//0:正常 1:申请售后 
        refund_amount: {type: 'float',size:'15,4',required: true},//退货金额
        isdelete: {type:'integer',defaultsTo:0},//是否标记为删除状态。1是 0否  -1失效
        is_del_user: {type:'boolean',size:'1'},//用户操作，是否标记为删除状态。1：是；0：否；-1：彻底删除
        pay_time2: {type: 'datetime',defaultsTo:''},//支付尾款时间
        pay_time: {type: 'datetime',defaultsTo:''},//支付时间
        delivery_time: {type: 'datetime',defaultsTo:''},//送货时间
        finished_time: {type: 'datetime',defaultsTo:''},//签收时间
        presale_endtime: {type: 'datetime',defaultsTo:''},//预售结束时间
        final_endtime: {type: 'datetime',defaultsTo:''},//尾款结束时间

        expire_refund_money: {type: 'datetime',defaultsTo:''},//7天后不可申请退款时间
        expire_refund_item: {type: 'datetime',defaultsTo:''},//15天后不可申请换货时间
        is_delivery: {type:'boolean',size:'1'},//是否发货 0 未发货  1 已经发货 2 已经收货
        is_secKill  :{type: 'integer',defaultsTo:0},  //是否是秒杀商品
        isValidly :{type: 'integer',defaultsTo:0},  //是否订单过期  0 有效   1失效
    },
    autoPK: true,//订单id
    autoCreatedAt:true,//创建时间
    autoUpdatedAt:true,//更新时间

   // 总后台获得昨天交易量
   getYesterdayTotalOrder: function(callback) {
        var yesterday = utility2.getYesterday();
        var whereinfo = ' where  createdAt<\''+yesterday[0]+'\' and createdAt>\''+yesterday[1]+'\'';

        var querytext   = 'select SUM(total_amount) as total from ordermain '+whereinfo;
        console.log(querytext);
        this.query(querytext, function (err, record) {
            if(err){
                console.log(err);
                callback(err);
            }else{
                callback(null,{'totalmoney':record[0]['total']});
            }
        });
   },
    // 商户后台台获得昨天交易量
    getYesterdayMerOrder: function(storeid,callback) {
        var yesterday = utility2.getYesterday();
        var whereinfo = ' where storeid= '+storeid+' and  createdAt<\''+yesterday[0]+'\' and createdAt>\''+yesterday[1]+'\'';
        var querytext   = 'select SUM(total_amount) as total from ordermain '+whereinfo;
        console.log(querytext);
        this.query(querytext, function (err, record) {
            if(err){
                console.log(err);
                callback(err);
            }else{
                callback(null,{'totalmoney':record[0]['total']});
            }
        });
   },
   // 商户后台 获得今天新增订单数目
   getMerCurDayOrderNum: function(storeid,callback) {
        var yesterday = utility2.getYesterday();
        var whereinfo = ' where storeid= '+storeid+' and  createdAt>\''+yesterday[0]+'\'';
        var querytext   = 'select count(*) as total from ordermain '+whereinfo;
        console.log(querytext);
        this.query(querytext, function (err, record) {
            if(err){
                console.log(err);
                callback(err);
            }else{
                callback(null,{'ordernum':record[0]['total']});
            }
        });
   },

};
