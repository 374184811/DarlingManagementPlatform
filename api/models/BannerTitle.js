/**
 * Created by Administrator on 2016/8/29.
 */
module.exports = {
    tableName:'banner_title',
    attributes:{
        id:{
            type:"integer",
            primaryKey:true,
            unique:true
        },
        storeid:{//店铺id
            type:"integer",
        },
        sort:{ //排序
            type:"integer",
        },
        created_uid:{ //创建用户id
            type:"integer",
        },
        bannertype:{//模块【1,2,3,4】模块
            type:"integer",
        },
        name:{ //名称
            type:"string"
        },
        title:{ //标题
            type:"string"
        },
        remark:{ //备注信息
            type:"string"
        }
    },
    autoCreatedAt:false,
    autoUpdatedAt:false
}
