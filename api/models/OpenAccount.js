/**
 * Created by Administrator on 2016/12/8.
 */
module.exports = {
    tableName:"open_account",
    attributes: {
        id: {type: 'integer', defaultsTo: 0},
        oid: {type: 'string', size:64, defaultsTo: 0},
        unionid: {type: 'string',size:64, defaultsTo: 0},
        username: {type: 'string',size:64, defaultsTo: 0},
        uid: {type: 'integer', defaultsTo: 0},
        useralias: {type: 'string',size:64,defaultsTo: 0},
        userpic: {type: 'string', defaultsTo: ""},
        type: {type: 'integer', defaultsTo: 0},
    },
    saveAccount:function (user,next) {
        //  var sql=" insert into account(useralias,province,city,userpic,sex) values";
        // this.query("set autocommit =0; ")
        member.useralias=user.username;
        member.province=user.province;
        member.city=user.city;
        member.userpic=user.userpic;
        member.sex=user.sex;
        member.money = 0;
        member.userbqlid = 0;
        member.statuscode = 1;
        member.operatorno = 4;
        member.shop_name = "打令智能";
        var source=this.attributes.keys;
        var model=Object.assign(source,user);
         Account.create(member).exec(function (err,newUser) {
             if(err) next(err,null);
             if(newUser){
                 OpenAccount.create(model).exec(next);
             }else{
                 next(null,null);
             }
         });
    }
};