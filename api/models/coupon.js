/**
* coupon.js 优惠卷表
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
module.exports = {
  attributes: {
    storeid: {//卖家id
      type:'integer',
      defaultsTo:0
    },
    adminid1: {//增加优惠卷的admin账号的id
      type:'integer',
      defaultsTo:0
    },
    adminid2: {//修改优惠卷的admin账号的id
      type:'integer',
      defaultsTo:0
    },
    couponnum: {//优惠卷编码，生成规则：日期(年月日)+6位随机数字
      type: 'string',
      size: 50,
      defaultsTo: ''
    },
    couponname: {//优惠卷名称
      type: 'string',
      size: 100,
      defaultsTo: ''
    },
    couponamount: {//优惠卷数量
      type: 'integer',
      defaultsTo: 0
    },
    parvalue: {//优惠卷面值
      type:'float',
      size: '10,2',
      defaultsTo: 0.0
    },
    coupontype: {//优惠卷类型,如1-现金卷,2-其它
      type:'integer',
      defaultsTo:0
    },
    couponmode: {//优惠卷模式类别,1-满减类，2-派发和手动领取类，3-新人卷，4-实体卷
      type: 'integer',
      defaultsTo: 0
    },
    islimitmoney:{//是否限制金额:1限制使用金额 2、不限制使用金额
      type: 'integer',
      defaultsTo: 1
    },
    attainmoney:{//满足的金额，可自动领取
      type: 'float',
      size: '8,2',
      defaultsTo: 0.0
    },
    picture:{//上传的图片，如新人卷等
      type: 'string',
      defaultsTo: ''
    },
    ishavecode:{//是否拥有兑换码 ，0-未有，1-有
      type: 'integer',
      defaultsTo: 0
    },
    code:{//串码，用于链接地址，构成：开始时间+随机码+结束时间+类型
      type: 'string',
      defaultsTo: ''
    },
    userange: {//使用范围:1自营商品类别 2、自营所有商品 3、商品
      type:'integer',
      defaultsTo: 0
    },
    userangecon: {//使用范围具体内容
      type:'string',
      size:'1500',
      defaultsTo: ''
    },
    limitnum: {//领取数目限制
      type:'integer',
      defaultsTo:0
    },
    isrepeat:{//是否可以重叠使用:1不可重叠使用 2可重叠使用(同订单不重叠)
      type: 'integer',
      defaultsTo: 0
    },
    isvalid:{//是否立即生效，2-不立即生效，1-立即生效
      type: 'integer',
      defaultsTo: 0
    },
    isdel:{//是否删除，0-未删除，1-已删除
      type: 'integer',
      defaultsTo: 0
    },
    isssued:{//用于系统派发、手动领取类和实体卷类，1-派发，2-手动领取，3-兑换码发放实体卷，4-链接发放实体卷
      type: 'integer',
      defaultsTo: 0
    },
    starttime:{//有效开始时间
      type: 'datetime',
      defaultsTo: new Date()
    },
    endtime:{//有效结束时间
      type: 'datetime',
      defaultsTo: new Date()
    },
    remark:{//备注
      type: 'string',
      size:'500',
      defaultsTo: ''
    }
  },
  autoPK: true,//优惠卷id
  autoCreatedAt: true,
  autoUpdatedAt: true,
  /**
  *获取优惠卷详细数据
  *@param idstr id字符串orderid
  *@param orderid 订单号
  *@param uid 用户id
  *@returns 数组
  */
  /**
   * 获取优惠卷详细数据
   * @param idstr id字符串orderid
   * @param uid 用户id
   * @param flag 1-删除，其他依情况定
   * @param orderid 订单号
   * @param callback
   * @returns 数组
   */
  getCouponDetail:function(flag,idstr,uid,orderid,callback) {
      console.log('------getCouponDetail-------');
      var idStr = idstr;
      var couponArr = new Array();
      console.log(idstr,uid);
      if (typeof idStr != 'string') {
          callback(null,{code:501,msg:'传的参数不是字符串'});
      }
      if (idStr.length <= 0) {
          callback(null,{code:502,msg:'字符串长度为0'});
      }

      var idArr = new Array();
      var arr = idStr.split(',');
      for(var i=0;i<arr.length;i++){
          var obj = {};
          obj.usercid = Number(arr[i]);
          i++;
          obj.id = Number(arr[i]);
          idArr.push(obj);
      }
      console.log(idArr);

      idArr.forEach(function(item){
          var selectStr = "SELECT id,couponname,coupontype,parvalue,couponmode,couponnum,isssued,isdel,isvalid,endtime FROM coupon WHERE id=" + item.id;
          console.log(selectStr);
          coupon.query(selectStr, function(err, one) {
              if (err) {
                  console.log(err);
                  callback(err,{code:500,msg:'服务器错误'});
              }

              var nowTime = (new Date()).getTime();
              var coupTime = (new Date(one[0].endtime)).getTime();
              if (coupTime>=nowTime) {
                  one[0].isexpired = 0;// 0-表示未过期，1-表示已过期
              }else{
                  one[0].isexpired = 1;// 0-表示未过期，1-表示已过期
              }

              var condition = {};
              if(item.usercid == 0){
                  condition = {uid:uid,cid:item.id,orderid:orderid};
              }else{
                  condition = {id:item.usercid};
              }
              UserCoupon.findOne(condition).exec(function(err,ucoup){
                  if (err){
                      console.log(err);
                      callback(err,{code:500,msg:'服务器错误'});
                  }
  
                  one[0].aid = ucoup.id;
                  if(flag != 1){
                      one[0].couponname = ucoup.cname;
                      one[0].parvalue = ucoup.cmoney;
                  }
                  couponArr.push(one[0]);
                  if (couponArr.length == idArr.length) {
                      callback(null,{code:200,data:couponArr});
                  }
              });
          });
      });
  },
  /**
  *订单判断优惠卷使用返回优惠价格
  *@param idstr id字符串，形式如：0,1,0,2....,按照顺序第一个是aid，第二个是优惠券id，第三个是aid，以此类推
  *@param uid  用户id
  *@param goodsarr  商品数据数组 [{},....],对象中包含购买数量 num 字段
  *cb  回调函数
  */
  judgeCoupon:function(idstr,uid,goodsarr,cb) {
      console.log("--------------开始检测--------------");
      console.log(idstr);
      console.log(uid);
      console.log(goodsarr);
      var goodsArr = goodsarr;
      var idArr = new Array();
      var cheapPri = 0;// 便宜多少的价格
      var totalPri = 0;//所买商品的总价格
      var couponArr = new Array();//存储优惠券信息

      var arr = idstr.split(',');
      for(var i=0;i<arr.length;i++){
          var obj = {};
          obj.id = Number(arr[i]);
          i++;
          obj.cid = Number(arr[i]);
          idArr.push(obj);
      }
      console.log(idArr);
  
      for(var j=0;j<goodsArr.length;j++){
          totalPri += goodsArr[j].price*goodsArr[j].num;
      }
      console.log('totalPri: ',totalPri);

      async.mapSeries(idArr,function(item,callback){// 判断用户是否有该优惠券优惠券是否过期、是否满足使用范围等
          var retData1 = {code:4000,msg:''};
          if (item['id'] != 0) {//非满减逻辑处理
              UserCoupon.findOne({uid:uid,id:item.id,cid:item.cid,status:{'!':2}})
                .exec(function(err,ucoup){
                    if (err) {
                        console.log(err);
                        retData1.msg = '服务器错误';
                        return;
                    }
                    console.log(ucoup);
                    coupon.findOne({id:item.cid}).exec(function(err, coupons) {
                        if (err) {
                            console.log(err);
                            retData1.msg = '服务器错误';
                            return;
                        }
                        if (ucoup) {
                            coupons.aid = item.id;//对应的用户优惠券表id存入
                            couponArr.push(coupons);//优惠券存入数组
                            if (coupons.isrepeat != 1) {//是否可重
                                retData1 = checkCoupon(coupons);
                            } else {
                                if (idArr.length<=1) {
                                    retData1 = checkCoupon(coupons);
                                } else {
                                    retData1.code = 40001;
                                    retData1.msg = '有不可重的';
                                }
                            }
                        } else {
                            retData1.code = 40005;
                            retData1.msg = '用户已使用该优惠券';
                        }
                        callback(err,retData1);
                    });
                });
          } else {
              coupon.findOne({id:item.cid}).exec(function(err, coupons) {
                  if (err) {
                      console.log(err);
                      retData.msg = '服务器错误';
                      return;
                  }
                  coupons.aid = item.id;// 对应的用户优惠券表id存入
                  couponArr.push(coupons);//优惠券存入数组
                  console.log(coupons);
                  UserCoupon.find({uid:uid,cid:item.cid,orderid:{'!':0}})
                    .exec(function(err,ucoup){
                        if (err) {
                            console.log(err);
                            retData1.msg = '服务器错误';
                            return;
                        }
                        var selectStr = "SELECT count(*) AS cnt FROM user_coupon WHERE orderid !=0 AND cid="+item.cid;
                        UserCoupon.query(selectStr,function(err,ucout){//优惠券已使用总数
                            if (err) {
                                console.log(err);
                                retData1.msg = '服务器错误';
                                return;
                            }
                            if (ucout[0].cnt<coupons.couponamount) {// 是否使用完
                                if (ucoup.length<coupons.limitnum) {// 是否用户已使用
                                    if (coupons.isrepeat != 1) {// 是否可重
                                        retData1 = checkCoupon(coupons);
                                    } else {
                                        if (idArr.length<=1) {
                                            retData1 = checkCoupon(coupons);
                                        } else {
                                            retData1.code = 40001;
                                            retData1.msg = '有不可重的';
                                        }
                                    }
                                } else {
                                    retData1.code = 40005;
                                    retData1.msg = '用户已使用该优惠券';
                                }
                            } else {
                                retData1.code = 40006;
                                retData1.msg = '该满减券已使用完';
                            }
                            callback(err,retData1);
                        });
                    });
              });
          }
      },function(err,results){
          if (err) {
              console.log(err);
              return;
          }
          console.log('----------订单优惠券已检测---------');
          console.log(results);

          var isCheck = false;
          var retData = {};
          for(var i=0;i<results.length;i++){
              if (results[i].code != 200) {
                  retData.code = results[i].code;
                  retData.msg = results[i].msg;
                  retData.discount = cheapPri;
                  isCheck = true;
                  break;
              }
          }
          if (!isCheck) {
              retData.code = 200;
              retData.discount = cheapPri;
              retData.couponarr = couponArr;
          }

          cb(retData);
      });
  
      function checkCoupon(couponobj){

          var retData2 = {};

          var nowTime = new Date().getTime();
          var endTime = new Date(couponobj['endtime']).getTime();
          if(nowTime <= endTime) {//是否过期
              if(couponobj.isvalid != 2){//是否生效
                  if (couponobj.islimitmoney == 1) {// 判断是否限制金额
                      if (totalPri>=couponobj.attainmoney) {// 判断是否满足限制金额
                          switch(couponobj.userange){//判断使用范围
                              case 1:
                                  var sum =0;
                                  var userangeCon = JSON.parse(couponobj.userangecon);
                                  userangeCon.forEach(function (range) {
                                      goodsArr.forEach(function (product) {
                                          if(range.id==product.parentid){
                                              sum++;
                                          }
                                      });
                                  });
                                  if(goodsArr.length <= sum){
                                      cheapPri += couponobj.parvalue;
                                      retData2.code = 200;
                                      retData2.msg = 'ok';
                                  }else{
                                      retData2.code = 40003;
                                      retData2.msg = '类别无法使用';
                                  }
                                  break;
                              case 2:
                                  cheapPri += couponobj.parvalue;
                                  retData2.code = 200;
                                  retData2.msg = 'ok';
                                  break;
                              case 3:
                                  var sum = 0;
                                  var userangeCon = JSON.parse(couponobj.userangecon);
                                  userangeCon.forEach(function (range) {
                                      goodsArr.forEach(function (goods) {
                                          var obj = gcom.revertSku(goods.sku);
                                          if(range.sku==obj.sku){
                                              sum++;
                                          }
                                      });
                                  });
                                  if(goodsArr.length <= sum){
                                      cheapPri += couponobj.parvalue;
                                      retData2.code = 200;
                                      retData2.msg = 'ok';
                                  }else{
                                      retData2.code = 40004;
                                      retData2.msg = '商品无法使用';
                                  }
                                  break;
                          }
                      } else {
                          retData2.code = 4005;
                          retData2.msg = '不满足限制金额';
                      }
                  } else {// 没有限制金额
                      switch(couponobj.userange){//判断使用范围
                          case 1:
                              var sum =0;
                              var userangeCon = JSON.parse(couponobj.userangecon);
                              userangeCon.forEach(function (range) {
                                  goodsArr.forEach(function (product) {
                                      if(range.id==product.parentid){
                                          sum++;
                                      }
                                  });
                              });
                              if(goodsArr.length <= sum){
                                  cheapPri += couponobj.parvalue;
                                  retData2.code = 200;
                                  retData2.msg = 'ok';
                              }else{
                                  retData2.code = 40003;
                                  retData2.msg = '类别无法使用';
                              }
                              break;
                          case 2:
                              cheapPri += couponobj.parvalue;
                              retData2.code = 200;
                              retData2.msg = 'ok';
                              break;
                          case 3:
                              var sum =0;
                              var userangeCon = JSON.parse(couponobj.userangecon);
                              userangeCon.forEach(function (range) {
                                  goodsArr.forEach(function (goods) {
                                      var obj = gcom.revertSku(goods.sku);
                                      if(range.sku==obj.sku){
                                          sum++;
                                      }
                                  });
                              });
                              if(goodsArr.length <= sum){
                                  cheapPri += couponobj.parvalue;
                                  retData2.code = 200;
                                  retData2.msg = 'ok';
                              }else{
                                  retData2.code = 40004;
                                  retData2.msg = '商品无法使用';
                              }
                              break;
                      }
                  }
              }else{
                  retData2.code = 40007;
                  retData2.msg = '未生效';
              }
          }else{
              retData2.code = 40002;
              retData2.msg = '过期';
          }
          console.log('优惠价格：',cheapPri);
          return retData2;
      }
  },
  /**首次登陆
  *检查优惠券表中是否有该手机号码，并进行相关操作
  *@param mobileobj 用户对象
  *@cb 回调数
  */
  check:function(mobileobj,cb) {
      console.log('--------首次登陆--------');
      console.log(mobileobj);
      console.log('--------首次登陆--------');
      if (!mobileobj) {
         cb({code:501,msg:'参数有误'});
      }
      UserCoupon.find({user:mobileobj.mobile,status:3}).exec(function(err,result1){
          if (err) {
              console.log(err);
              cb({code:500,msg:'服务器错误'});
              return;
          }
          if (result1&&result1.length>0) {
              var idArr = new Array();
              result1.forEach(function(item){
                  idArr.push(item.cid);
              });
              console.log(idArr);
              var nowTime = (new Date()).Format("yyyy-MM-dd hh:mm:ss");
              var where = {id:idArr,endtime:{'>=':nowTime}};
              coupon.find(where).exec(function(err,result2){
                  if(err){
                      console.log(err);
                      return;
                  }
                  if (result2&&result2.length>0) {
                      UserCoupon.update({user:mobileobj.mobile,status:3},{status:1,uid:mobileobj.id}).exec(function(err,update){
                          if (err) {
                              console.log(err);
                              cb({code:500,msg:'服务器错误'});
                              return;
                          }
                          cb({code:200,msg:'已存入账户'});
                      });
                  } else {
                      if (result2.length == result1.length) {
                          cb({code:503,msg:'优惠券都已过期'});
                      } else {
                          cb({code:504,msg:'优惠券部分过期'});
                      }
                  }
              });
          } else {
              cb({code:502,msg:'表中没有领取过的优惠券'});
          }
      });
  },

};
