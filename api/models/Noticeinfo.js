module.exports = {
    attributes: {
        //公告添加者id
        userid: {type: 'integer', defaultsTo: 0},
        // 发布类型 0 即时发布  1 定时发布
        publishtype: {type: 'integer', defaultsTo: 0},
        //定时发布 对应的发布时间
        publishtime: {type: 'integer', defaultsTo: '0'},
        //公告标题
        title: {type: 'string', size: 200, defaultsTo: ''},
        //公告详细内容
        detailbody: {type: 'text', defaultsTo: ''},
        //是否标记为删除状态。1是 0否
        isdelete: {type: 'boolean', size: '1'},
        //已阅读公告的商户id
        readstore:{type: 'string', size: 300, defaultsTo: ''}
    },
    autoPK: true,// ID
    autoCreatedAt: true,
    autoUpdatedAt: true
};
