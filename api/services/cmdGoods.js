var exec = require('child_process').exec;

module.exports = { 

    _cmdBase:'/usr/bin/curl http://localhost:1338/',

    gotoCmdReady: function(storeid,type) {
        var self = this;
        var type = parseInt(type);
        console.log("ready. storeid = ",storeid," is type ",type);
        switch(type) {
            case 1:
                self.cmdNormalGoods(storeid);
                break;
            case 2:
                self.cmdPresalGoods(storeid);
                break;
            case 3:
                self.cmdSeckillingGoods(storeid);
                break;
            default:
                console.log("err. storeid = ",storeid," is type ",type);
        }
    },

    cmdNormalGoods: function (storeid) {
        var cmdStr = this._cmdBase + 'Dispatcher/readyNormalGoods?storeid=' + storeid;
        exec(cmdStr, function(err,stdout,stderr) {
            if (err) {
                console.log('cmdGoods/cmdNormalGoods faile.')
                return;
            }
            console.log("cmdGoods/cmdNormalGoods successful.");
            //console.log("stderr: ",stderr," \n ");
        });
    },

    cmdPresalGoods: function (storeid) {
        var cmdStr = this._cmdBase + 'Dispatcher/readyPresalGoods?storeid=' + storeid;
        exec(cmdStr, function(err,stdout,stderr) {
            if (err) {
                console.log('cmdGoods cmdPresalGoods faile.')
                return;
            }
            console.log("cmdGoods->cmdPresalGoods successful.");
            //console.log("stderr: ",stderr," \n ");
        });
    },

    cmdSeckillingGoods: function (storeid) {
        var cmdStr = this._cmdBase + 'Dispatcher/readySeckillingGoods?storeid=' + storeid;
        exec(cmdStr, function(err,stdout,stderr) {
            if (err) {
                console.log('cmdGoods/cmdSeckillingGoods faile.')
                return;
            }
            console.log("cmdGoods/cmdSeckillingGoods successful.");
            //console.log("stderr: ",stderr," \n ");
        });
    },

    cmdTimeGroup: function () {
        var cmdStr = this._cmdBase + 'Dispatcher/readyTimeGroup';
        exec(cmdStr, function(err,stdout,stderr) {
            if (err) {
                console.log('cmdGoods/cmdTimeGroup faile.')
                return;
            }
            console.log("cmdGoods/cmdTimeGroup successful.");
            //console.log("stderr: ",stderr," \n ");
        });
    },

    cmdUpdateGoods: function (sku) {
        var cmdStr = this._cmdBase + 'Dispatcher/readyUpdateGoods?sku=' + sku;
        exec(cmdStr, function(err,stdout,stderr) {
            if (err) {
                console.log('cmdGoods/cmdUpdateGoods faile.')
                return;
            }
            console.log("cmdGoods/cmdUpdateGoods successful.");
            //console.log("stderr: ",stderr," \n ");
        });
    },
};