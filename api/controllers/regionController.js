module.exports = {
    
    /**
     * 添加行政地区  
     *                                
     * @return view                     //返回视图页面
     */
    addRegin:function (req, res) {
        var msg = {} || msg;
        console.log('regionParam: This is the function entry.  check it out: ',msg);
        return res.view('goods/region',{});
    },

    /**
     * 行政地区参数
     *
     * @param  code                     //行政代码  
     * @param  province                 //省份名称 
     * @param  city                     //城市名称
     * @param  district                 //地区名称  
     * @param  parent                   //父子层级  
     *                                
     * @return {}                       //返回结果集
     */
    regionParam: function(req, res) {

        var msg = msg || {};
        msg.id = req.param('id');
        msg.code = req.param('code');
        msg.city = req.param('city');
        msg.parent = req.param('parent');
        msg.province = req.param('province');
        msg.district = req.param('district');
        console.log('regionParam: This is the function entry.  check it out: ',msg);

        for(var key in msg) {
            if(msg[key] == undefined) {
                return res.json({
                    err: 'Please enture ' + key + '.',
                    code: 4016
                });
             }
        }

        Citycode.create(msg, function (err, rst) {

            if (err) {
                console.log("err_ta1: When this error is returned, the query fails.");
                return res.negotiate(err);
            }

            console.log("cb_tag1: The result of this \' create \' is shown came out. check it out: ok");
            return res.json({
                user: rst,
                code: 202
            });
        });
    },

    /**
     * 更改行政地区
     *
     * @param  id                       //索引id  
     * @param  code                     //行政代码  
     * @param  province                 //省份名称 
     * @param  city                     //城市名称
     * @param  district                 //地区名称  
     * @param  parent                   //父子层级   
     *                                
     * @return {}                       //返回结果集
     */
    updateRegion: function(req, res) {

        var msg = {} || msg;
        msg.id = req.param('id');
        msg.code = req.param('code');
        msg.city = req.param('city');
        msg.parent = req.param('parent');
        msg.province = req.param('province');
        msg.district = req.param('district');
        console.log('updateRegion: This is the function entry.  check it out: ',msg);

        var ukey = ukey || {};
        var skey = skey || {};

        for(var key in msg) {
            if(msg[key] == undefined || msg[key] == '' ){
                delete msg[key];
            }else if(key == 'id'){
                ukey[key] = msg[key];
            }else{
                skey[key] = msg[key];
            }
        }

        if(ukey.id == undefined || ukey.id == '') {
            return res.json({err:'fail',code:4015});
        }

        Citycode.update(ukey).set(skey).exec(function (err, rst) {

            if (err) {
                console.log("err_tag1: information to add merchandise module;",err);
                return res.negotiate(err);
            }

            console.log("cb_tag1: The result of this \' update \' is shown came out. check it out: ok");
            return res.json({
                info: rst,
                code: 211
            }); 
        });
    },

    /**
     * 删除行政地区
     *
     * @param  id                       //所以id  
     * @param  code                     //行政代码  
     * @param  province                 //省份名称 
     * @param  city                     //城市名称
     * @param  district                 //地区名称  
     * @param  parent                   //父子层级   
     *                                
     * @return {}                       //返回结果集
     */
    deleteRegin: function(req, res) {

        var idArray = JSON.parse(req.param('idArray')); 
        console.log('deleteRegin: This is the function entry.  check it out: ',idArray);

        Citycode.destroy({id:idArray}).exec(function (err){

            if (err) {
                console.log("err_tag1: information to add merchandise module;",err);
                return res.negotiate(err);
            }

            console.log("cb_tag1: The result of this \' destroy \' is shown came out. check it out: ok");
            return res.json({
                info: 'success!',
                code: 211
            });
        });
    },
};