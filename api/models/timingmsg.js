/**
 * timingmsg.js
 * 
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
module.exports = {
    tableName: 'timingmsg',
    attributes: {
        timingname:{// 定时器名字
            type: 'string',
            size: 100,
            defaultsTo: ''
        },
        sku:{// 商品货号
            type: 'string',
            size: 100,
            defaultsTo: ''
        },
        storeid:{// 商店id
            type: 'integer',
            defaultsTo: 0
        },
        endtime:{// 结束时间
            type: 'datetime',
            defaultsTo: new Date()
        },
        is_expire:{// 是否过期，1-未过期，2-过期
            type: 'integer',
            defaultsTo: 0
        },
        storecategoryid:{// 所属商户的商品分类 ID
            type: 'integer',
            defaultsTo: 0
        },
        goodsid:{// 商品id
            type: 'integer',
            defaultsTo: 0
        },
        type:{// 1:常规商品 2:预收商品
            type: 'integer',
            defaultsTo: 0
        }
    },
    autoPK: true,
    autoCreatedAt: true,
    autoUpdatedAt: true 
};
