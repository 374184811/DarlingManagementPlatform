/**
 * 
 * 订单时效性相关的定时器记录表
 */
module.exports = {
    attributes: {
        scheduleinfo:{// 订单号 ordernumber
            type: 'string',
            size: 100,
            defaultsTo: ''
        },
        scheduleinfo2:{// 订单详细子表名 tablenameofitem
            type: 'string',
            size: 100,
            defaultsTo: ''
        },
        triggertime:{// 触发时间
            type: 'datetime',
            defaultsTo: new Date()
        },
        is_expire:{// 是否过期，0-未过期，1-过期
            type: 'integer',
            defaultsTo: 0
        },
        is_trace:{// 服务器是否使用，0-未使用，1-正在使用
            type: 'integer',
            defaultsTo: 0
        },
        /*
        表示不同的定时器类型，用于区分调用不同的触发响应函数
        0,售后申请后，如果商家未处理超过3天，该申请直接被商户自动同意
        1,商家同意，等待买家退货：商家同意退款退货申请，买家有7天时间提交快递单号，
          如果超出7天，退款入口将自动关闭
        2,管理后台财务人员退款后超过7天，客户端需要自动确认完成
        */
        type:{
            type: 'integer',
            defaultsTo: 0
        }
    },
    autoPK: true,
    autoCreatedAt: true,
    autoUpdatedAt: true 
};
