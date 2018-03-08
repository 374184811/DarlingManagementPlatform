/**
 * presellmsg.js
 * 
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
module.exports = {
    tableName: 'presellgoodsmsg',
    attributes: {
        goodsname:{// 预购商品名称
            type: 'string',
            size: 200,
            defaultsTo: ''
        },
        sku:{// 商品货号
            type: 'string',
            size: 255,
            defaultsTo: ''
        },
        goodsresidue:{// 预购商品剩余数量
            type: 'integer',
            defaultsTo: 0
        },
        goodstotal:{// 预购商品总数量
            type: 'integer',
            defaultsTo: 0
        },
        orderbeing:{// 已预购人数
            type: 'integer',
            defaultsTo: 0
        },
        reservegold:{// 预购需支付的定金
            type: 'float',
            size: '12,4',
            required: true
        },
        orderstarttime:{// 预购开始时间
            type: 'datetime',
            defaultsTo: new Date()
        },
        ordervalidtime:{// 预购持续时间
            type: 'datetime',
            defaultsTo: new Date()
        },
        presaleendtime: {// 预售结束时间
            type: 'date',
            defaultsTo: new Date()
        },
        payvalidtime:{// 尾款支付有效时间
            type: 'datetime',
            defaultsTo: new Date()
        },
        is_orderstart:{// 预购开始标识，0-未开始，1-开始
            type: 'integer',
            defaultsTo: 0
        },
        is_orderstop:{// 预购结束标识,0-未停止，1-停止
            type: 'integer',
            defaultsTo: 0
        },
        is_paystart:{// 尾款开始支付标识，0-未开始，1-开始
            type: 'integer',
            defaultsTo: 0
        },
        is_paystop:{// 尾款结束支付标识，0-未结束，1-结束
            type: 'integer',
            defaultsTo: 0
        },
        timingname:{// 定时器名字
            type: 'string',
            size: 200,
            defaultsTo: ''
        },
        imagedefault: {type: 'string', size: 250, defaultsTo: ''},//预售产品默认图片
        robot_image:{//机器人端显示图片
            type: 'string',
            size: 200,
            defaultsTo: ''
        },
        mobi_image:{ //移动端显示图片
            type: 'string',
            size: 200,
            defaultsTo: ''
        },
        storeid:{ //店铺id
            type: 'integer',
            defaultsTo: 0
        },
        price:{ //预售价格
            type: 'float',
            size: '12,4',
            required: true
        },
        shop_name:{ //店铺名称
            type: 'string',
            size: 200,
            defaultsTo: ''
        },
        sort:{ //排序
            type: 'integer',
            size: 2,
            defaultsTo: 0
        },
        display:{ //显示位置 1为只在首页显示, -1 为不显示,0为不限
            type: 'integer',
            size: 1,
            defaultsTo: 0
        },
        type:{ //输入类型0,为自动获取,1为手工输入
            type: 'integer',
            size: 1,
            defaultsTo: 0
        },
    },
    autoPK: true,
    autoCreatedAt: true,
    autoUpdatedAt: true,
    /**
     *
     * @param sku 预售商品sku
     * @param buy_count 购买数量
     * @param callback 回调 （err ,{code,msg}）
     */
    updateOrderBeing:function (sku,buy_count,callback) {
        var _this=this;
        var skuObj=gcom.revertSku(sku);
        var storeid=skuObj.storeid;
        console.log(skuObj);
        var realSku=skuObj.randomNum+"-"+skuObj.storeid+"-"+skuObj.timestamp;
        this.findOne({sku:realSku}).exec(function (err,sale) {
            if(err) callback(err,null);
            if(sale){

                if(sale.type==1){
                      var cnt=parseInt(sale.orderbeing)+buy_count;
                    // if(cnt>sale.goodstotal||sale.goodsresidue>buy_count){
                    //     callback(err,{code:403,msg:"已超过预订数量"});
                    // }

                    updateOrderCount(sku,cnt,buy_count,callback);
                }else{
                    var sql="select sum(reserve10) as count from mergoodsList"+storeid+" where sku like '"+realSku+"%'";
                    _this.query(sql,function (err,goods) {
                        if(err) callback(err,null);
                        if(goods&&goods.length>0){
                            var product=goods[0];
                            // var cnt=parseInt(product["count"])+parseInt(buy_count);
                            var cnt=product["count"];
                             /* if(cnt>sale.goodstotal||sale.goodsresidue>buy_count){
                                callback(err,{code:403,msg:"已超过预订数量"});
                            }*/
                            updateOrderCount(sku,cnt,buy_count,callback);
                        }else{
                            callback(null,{code:404,msg:"sku对应的产品不存在"});
                        }
                    });
                }
            }else{
                callback(null,{code:404,msg:"sku对应的预售商品不存在"});
            }
        });
        function updateOrderCount(sku,cnt,buy_count,callback){
            var skuObj=gcom.revertSku(sku);
            var realSku=skuObj.randomNum+"-"+skuObj.storeid+"-"+skuObj.timestamp;
            var sql="update presellgoodsmsg set orderbeing="+cnt+",goodsresidue=goodsresidue-"+buy_count+" where sku='"+realSku+"'";
            // console.log("++++++++++++++update sale count++++++++++++++++++");
            // console.log(sql);
            // console.log("++++++++++++++update sale count++++++++++++++++++");
            _this.query(sql,callback);
        }
    }


};
