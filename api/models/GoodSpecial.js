/**
 * Created by Administrator on 2016/8/10.
 */
module.exports = {
    autoPK: true,
    attributes: {
        name:{ //专场或者自定义名称
            type:"String",
            size:20
        },
        mobiBanner:{ //手机端图片
            type:"String",
            size:100,
        },
        robotBanner:{ //机器人或pad端图片
            type:"String",
            size:100,
        },
        targetUrl:{//图片跳转链接
            type:"String",
        },
        products:{ //图片显示的产品
            type:"String"
        },
        content:{//专场的内容
            type:"String"
        },
        type:{ //类型1为专场0为自定义
            type:"integer"
        },
        storeid:{ //店铺id
            type:"integer"
        },
        status:{//状态
            type:"integer"
        },
        linktype:{
            type:"integer",
            size:1
        }
    },
    autoCreatedAt:true,
    autoUpdatedAt:true
}