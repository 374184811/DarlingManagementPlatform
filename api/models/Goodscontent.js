module.exports = {
    autoPK: true,
    attributes: {

        //所属商户的商品分类 ID
        storecategoryid: {type: 'integer', defaultsTo: 0},
        parentid: {type: 'integer', defaultsTo: 0},
        // 作为商品系列使用 主商品对应的值是0, 主商品的其它规格商品该处填写主商品id
        goodsseries: {type: 'integer', defaultsTo: 0},
        // 商品详情页面信息 <p style=\"text-align:center\"><span style=\"color:#B22222\">ware is having good looking</span></p>
        detailbody: {type: 'text', defaultsTo: ''},
        // //品牌 ID
        brandid: {type: 'integer', defaultsTo: 0},
        // 商品状态 0 未审核   1 审核失败 2 未上架  3 正常
        status: {type: 'integer', defaultsTo: 0},
        // 商品添加者（管理员） ID
        userid: {type: 'integer', defaultsTo: 0},
        // //运营商商家商户 ID
        storeid: {type: 'integer', defaultsTo: 0},
        // //商品名称
        name: {type: 'string', size: 200, defaultsTo: ''},
        //页面关键词
        keywords: {type: 'string', size: 250, defaultsTo: ''},
        // //商品货号要求 在该运营商中是唯一的  商品id+属性值+日期（年月日）
        sku: {type: 'string', defaultsTo: ''},
        // //默认图片，即封面
        imagedefault: {type: 'string', size: 250, defaultsTo: ''},
        // //属性关联组合，记作：property_id:property_value_id,property_id:property_value_id。比如颜色,尺码
        propertyrelated: {type: 'string', size: 250, defaultsTo: ''},
        propertypic: {type: 'string', size: 250, defaultsTo: ''},// 商品规格图片
        // 属性关联值，记作 颜色,尺码 便于属性搜索
        propertyvaluelist: {type: 'text', defaultsTo: '白色:32G:套餐2'},
        // //商品图片 ID，多个以半角逗号分隔
        attachment: {type: 'string', size: 250, defaultsTo: ''},
        // //库存
        stock: {type: 'integer', defaultsTo: 0},
        //商品价格
        price: {type: 'float', size: '15,4', required: true},
        //商品点卷价格  即 合约价格
        pricepoint: {type: 'float', size: '15,4', required: true},
        //商品活动价格
        pricepromotion: {type: 'float', size: '15,4', required: true},
        reserve1: {type: 'text', defaultsTo: 0},//预留
        reserve2: {type: 'text', defaultsTo: 0},//预留
        reserve3: {type: 'text', defaultsTo: 0},//商城管理异业联盟数据缓存
        reserve4: {type: 'text', defaultsTo: 0},//预留
        reserve5: {type: 'text', defaultsTo: 0},//审核意见
        reserve6: {type: 'text', defaultsTo: 0},//商户展示商品的排序  权重(商城管理)
        reserve7: {type: 'text', defaultsTo: 0},//商铺主页设置数据缓存
        reserve8: {type: 'text', defaultsTo: 0},//预留
        reserve9: {type: 'text', defaultsTo: 0},//预留
        reserve10: {type: 'integer', defaultsTo: 0},//用于统计商品已售数量
        //重量。单位：克
        weight: {type: 'integer', defaultsTo: 0},
        recommend: {type: 'integer', defaultsTo: 0},

        // // 1:常规商品 2:预收商品
        type: {type: 'integer', size: '15,4', required: true},
        // // 预售价格
        premoneey: {type: 'float', size: '15,4', required: true},
        // // 定金
        deposit: {type: 'float', size: '15,4', required: true},
        // // 预售结束时间
        presaleendtime: {
            type: 'date',
            defaultsTo: new Date()
        },
        // //预售流程
        presaleflow: {type: 'text', defaultsTo: 0},
        // //预售说明
        presaledescript: {type: 'text', defaultsTo: 0},
        // //预售流程说明
        presaleflowdescript: {type: 'text', defaultsTo: 0},

        //主页展示价格
        homenormalprice: {type: 'float', size: '15,4', required: true},
        //主页秒杀价格 
        homeseckillingprice: {type: 'float', size: '15,4', required: true},
        //秒杀时间
        seckillingtime:{type: 'json'},
        //秒杀说明
        seckillingexplain:{type: 'text', defaultsTo: 0},//预留
        //秒杀描述
        seckillingdescription:{type: 'text', defaultsTo: 0},//预留
        //秒杀流程
        seckillingflow:{type: 'text', defaultsTo: 0},//预留

        //秒杀价格
        seckillingprice: {type: 'float', size: '15,4', required: true},
        //秒杀库存
        seckillingstock: {type: 'float', size: '15,4', required: true},
        //是否秒杀
        isseckilling: {type: 'integer', size: '15,4', required: true},
        //秒杀售出
        seckillingsell: {type: 'integer', size: '15,4', required: true},
        
    },

    autoCreatedAt: true,
    autoUpdatedAt: false

};
/*
end chunk
/finod/tryPingpp
218.17.231.172
end chunk
/finod/tryPingpp
218.17.231.172
{ id: 'evt_4XrcAPQ2LExWCe2U8GEkaeF5',
  created: 1471682926,
  livemode: true,
  type: 'charge.succeeded',
  data: 
   { object: 
      { id: 'ch_4GifLSTSGWjL1KOmTG0aLGeD',
        object: 'charge',
        created: 1471682865,
        livemode: true,
        paid: true,
        refunded: false,
        app: 'app_mXnPC8bP84aTe9Oe',
        channel: 'alipay_wap',
        order_no: 'be894511c81e',
        client_ip: '218.17.231.172',
        amount: 1,
        amount_settle: 1,
        currency: 'cny',
        subject: 'Charge Subject',
        body: 'Charge Body',
        extra: [Object],
        time_paid: 1471682925,
        time_expire: 1471769265,
        time_settle: null,
        transaction_no: '2016082021001004520261857520',
        refunds: [Object],
        amount_refunded: 0,
        failure_code: null,
        failure_msg: null,
        metadata: {},
        credential: {},
        description: null } },
  object: 'event',
  pending_webhooks: 2,
  request: 'iar_yf1mj5D8eX9Ga9yDaP4S8S00' }
undefined
未知 Event 类型
{ body: 'Charge Body',
  is_success: 'T',
  notify_id: 'RqPnCoPT3K9%2Fvwbh3InWf0tLF3FmQObwhitgrgNB74no%2B6zsbxOAJr%2B4Egz7VX5xURTR',
  notify_time: '2016-08-20 16:48:45',
  notify_type: 'trade_status_sync',
  out_trade_no: 'be894511c81e',
  payment_type: '1',
  seller_id: '2088221766468774',
  service: 'alipay.wap.create.direct.pay.by.user',
  subject: 'Charge+Subject',
  total_fee: '0.01',
  trade_no: '2016082021001004520261857520',
  trade_status: 'TRADE_SUCCESS',
  sign: 'HzESNJOVp44tRRIpO13qc8pjW0DGRM0AaryIL/m73KOSAbGi3UlFOkr2eArdn4zSjoDDOXNchW1u3V5MtL/ZxJixJ5Xvjp8G4tqBhLu0h4P7jhE4XMlycJnBnJM3lBp2MAHlyGYZZ6HiTfXnMwywfe1FRXMn6DiPTXpTHsozP18=',
  sign_type: 'RSA' }
be894511c81e
未知 Event 类型
{ body: 'Charge Body',
  is_success: 'T',
  notify_id: 'RqPnCoPT3K9%2Fvwbh3InWf0tLF3FnFNrqMYlumBIft8jUzi1RTGD0OkLzU3R2az9MxWk2',
  notify_time: '2016-08-20 16:48:53',
  notify_type: 'trade_status_sync',
  out_trade_no: 'be894511c81e',
  payment_type: '1',
  seller_id: '2088221766468774',
  service: 'alipay.wap.create.direct.pay.by.user',
  subject: 'Charge+Subject',
  total_fee: '0.01',
  trade_no: '2016082021001004520261857520',
  trade_status: 'TRADE_SUCCESS',
  sign: 'OyjZD0HQdq3WzmOjKPLHspMMFX32PzJn0XLK/Vd0qXqsaTHtIdKgYZlxLgDcN3zLc+69sBXG1mVkB0qSVtJtm0SRFmRKtyopLTW+Qa3qZcHVoaBtbrs9nCy6jejZ9SSoC3rymwb6LPOy8NQRZP0lxfMP5FRVI2pGfOd1+ZkM7pA=',
  sign_type: 'RSA' }
be894511c81e
未知 Event 类型
{}
undefined
未知 Event 类型
end chunk
/finod/tryPingpp
218.17.231.172
{}
undefined
未知 Event 类型
{}
undefined
未知 Event 类型




{ access_token: 'be7C1Q4dymAB6tx2rSy_S3H7WnAM7-9PU5ysawJivWPzljNQ4so1FIgEk0lnLsP
QKEUmwiWi20d3OOrXMW3X3T8V1CmohigTjzYOvFPuDsUXGKhADAJSW',
  expires_in: 7200 }
getJsapiTicket21
{ errcode: 0,
  errmsg: 'ok',
  ticket: 'kgt8ON7yVITDhtdwci0qeaPtSwj5TdrpaWnRybtctko1qB4VT29k9HoMLn4xzwPxaCh-a
t3AfXAxYdMFvWrSjQ',
  expires_in: 7200 }
*/