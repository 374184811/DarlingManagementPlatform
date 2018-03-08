/**
 * VRSquareController
 */
var fs = require('fs');
module.exports = {
    /**
     * 修改xml配置文件(暂时不启用)
     * @param req
     * @param res
     */
    medifyXmlFile: function(req, res){
        console.log(req.ip,req.path);
        
        var xmlPath1 = sails.config.globals.vrxmlpath + 'krpano.xml';
        var dataStr = req.param('data');
        var userId = req.param('userId');
  
        fs.readFile(xmlPath,'utf-8',function(err1,data){
            if(err1){
                console.log(err1);
                return;
            }
            var str = data.toString().replace('<\/krpano>','');
            var str2 = str + dataStr + '<\/krpano>';
            var xmlName = 'krpano_'+userId+'.xml';
            var xmlPath2 =  sails.config.globals.vrxmlpath + xmlName;
            fs.writeFile(xmlPath2,str2,'utf-8',function(err2){
                if(err2){
                    console.log(err2);
                    return;
                }
                return res.json({
                    code:200,
                    msg:'ok'
                });
            });
        });
    },
  
};
