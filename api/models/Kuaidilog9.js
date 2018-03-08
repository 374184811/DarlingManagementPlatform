/**
 * 快递100数据保存表
 *
 */
module.exports = {

    attributes: {
        company:{
            type:"String",
            size:50
        },
        payorder:{
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
        status: {type: 'integer',defaultsTo:0},
        detailbody: {type: 'text', defaultsTo: ''},
    },
    autoPK: true,
    autoCreatedAt:false,
    autoUpdatedAt:false
}
