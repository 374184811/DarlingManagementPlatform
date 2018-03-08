/**
status 取值范围
 物流状态, 0-订阅成功，
 1-其它信息,
 2-在途中,
 3-更新正确的物流公司代码,
 4-物流单异常,
 5-已签收,
 6-自提,
 7-自定义
 */
module.exports = {

    attributes: {
        company:{
            type:"String",
            size:50
        },
        payorder:{//订单号
            type:"String",
            size:100
        },
        dayinfo:{
            type:"String",
            size:50
        },
        deliverorder:{
            type:"String",
            size:100
        },
        refundrnumber: {//售后订单号
            type: 'string',
            size: 100,
            defaultsTo: ''
        },
        tablenameofitem: {//订单子表名
            type: 'string',
            size: 100,
            defaultsTo: ''
        },
        saleflag:{//售后标识，0-正常订单，1-售后换货（前端退回货物），2-售后换货（后台发送货物），3-退款退货(前端)
            type:"integer",
            defaultsTo:0
        },
        imgaddress:{//物流凭证
            type:"text",
            defaultsTo:'0'
        },
        remark:{//备注
            type:"String",
            size:160
        },
        status: {type: 'integer',defaultsTo:0},
        detailbody: {type: 'text', defaultsTo: ''},
    },
    autoPK: true,
    autoCreatedAt:false,
    autoUpdatedAt:false
}
