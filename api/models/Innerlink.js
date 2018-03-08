/**
 * Created by Administrator on 2016/8/10.
 */
module.exports = {

    attributes: {
        labelname:{
            type:"String", //显示名称
            size:100
        },
        url:{ //url链接
            type:"String",
            size:100
        },
        params:{ //参数
            type:"String",
            size:100
        },

    },
    autoPK: true,
    autoCreatedAt:false,
    autoUpdatedAt:false
}