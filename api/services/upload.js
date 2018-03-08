/**
 * Created by Administrator on 2016/8/25.
 */
var gm = require("gm").subClass({imageMagick:true});
var fs = require('fs');
var exec = require('child_process').exec;
module.exports = {
    preSize:60,
    /**
     * 图片逻辑
     * @param req
     * @param res
     * @param name
     * @param dirname
     * @param callback
       * @param isCompress
       */
    uploadFile:function(req,res,name,dirname,callback,isCompress){
        var date = new Date();
        var day = date.Format("yyyy")+"/"+date.Format("MM")+"/"+date.Format("dd");
        var dirname = dirname +"/" + day + "/";

        var _this = this,isCompress = isCompress || false;
        var filePath = sails.config.globals.uploadPath +"/"+ dirname;
        var urlPath = sails.config.globals.ImageUrl + dirname;

        var setting = {
            maxBytes:150000000000,
            dirname:filePath || ''
        };
        req.file(name).upload(setting, function (err, uploadFiles) {
            if (err){
                console.log("upload err：",err);
                return res.json({
                    code:400,
                    msg:"上传图片失败"
                });
            }
            var files = [];
            if(callback != null||callback != undefined){
                callback(uploadFiles);
            }else{
                if (uploadFiles && uploadFiles.length > 0) {
                    if(!isCompress){
                        async.mapSeries(uploadFiles,function (theFile,cb) {
                            var filename = theFile.fd.substring(theFile.fd.lastIndexOf("/") + 1, theFile.fd.length);
                            var webpFile = filename.substring(0,filename.indexOf("."))+".webp";
                            var webpPath = filePath + webpFile;

                            var item = {
                                url: urlPath + filename,
                                webp: urlPath + webpFile,
                                xmlPath: ''
                            };

                            if(theFile.fd.indexOf('.webp')>-1){// 上传vr图片，生成对应的模板
                                var filepath = urlPath + webpFile;
                                _this.VrXmlConf(filepath,filename,function(err,xmlp){
                                    item.xmlPath = xmlp;
                                    cb(err,item);
                                });
                            }else if(dirname.indexOf('vrpic')>-1){// 商户后台上传vr图片
                                var filepath = urlPath + webpFile;
                                _this.VrXmlConf(filepath,filename,function(err,xmlp){
                                    item.xmlPath = xmlp;
                                    gm(theFile.fd).compress("Zip").quality(0.5).write(webpPath,function (err) {
                                        if (err) {
                                            console.log('vr gm_err: ',err);
                                        }

                                        cb(err,item);
                                    });
                                });
                            }else{// 普通图片压缩成webp类型
                                gm(theFile.fd).compress("Zip").quality(0.5).write(webpPath,function (err) {
                                    if (err) {
                                        console.log('gm_err: ',err);
                                    }

                                    cb(err,item);
                                });
                            }
                        },function (err,ret) {
                            return res.json({
                                code: 200,
                                msg: ret.length + ' file(s) uploaded successfully and compress successfully!',
                                data: ret
                            });
                        });
                    }else{
                        return res.json({
                            code: 200,
                            msg: uploadFiles.length + ' file(s) uploaded successfully!',
                            data: files
                        });
                    }
                } else {
                    return res.json({
                        msg: '上传图片失败',
                        code: 400
                    });
                }
            }
        });
    },
    /**
     * 修改vr配置文件
     * @param filepath
     * @param filename
     * @constructor
     */
    VrXmlConf:function(filepath,filename,cb){
        var xmlPath = '';
        async.auto({
            one:function(callback){
                xmlPath = '/vrxml/www'+ filename.substring(0,filename.indexOf("."));
                fs.readdir(sails.config.globals.vrxmlpath,function(err,files){
                    console.log(files);
                    async.mapSeries(files,function(file,callb){
                        var xmlPath1 = sails.config.globals.vrxmlpath + '/' + file;
                        var xmlPath2 = sails.config.globals.vrxmlpath + filename.substring(0,filename.indexOf("."))+'/'+ file;
                        var dir = sails.config.globals.vrxmlpath + filename.substring(0,filename.indexOf("."))+'/';
                        if(!fs.existsSync(dir)){
                            fs.mkdirSync(dir);
                        }
                        console.log(xmlPath1,xmlPath2);
                        fs.readFile(xmlPath1,function(err1,data){
                            if(err1){
                                console.log(err1);
                                return;
                            }
                            var dataStr = '',str = '';
                            if(file.indexOf('krpano.xml')>-1){
                                dataStr = '<image><SPHERE url="https://dev.darlinglive.com'+ filepath +'"/></image></krpano>';
                                str = data.toString().replace('</krpano>','') + dataStr;
                            }else {
                                str = data;
                            }

                            fs.writeFile(xmlPath2,str,'utf-8',function(err2){
                                if(err2){
                                    console.log(err2);
                                    return;
                                }
                                callb(null,'');
                            });
                        });
                    },callback);
                });
            }
        },function(err,results){
            cb(err,xmlPath);
        })
    },
    /**
     * 视频逻辑
     * @param req
     * @param res
     * @param name
     * @param dirname
       * @param callback
       */
    uploadVideoFile:function (req,res,name,dirname,callback,isDivision) {
        var date = new Date();
        var day = date.Format("yyyy")+"/"+date.Format("MM")+"/"+date.Format("dd");
        var dirname =  dirname+"/" + day + "/";

        var _this = this,isDivision = isDivision || true;
        var filePath = sails.config.globals.uploadPath +"/"+ dirname;
        var urlPath = sails.config.globals.ImageUrl + dirname;

        var setting = {
            dirname:filePath,
            maxBytes:1572864000
        };

        var lastDir = Math.ceil((new Date()).getTime()/1000);
        setting.dirname += lastDir;
        urlPath += lastDir;
        req.file(name).upload(setting, function (err, uploadFiles) {
            if (err){
                return res.json({
                    code:400,
                    msg:"上传视频失败"
                });
            }
            var files = [];
            if(callback!=null||callback!=undefined){
                callback(uploadFiles);
            }else{
                console.log(uploadFiles,isDivision);
                if (uploadFiles && uploadFiles.length > 0) {
                    if(isDivision){
                        async.mapSeries(uploadFiles,function (theFile,cb) {
                            var filename1 = theFile.fd.substring(theFile.fd.lastIndexOf("/")+1,theFile.fd.length);
                            var filename2 = theFile.fd.substring(theFile.fd.lastIndexOf("/")+1,theFile.fd.lastIndexOf("."));
                            var pathname = theFile.fd.substring(0,theFile.fd.lastIndexOf("/"));

                            var item = {
                                url: urlPath + "/" + filename1,
                                diviurl: urlPath + "/" + filename2 + ".m3u8",
                                xmlPath: ''
                            };

                            _this.divisionVideo(theFile.fd,pathname,filename2,function(err,data){
                                cb(err, item);
                            });
                        },function (err,ret) {
                            if(err) return res.negotiate(err);
                            return res.json({
                                code: 200,
                                msg: ret.length + ' file(s) uploaded successfully and compress successfully!',
                                data: ret
                            });
                        });
                    }else{
                        return res.json({
                            code: 200,
                            msg: uploadFiles.length + ' file(s) uploaded successfully!',
                            data: files
                        });
                    }
                } else {
                    return res.json({
                        msg: '上传视频失败',
                        code: 400
                    });
                }
            }
        });
    },
    /**
     * 视频切割函数
     * @param src
     * @param urlPath
     * @param callback
       */
    divisionVideo:function(src,pathname,filename,callback){
        var cmdStr = "cd "+ pathname +" && ffmpeg -i "+ src +" -c:v libx264 -c:a aac -strict -2 -f hls -hls_time "+this.preSize+" "+filename+".m3u8 ";
        console.log('divisionVideo cmd is : ',cmdStr);
        exec(cmdStr, function (err, stdout, stderr) {
            callback(err, stdout);
        });
    },

}
