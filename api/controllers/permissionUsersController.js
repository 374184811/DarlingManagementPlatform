var Passwords = require('machinepack-passwords');
var crypto = require("crypto");
module.exports = {
    /*
     http://192.168.0.81:1348/permission/registered?parentid=0&username=haoxing3&password=123456&operatorid=1
     http://192.168.0.81:1348/permission/login?username=haoxing&password=123456
     */
    /**
     * 添加用户
     * @param parentid int 非必传
     * @param mobile int 手机号码 非必传
     * @param username string 用户名 非必传
     * @param groupid int  组id 非必传
     * @param isdelete int  是否可以删除 非必传
     *permissionController.addAdminUser
     * @param req
     * @param res
     */
    addAdminUser: function (req, res) {
        var insertdata = {};
        var mine = req.session.mine;
        if (!mine) {
            return res.json({
                code: 400,
                msg: "用户未登录"
            });
        }
        insertdata.parentid = req.param('parentid', 0);
        insertdata.hid = '';
        insertdata.mobile = req.param('mobile', 0);
        insertdata.username = req.param('username');
        insertdata.groupid = req.param('groupid');
        insertdata.password = req.param('password');
        // insertdata.storeid = req.param('storeid');
        insertdata.isdelete = req.param('isdelete', 1);
        if (req.session.mine) {
            insertdata.storeid = req.session.mine.storeid;
        }
        if (!insertdata.username) {
            return res.json({
                code: 400,
                msg: "用户名未传递"
            });
        }
        insertdata.isAdmin = 0 ; 
        Adminuser.findOne({username: insertdata.username}).exec(function (err, adminUser) {
            if (err) return res.negotiate(err);
            if (!adminUser) {
                if (mine.storeid == 0) {
                    SystemSetting.findOne({key: "defaultPassword"}).exec(function (err, setting) {
                        if (err) return res.negotiate(err);
                        var defaultPwd = "e10adc3949ba59abbe56e057f20f883e";
                        if (setting) {
                            defaultPwd = setting.value;
                        }
                        insertdata.password = defaultPwd;
                        addUser(insertdata);
                    });
                } else {
                    Accountseller.findOne({id: mine.storeid}).exec(function (err, seller) {
                        if (err) return res.negotiate(err);
                        if (seller) {
                            var passwrod = seller.password2 ? seller.password2 : "e10adc3949ba59abbe56e057f20f883e";
                            insertdata.password = passwrod;

                            seller.useralias = seller.useralias;
                            insertdata.username += "@"+seller.useralias;
                        

                            // console.log("------------");
                            addUser(insertdata);
                        } else {
                            return res.json({
                                code: 400,
                                msg: "添加失败,运营商不存在"
                            })
                        }

                    });
                }

            } else {
                return res.json({
                    code: 400,
                    msg: "用户已存在"
                });
            }
        });
        function addUser(insertdata) {
            Passwords.encryptPassword({
                password: insertdata.password,
                difficulty: 10,
            }).exec({

                error: function (err) {
                    console.log("err:  When this error is returned, the encryption operation fails.");
                    return res.negotiate(err);
                },

                success: function (encryptedPassword) {
                    insertdata.password = encryptedPassword;
					
                    Adminuser.create(insertdata).exec(function adduser(err, per) {
						// console.log("+++++++++");
                        if (err) return res.negotiate(err);
						
						if(per){
							 delete per.password;
							
							return res.json({
								per: per,
								code: 200
							});
						}else{
							return res.json({
								code:400,
								msg:"添加失败"
							});
						}
                      
                    });
                }
            });
        }

    },
    /**
     * 修改用户
     * @param parentid int 非必传
     * @param mobile int 手机号码 非必传
     * @param username string 用户名 非必传
     * @param groupid int  组id 非必传
     * @param isdelete int  是否可以删除 非必传
     * @param id int 用户id
     * @param req
     * @param res
     */
    editAdminUser: function (req, res) {
        var mine = req.session.mine;
        if (!mine) {
            return res.json({
                code: 400,
                msg: "用户未登录"
            });
        }
        var mine = req.session.mine;
        if (!mine) {
            return res.json({
                code: 400,
                msg: "用户未登录"
            });
        }
        var insertdata = {};
        var id = req.param("id", 0);
        insertdata.parentid = req.param('parentid', 0);
        insertdata.hid = '';
        insertdata.mobile = req.param('mobile', 0);
        insertdata.username = req.param('username');
        insertdata.groupid = req.param('groupid');
        insertdata.isdelete = req.param('isdelete', 1);
        if (req.session.mine) {
            insertdata.storeid = req.session.mine.storeid;
        }
        for(var key in insertdata){
            if(!insertdata[key]){
                delete insertdata[key];
            }
        }
        Adminuser.findOne({id: id,storeid:mine.storeid}).exec(function (err, adminUser) {
            if (err) return res.negotiate(err);
            if (!adminUser) {
                return res.json({
                    code: 400,
                    msg: "用户不存在"
                });
            } else {
                Adminuser.update({id: id,storeid:mine.storeid}).set(insertdata).exec(function (err, user) {
                    if (err) return res.negotiate(err);
                    if (user) {
                        return res.json({
                            code: 200,
                            msg: "修改成功"
                        });
                    } else {
                        return res.json({
                            code: 400,
                            msg: "修改失败"
                        });
                    }
                });
            }
        });
    },

    login: function (req, res) {

        Adminuser.findOne({
            username: req.param('username')
        }, function foundUser(err, user) {
            if (err) return res.negotiate(err);
            if (!user) return res.notFound();

            Passwords.checkPassword({
                passwordAttempt: req.param('password'),
                encryptedPassword: user.password
            }).exec({

                error: function (err) {
                    return res.negotiate(err);
                },

                incorrect: function () {
                    return res.notFound();
                },

                success: function () {
                    req.session.mine = user;
                    return res.json('login ok');
                }
            });
        });

    },
    logout: function (req, res) {


        var minedata = {};
        minedata.userid = req.param('userid');
        minedata.operatorid = req.param('operatorid');
        if ((req.session.mine.userid == minedata.userid) && (req.session.mine.operatorid == minedata.operatorid)) {
            res.json('logout ok');
        } else {
            res.json('logout false');
        }
    },
    /**
     * 部门列表
     * storeid int 店铺id 非必传，【如果是商户登录则不传】
     * @param req
     * @param res
     */
    departmentList: function (req, res) {

        console.log('departmentList: This is the function entry. check it out: ', req.allParams());
        
        var mine = req.session.mine;
        var allParams = req.allParams();
        console.log('mine. check it out. ',mine);

        var groupid = mine.id;
        var storeid = mine.storeid;

        console.log('groupid. ',groupid," ","storeid. ", storeid);

        //构造消息
        var MsgObj = {};

        MsgObj.hid = 0;
        MsgObj.storeid = storeid;
        MsgObj.addid = {">=":groupid};
        
        console.log('MsgObj. check it out. ',MsgObj);
        Departmentgroup.find(MsgObj).exec(function (err, list) {
            if (err) return;
            console.log("cb_tag1: The result of this create is shown came out. check it out: ",list.length);
            return res.json({
                code: 200,
                data: list
            });
        });

        // if (!req.session.mine) {
        //     return res.json({
        //         code: 400,
        //         msg: "需要登录"
        //     });
        // }
        // var mine = req.session.mine;
        // var storeid = req.param("storeid", mine.storeid);

        // var condition = {};
        // condition.storeid = storeid || 0;
        // condition.hid = 0;
        // if(mine.storeid){
        //     condition.addid={">":mine.groupid};
        // }

        // Departmentgroup.find(condition).exec(function (err, departments) {
        //     if (err)return res.negotiate(err);
        //     if (departments.length > 0) {
        //         return res.json({
        //             code: 200,
        //             data: departments
        //         });
        //     }
        //     return res.json({
        //         code: 400,
        //         msg: "没有数据"
        //     });
        // });

    },
    /**
     * 用户组列表
     * storeid int 店铺id 非必传，【如果是商户登录则不传】
     * @param req
     * @param res
     */
    groupList: function (req, res) {
        if (!req.session.mine) {
            return res.json({
                code: 400,
                msg: "需要登录"
            });
        }
        var mine = req.session.mine;
        var storeid = req.param("storeid", mine.storeid);
        var did = req.param("did", 0);
        var sql = "select a.*,b.name as department,a.permission from departmentgroup a left join (select * from departmentgroup) b on a.parentid=b.id where ";
        sql += "a.storeid=" + storeid + " AND a.hid=1";
        if(mine.storeid){
           sql+="  AND a.addid!=1"
        }
        if (did) {
            sql += " AND　a.parentid=" + did;
        }

        console.log(sql);
        Departmentgroup.query(sql, function (err, departments) {
            if (err)return res.negotiate(err);
            if (departments.length > 0) {
                return res.json({
                    code: 200,
                    data: departments
                });
            }
            return res.json({
                code: 400,
                msg: "没有数据"
            });
        });

    },
    /**
     * 重置管理人员账号密码
     * pwd
     * uid int 用户id 必传
     * @param req
     * @param res
     */
    resetPwd: function (req, res) {
        var mine = req.session.mine;
        var password = req.param("pwd");
        var uid = req.param("uid");
        if (!req.session.mine) {
            return res.json({
                code: 400,
                msg: "需要登录"
            });
        }
        if (!uid) {
            return res.json({
                code: 400,
                msg: '用户id未传递'
            });
        }
        var storeid = 0;
        if (mine.storeid) {//普通店铺智能看自己的管理用户
            storeid = mine.storeid;
        }
        Adminuser.findOne({id: uid, storeid: storeid}).exec(function (err, adminUser) {
            if (err) return res.negotiate(err);
            if (adminUser) {
                if (storeid) {
                    Accountseller.findOne({id: storeid}).exec(function (err, account) {
                        if (err) return res.negotiate(err);
                        var pwd = "e10adc3949ba59abbe56e057f20f883e";
                        if (account && account.password2) {
                            pwd = account.password2;
                        }
                        doPasswordSet(uid, storeid, pwd);

                    });
                } else {
                    SystemSetting.findOne({key: "defaultPassword"}).exec(function (err, setting) {
                        if (err) return res.negotiate(err);
                        var pwd = "e10adc3949ba59abbe56e057f20f883e";
                        if (setting && setting.value) {
                            pwd = setting.value;
                        }
                        doPasswordSet(uid, storeid, pwd);
                    });

                }
            }else{
                return res.json({
                    msg: "没有该管理员账户",
                    code: 400
                });
            }
        });
        function doPasswordSet(uid, storeid, password) {
            Passwords.encryptPassword({
                password: password,
                difficulty: 10,
            }).exec({
                error: function (err) {
                    console.log("err:  When this error is returned, the encryption operation fails.");
                    return res.negotiate(err);
                },
                success: function (encryptpassword) {
                    Adminuser.update({
                        id: uid,
                        storeid: storeid
                    }, {password: encryptpassword}).exec(function (err, user) {
                        if (err)  return res.negotiate(err);
                        if (user) {
                            return res.json({
                                code: 200,
                                msg: "操作成功"
                            });
                        } else {
                            return res.json({
                                code: 400,
                                msg: "操作成功"
                            });
                        }
                    });
                }
            });

        }
    },
    /**
     * 管理用户列表
     * storeid int 店铺id 非必传，【如果是商户登录则不传】
     * @param req
     * @param res
     */
    adminUserList: function (req, res) {
        var storeid = req.param("storeid", false);
        var mine = req.session.mine;
        if (!req.session.mine) {
            return res.json({
                code: 400,
                msg: "需要登录"
            });
        }
        var username = req.param("username", false);

        var sql = "select a.username,a.mobile,a.groupid,a.id,a.isAdmin,a.createdAt," +
            "b.name,b.hid,c.id as departid,c.name as departname from adminuser a left join departmentgroup b on a.groupid=b.id left join departmentgroup c on c.id=b.parentid where a.storeid=" + mine.storeid+" AND a.id!="+mine.id+" ";
        if(!mine.isAdmin){
            sql+=" AND a.isAdmin=0";
        }
        if (username) {
            username=username.replace(/[^0-9a-zA-Z]/g,"");
            sql += " AND a.username like '" + username + "%'";
        }
        
        Adminuser.query(sql, function (err, users) {
            if (err)return res.negotiate(err);
            if (users && users.length > 0) {
                var result = [];
                users.forEach(function (user) {
                    delete user.password;
                    delete user.isdelete;
                    delete user.hid;
                    delete user.parentid;
                    result.push(user);
                });
                return res.json({
                    msg: "",
                    code: 200,
                    data: result,
                });
            }
            return res.json({
                code: 400,
                msg: "没有数据"
            });
        });

    },
    addPermission: function (req, res) {
        if (!req.session.mine.id) {
            return res.json('addpermission session error');
        }

        var insertdata = {};
        insertdata.parentid = req.param('parentid');
        insertdata.hid = req.param('hid');
        insertdata.name = req.param('name');
        insertdata.description = req.param('description');
        insertdata.controller = req.param('controller');
        insertdata.action = req.param('action');
        insertdata.sortorder = req.param('sortorder');
        //insertdata.operatorid = req.param('operatorid');
        Permission.create(insertdata).exec(function addper(err, per) {

            if (err) {
                return res.negotiate(err);
            }

            console.log("addpermission");
            return res.json({
                per: per,
                code: 200
            });
        });

    },
    /**
     *新增部门
     * @param parentid int 父部门id 必传
     * @param hid int  部门则为0群组为1 必传
     * @param name string 部门或者群组名称 必传
     * @param isdelete int 是否可以删除 非必传
     * @param operatorid string 权限组成的数组
     *
     * @param req
     * @param res
     */
    addDepartment: function (req, res) {


        console.log('addDepartment: This is the function entry. check it out: ', req.allParams());
        
        var mine = req.session.mine;
        var allParams = req.allParams();

        var permission;
        var isdelete = 1;
        var addid = mine.id;
        var hid = allParams.hid;
        var name = allParams.name;
        var storeid = mine.storeid;
        var parentid = allParams.parentid;
        var operatorid = allParams.operatorid;
        var description = allParams.description;

        if (!operatorid) {
            permission = "1:2:3:4:5:6:7";
        }

        var fKey = { name: name, storeid: storeid };
        console.log('mine. check it out. ',mine);
        console.log('fKey. check it out. ',fKey);
        Departmentgroup.findOne(fKey).exec(function (err, record) {
             if (err) return;
             console.log("cb_tag1: The result of this findOne is shown came out. check it out: ",record);
             record = record || {};
             var a = "部门已存在";
             var b = "用户组已存在";
             var tip = hid === 0 ? a : b;

             if (record.hid>=0) {
                return res.json({
                    code: 400,
                    data: [],
                    msg: tip,
                });
             }


             //构造消息
             var MsgObj = {};

             MsgObj.hid = hid;
             MsgObj.name = name;
             MsgObj.addid = addid;
             MsgObj.storeid = storeid;
             MsgObj.parentid = parentid;
             MsgObj.isdelete = isdelete;
             MsgObj.permission = permission;
             MsgObj.description = description;


             console.log('MsgObj. check it out. ',MsgObj);
             Departmentgroup.create(MsgObj).exec(function (err, r) {
                if (err) return;
                console.log("cb_tag2: The result of this create is shown came out. check it out: ",r);
                 return res.json({
                    code: 200,
                    data: [],
                    msg: "添加成功"
                 });
             });

        });

        // var insertdata = {};
        // var mine = req.session.mine;
        // if (!mine) {
        //     return res.json({
        //         code: 400,
        //         msg: "用户没有登录"
        //     });
        // }


        // insertdata.name = req.param('name');
        // insertdata.addid = mine.id;
        // for(var key in insertdata){
        //     if(!insertdata[key]){
        //         return res.json({
        //             code:400,
        //             msg:"参数不全"
        //         });
        //     }
        // }
        // insertdata.hid = req.param('hid',0);
        // insertdata.parentidparentid = req.param('parentid');
        // insertdata.isdelete = req.param('isdelete', 1);
        // insertdata.permission = req.param('operatorid');
        // insertdata.description = req.param('description', 0);
        // insertdata.storeid = mine.storeid || 0;

        // Departmentgroup.findOne({name: insertdata.name, storeid: insertdata.storeid}).exec(function (err, department) {
        //     if (err) return res.negotiate(err);
        //     if (!department) {
        //         if(!insertdata.permission){
        //             insertdata.permission="1:2:3:4:5:6:7";
        //         }
        //         Departmentgroup.create(insertdata).exec(function adddepart(err, per) {

        //             if (err) {
        //                 return res.negotiate(err);
        //             }
        //             return res.json({
        //                 code: 200,
        //                 msg: "添加成功"
        //             });
        //         });
        //     } else {
        //         return res.json({
        //             code: 400,
        //             msg: insertdata.hid==0?"部门已存在":"用户组已存在"
        //         });
        //     }

        // });

    },
    /**
     *显示部门或者用户组
     * @param req
     * @param res
     */
    departmentGroup: function (req, res) {
        var mine = req.session.mine;
        if (!mine) {
            return res.json({
                code: 400,
                msg: "用户未登录"
            });
        }

        Departmentgroup.find({storeid: mine.storeid}).exec(function (err, departments) {
            if (err)return res.negotiate(err);
            if (departments.length > 0) {
                var result = doTreeA(departments);
                result = doTreeB(result, departments);
                return res.json({
                    code: 200,
                    data: result
                });
            }
            return res.json({
                code: 400,
                msg: "没有数据"
            });
        });

        function doTreeA(departments) {
            var result = [];
            for (var i = 0; i < departments.length; i++) {
                if (departments[i].parentid == 0) {
                    result.push(departments[i]);
                }

            }
            return result;
        }

        function doTreeB(result, departments) {
            for (var i = 0; i < result.length; i++) {
                if (!result[i].children) {
                    result[i].children = [];
                }
                departments.forEach(function (depart) {
                    if (result[i].id == depart.parentid) {
                        result[i].children.push(depart);
                    }
                });
                doTreeB(result[i].children, departments)
            }
            return result;
        }


    },
    /**
     * 删除用户
     * @param req
     * @param res
     */
    deleteUser: function (req, res) {
        var id = req.param('id', false);
        var member = req.session.mine;
        var condition = {};
        if (!id) {
            return res.json({
                code: 200,
                msg: '参数缺失'
            });
        }
        if (member) {
            if (member.storeid) {
                condition = {id: id, isdelete: 1, storeid: member.storeid};
            } else {
                condition = {id: id, isdelete: 1};
            }
            
            Adminuser.destroy(condition).exec(function (err, record) {
                if (err)return res.negotiate(err);

                if (record.length > 0) {
                    return res.json({
                        code: 200,
                        msg: '操作成功'
                    });
                } else {
                    return res.json({
                        code: 400,
                        msg: '操作失败'
                    });
                }
            });
        }
    },
    /**
     * gid int 部门或者组的id 必传
     * permissions string 权限列表 23:24:56 必传
     * name　string 组名 非必传
	 * parentgid int 父部门id
     * 更新部门和部门的权限
     */
    updateDepartmentPermission: function (req, res) {
        var gid = req.param("gid");
        var permissions = req.param("permissions");
        var description = req.param("description");
        var name = req.param("name", false);
        var parentgid = req.param("parentgid", false);
        if (!permissions || !gid) {
            return res.json({
                code: 400,
                msg: '参数缺失'
            });
        }
        var storeid = req.session.mine.storeid;
        if (storeid) {
            var condition = {id: gid, storeid: storeid}
        } else {
            var condition = {id: gid}
        }
        var userid = req.session.mine.id;
        var mine = req.session.mine;
        var _this=this;
        Departmentgroup.findOne({name: name, id: {"!": gid}, storeid: mine.storeid}).exec(function (err, dg) {
            if (err) return res.negotiate(err);
            if (dg) {
                return res.json({
                    code: 400,
                    msg: "该名称以存在"
                });
            }
            Departmentgroup.findOne(condition).exec(function (err, record) {
                if (err)return res.negotiate(err);
                if (record) {
                    if (!storeid) {
                        var where = {id: gid};
                    } else {
                        var where = {id: gid, storeid: record.storeid};
                    }

                    if (name) {
                        var set = {name: name, permission: permissions, updateid: userid};
                    } else {
                        var set = {permission: permissions, updateid: userid};
                    }
                    set.description = description;
					if(parentgid){
						  set.parentid = parentgid;
					}
                    Departmentgroup.findOne({id: parseInt(record.parentid)}).exec(function (err, oldDg) {
                        if (err)return res.negotiate(err);
                        if (!oldDg) {
                            doChangePermission(where, set);
                        } else {

                            var parentPermissions = oldDg.permission;
                            if (parentPermissions != "*") {
                                var prentPermissionArray = parentPermissions.split(":");

                                var childPerissionArray = permissions.split(":");
                                var permiss = [];
                                
                                
                                for (var j = 0; j < childPerissionArray.length; j++) {
                                    if (prentPermissionArray.indexOf(childPerissionArray[j]) != -1) {
                                        permiss.push(childPerissionArray[j]);
                                    }
                                    ;
                                }
                                var permissionStr = permiss.join(":");
                            } else {
                                var permissionStr = permissions;
                            }
                            set.permission = permissionStr;
                            doChangePermission(where, set);
                        }
                    });
                } else {
                    return res.json({
                        code: 400,
                        msg: "你不能访问该组或部门",
                    });
                }
            });
        });
        function doChangePermission(where, set) {
            Departmentgroup.update(where, set).exec(function (err, records) {
                if (err)return res.negotiate(err);
                var department = records[0];
                if (records.length > 0) {
                    if (set.permission != "*") {
                      _this.doChildUpdatePermission(department);
                    }

                    return res.json({
                        code: 200,
                        msg: '保存成功'
                    });
                } else {
                    return res.json({
                        code: 400,
                        msg: '保存失败'
                    });
                }
            });
        }



    },
    doChildUpdatePermission:function(department,notIds,parentPermission) {
        var _this=this;
        var condition={parentid: department.id,storeid:department.storeid};
        if(notIds){
            condition.id={"!":notIds};
        }
        Departmentgroup.find(condition).exec(function (err, depart) {
            if (err)return res.negotiate(err);
            if (depart.length > 0) {
                async.mapSeries(depart, function (item, cb) {

                    var parentPermissions = department.permission;
                    var childPermissions = item.permission;
                    var permissionStr="";
                    if(parentPermissions=="*"){
                        permissionStr=childPermissions;
                    }else{
                        var prentPermissionArray = parentPermissions.split(":");

                        if(childPermissions!="*"){
                            var childPerissionArray = childPermissions.valueOf().split(":");
                            var permiss = [];

                            for (var j = 0; j < childPerissionArray.length; j++) {
                                if (prentPermissionArray.indexOf(childPerissionArray[j]) != -1) {
                                    permiss.push(childPerissionArray[j]);
                                }
                                ;
                            }
                             permissionStr = permiss.join(":");

                        }else{
                            if(parentPermission){
                                permissionStr=parentPermission;
                            }else{
                                permissionStr=childPermissions;
                            }

                        }

                    }

                    // console.log("============================================");
                    // //console.log({id: item.id}, {menus: permissionStr});
                    // console.log("============================================");
                    Departmentgroup.update({id: item.id}, {permission: permissionStr}).exec(function (err, record) {
                        if (err)return res.negotiate(err);
                        if (record.length) {
                            var childDg = record[0];
                            cb(null, childDg);
                        }
                    });
                }, function (err, result) {
                    if (err)return res.negotiate(err);
                    if (result && result.length > 0) {
                        result.forEach(function (item) {
                            _this.doChildUpdatePermission(item,null,item.permission);
                        });
                    } else {
                        return res.json({
                            code: 400,
                            msg: "保存成功"
                        });
                    }
                    // callback(err,result);
                    //
                    // 
                });
            }

        });
    },
    /**
     * 权限列表
     * @param num int 每次获取数量 非必须,分页时使用
     * @param offset int 页码
     */

    permissionList: function (req, res) {
        var _this = this;
        var mine = req.session.mine;
        if (!mine) {
            return res.json({
                code: 415,
                msg: "用户未登录"
            });
        }
        var condition = {};
        if (mine.storeid) {
            condition = {is_store: [1,3]};
        }else{
            condition = {is_store: [0,1,4]};
        }
        // 
        // if (mine.storeid == 0 || !mine.isAdmin) {
        //     return res.json({
        //         code: 413,
        //         msg: "你没有权限"
        //     });
        // }
        var query = Permission.find(condition);

        query.exec(function (err, permissions) {
            if (err) return res.negotiate(err);
            if (permissions.length > 0) {
                var results = [];
                permissions.forEach(function (item) {
                    if (item.parentid == 0) {
                        results.push(item);
                    }
                });
                var nResults = b(results, permissions);
                // var results = doPermission(permissions,results);
                return res.json({
                    code: 200,
                    data: nResults
                });
            } else {
                return res.json({
                    code: 400,
                    msg: "没有数据"
                });
            }
        });
        function a(permissions, pid) {
            var per = [];
            for (var j = 0; j < permissions.length; j++) {
                if (permissions[j].parentid == pid) {
                    per.push(permissions[j]);
                }
            }
            return per;
        }

        function b(results, permissions) {
            var per = [];

            for (var i = 0; i < results.length; i++) {
                per = a(permissions, results[i].id);
                b(per, permissions);
                results[i].children = per;
            }

            return results;
        }
    },
    /**
     *获取下面用户 默认权限
     *@param type int 获取权限类型，1是字符串，2是数组
     * @param req
     * @param res
     */
    defaultPermissionList: function (req, res) {

        console.log('defaultPermissionList: This is the function entry. check it out: ', req.allParams());


        var _this = this;
        var mine = req.session.mine;
        var type = req.param("type", 0);
        if (!mine) {
            return res.json({
                code: 400,
                msg: "用户未登录"
            });
        }

        Departmentgroup.findOne({storeid: mine.storeid, id: mine.groupid}).exec(function (err, department) {
            if (err) return res.negotiate(err);
            if (!department) {
                return res.json({
                    code: 400,
                    msg: "没有数据"
                });
            }
            var menus = department.menus;
            console.log('menus. ',menus);
            var mIdStr = "";
            if (menus) {
                if (menus == "*") {
                    mIdStr = "*";
                } else {
                    var mIds = menus.split(":");
                    mIdStr = mIds.join(",");
                }
                if (1 == type) {
                    return res.json({
                        code: 200,
                        data: mIdStr
                    });
                } else {
                    _this.fetchPermission(res, mIdStr, mine.storeid);
                }

            } else {
                return res.json({
                    code: 400,
                    msg: "没有数据"
                });
            }
        });
    },
    /**
     *获取用户组的权限列表
     * @param req
     * @param res
     */
    groupPermissionList: function (req, res) {
        var _this = this;
        var mine = req.session.mine;
        if (!mine) {
            return res.json({
                code: 400,
                msg: "用户未登录"
            });
        }
        
        var type=req.param("type",1);
        var gid = req.param("gid", mine.groupid);
        var storeid = req.param("storeid", mine.storeid);

        Departmentgroup.findOne({storeid: storeid, id: gid}).exec(function (err, department) {
            if (err) return res.negotiate(err);
            
            if (!department) {
                return res.json({
                    code: 400,
                    msg: "没有数据"
                });
            }
            var menus = department.permission;
            var mIdStr = "";
            if (menus) {
                if (menus == "*") {
                    mIdStr = "*";
                } else {
                    var mIds = menus.split(":");
                    mIdStr = mIds.join(",");
                }
                if(type==1){
                    return res.json({
                        code: 200,
                        data:mIdStr
                    });
                }else{
                    
                   _this.fetchPermission(res, mIdStr, storeid);
                }

            }else{
                return res.json({
                    code: 400,
                    msg:"暂未分配权限"
                });
            }



        });
    },
    /**
     * 获取权限
     * @param res
     * @param str
     */
    fetchPermission: function (res, str, storeid) {
        var condition = {};
        if (str != "*") {
            condition = {id: str.split(",")};
        }
        if (storeid) {
            condition.is_store = [1,3];
        }else{
            condition.is_store = [0,1,4];
        }
        var _this=this;
        
        Permission.find(condition).exec(function (err, permissions) {
            if (err) return res.negotiate(permissions);
            if (permissions.length > 0) {
                var results = [];
                permissions.forEach(function (item) {
                    if (item.parentid == 0) {
                        results.push(item);
                    }
                });
                var nResults = _this.revertPermission(permissions,results);
                return res.json({
                    code: 200,
                    msg: "",
                    data: nResults,
                });
            }
            return res.json({
                code: 400,
                msg: "没有数据"
            });
        });

    },
    revertPermission:function (permissions,results) {
        function a(permissions, pid) {
            var per = [];
            for (var j = 0; j < permissions.length; j++) {
                if (permissions[j].parentid == pid) {
                    per.push(permissions[j]);
                }
            }
            return per;
        }

        function b(results, permissions) {
            var per = [];

            for (var i = 0; i < results.length; i++) {
                per = a(permissions, results[i].id);
                b(per, permissions);
                results[i].children = per;
            }

            return results;
        }
        return b(results, permissions);
    },

    /**
     * 设置用户的默认权限
     * @param permission string 为部门和用户组设置权限列表
     * @param req
     * @param res
     */
    setDefaultPermission: function (req, res) {
        var mine = req.session.mine;
        var _this=this;
        if (!mine) {
            return res.json({
                code: 400,
                msg: "用户未登录"
            });
        }
        var permission = req.param("permission");
        if (!permission) {
            return res.json({
                code: 400,
                msg: "参数缺失"
            });
        }
        Departmentgroup.update({
            storeid: mine.storeid,
            id: mine.groupid
        }, {menus: permission}).exec(function (err, dep) {
            if (err) return res.negotiate(err);

            if (dep&&dep.length > 0) {
                var notIds=mine.groupid;
                _this.doChildUpdatePermission({id:0,permission:permission,storeid:mine.storeid},notIds);
                // console.log("+++++++++++++++++++++++++++");
                
                // console.log("+++++++++++++++++++++++++++");


                return res.json({
                    code: 200,
                    msg: "操作成功"
                });
            } else {
                return res.json({
                    code: 400,
                    msg: "操作失败"
                });
            }
        });

    },
    /**
     * 某个组或者部门的菜单列表
     * @param req
     * @param res
     */
    menuList: function (req, res) {
        var mine = req.session.mine;
        if (!mine) {
            return res.json({
                code: 400,
                msg: "用户未登录"
            });
        }
        var gid = req.param("gid", false);
        if (gid == false) {
            gid = mine.groupid;
        }
        var _this = this;
        var storeid = mine.storeid;
        Departmentgroup.findOne({storeid: storeid, id: gid}).exec(function (err, department) {
            if (err) return res.negotiate(err);
            if (!department) {
                return res.json({
                    code: 400,
                    msg: "没有数据"
                });
            }
            var menus = department.permission;
            if (menus) {
                if (menus == "*") {
                    mIdStr = "*";
                } else {
                    var mIds = menus.split(":");
                    var mIdStr = mIds.join(",");
                }
                _this.fetchMenuByIds(res, mIdStr, storeid);
            } else {
                return res.json({
                    code: 400,
                    msg: "没有数据"
                });
            }

        });

    },
    fetchMenuByIds: function (res, mIdStr, storeid) {
        if (mIdStr == "*") {
            var sql = "select DISTINCT b.* from permission a LEFT JOIN menus b on a.controller=b.controller AND a.action=b.action where a.id!=0  ";
        } else {
            var sql = "select DISTINCT b.* from permission a LEFT JOIN menus b on a.controller=b.controller AND a.action=b.action where a.id  in (" + mIdStr + ")";
        }

        if (storeid == 0) {
            sql += " AND b.is_store IN (0,1,4)";
        } else {
            sql += " AND b.is_store IN (1,3)";
        }
        sql += " order by sort ASC";
        
        Menus.query(sql, function (err, menu) {
            if (err) return res.negotiate(err);
            if (menu.length > 0) {
                var results = [];
                menu.forEach(function (item) {
                    if (item.pid == 0) {
                        results.push(item);
                    }
                });
                results = b(results, menu);
                return res.json({
                    code: 200,
                    data: results
                });
            } else {
                return res.json({
                    code: 400,
                    msg: "暂无数据"
                });
            }
        });
        function a(menus, pid) {

            var per = [];
            for (var j = 0; j < menus.length; j++) {
                if (menus[j].pid == pid) {
                    per.push(menus[j]);
                }
            }
            return per;
        }

        function b(results, menus) {
            var per = [];

            for (var i = 0; i < results.length; i++) {
                per = a(menus, results[i].m_id);
                b(per, menus);
                results[i].children = per;
            }

            return results;
        }
    },
    updateDepartmentMenu: function (req, res) {
        var gid = req.param("gid");
        var menus = req.param("menus");
        var name = req.param("name", false);
        if (!menus || !gid) {
            return res.json({
                code: 400,
                msg: '参数缺失'
            });
        }
        var storeid = req.session.mine.storeid;
        var condition = {id: gid, storeid: storeid}
        var userid = req.session.mine.id;
        Departmentgroup.findOne({name: name, id: {"!": gid}}).exec(function (err, dg) {
            if (err) return res.negotiate(err);
            if (dg) {
                return res.json({
                    code: 400,
                    msg: "该名称已存在"
                });
            }
            Departmentgroup.findOne(condition).exec(function (err, record) {
                if (err)return res.negotiate(err);
                if (record) {
                    if (!storeid) {
                        var where = {id: gid};
                    } else {
                        var where = {id: gid, storeid: record.storeid};
                    }

                    if (name) {
                        var set = {name: name, menus: menus, updateid: userid};
                    } else {
                        var set = {menus: menus, updateid: userid};
                    }

                    Departmentgroup.findOne({id: parseInt(record.parentid)}).exec(function (err, oldDg) {
                        if (err)return res.negotiate(err);
                        if (!oldDg) {
                            doChangePermission(where, set);
                        } else {
                            var parentPermissions = oldDg.menus;
                            var prentPermissionArray = parentPermissions.split(":");

                            var childPerissionArray = menus.split(":");
                            var permiss = [];

                            for (j = 0; j < childPerissionArray.length; j++) {
                                if (prentPermissionArray.indexOf(childPerissionArray[j]) != -1) {
                                    permiss.push(childPerissionArray[j]);
                                }
                                ;
                            }
                            var permissionStr = permiss.join(":");
                            set.permission = permissionStr;
                            doChangePermission(where, set);
                        }
                    });
                }
            });
        });
        function doChangePermission(where, set) {
            Departmentgroup.update(where, set).exec(function (err, records) {
                if (err)return res.negotiate(err);
                var department = records[0];
                if (records.length > 0) {
                    doChildUpdatePermission(department);
                    return res.json({
                        code: 200,
                        msg: '保存成功'
                    });
                } else {
                    return res.json({
                        code: 400,
                        msg: '保存失败'
                    });
                }
            });
        }

        function doChildUpdatePermission(department) {
            Departmentgroup.find({parentid: department.id}).exec(function (err, depart) {
                if (err)return res.negotiate(err);
                if (depart.length > 0) {
                    async.mapSeries(depart, function (item, cb) {
                        var parentPermissions = department.menus;
                        var prentPermissionArray = parentPermissions.split(":");
                        var childPermissions = item.menus;
                        var childPerissionArray = childPermissions.valueOf().split(":");
                        var permiss = [];

                        for (j = 0; j < childPerissionArray.length; j++) {
                            if (prentPermissionArray.indexOf(childPerissionArray[j]) != -1) {
                                permiss.push(childPerissionArray[j]);
                            }
                            ;
                        }
                        var permissionStr = permiss.join(":");

                        Departmentgroup.update({id: item.id}, {menus: permissionStr}).exec(function (err, record) {
                            if (err)return res.negotiate(err);
                            if (record.length) {
                                var childDg = record[0];
                                cb(null, childDg);
                            }
                        });
                    }, function (err, result) {
                        if (err)return res.negotiate(err);
                        if (result && result.length > 0) {
                            result.forEach(function (item) {
                                doChildUpdatePermission(item);
                            });
                        } else {
                            return res.json({
                                code: 400,
                                msg: "保存成功"
                            });
                        }
                        // callback(err,result);
                        //
                        // 
                    });
                }

            });
        }
    },

    /**
     * 删除部门组
     *group int 部门或者用户组id
     */
    deleteDepartmentGroup: function (req, res) {

        console.log('deleteDepartmentGroup: This is the function entry. check it out: ', req.allParams());
        
        var mine = req.session.mine;
        var allParams = req.allParams();

        var isdelete = 1;
        var storeid = mine.storeid;
        var group = allParams.group;

        Departmentgroup.findOne({id:group,storeid:storeid},function (err,recond) {
            if (err) return;

            console.log('cb_tag1: The result of this query is shown came out. check it out: ok');

            recond = recond || {};
            recond.hid = parseInt(recond.hid) || 0;


            var a,b,where;

            a = a || {};
            a.id = group;
            a.isdelete = 1;
            a.storeid = storeid;

            b = b || {};
            b.isdelete = 1;
            b.parentid = group;
            b.storeid = storeid;

            where = {};
            where.or = [];
            where.or.push(a);
            where.or.push(b);
            
            if (recond.hid === 0) {
                Departmentgroup.countByParentid(group).exec(function(err,count){

                    if (count === 0) {

                        deleteGroup(where);
                    }else{
                        var tips ="";
                        tips += "删除失败,下面还有";
                        tips += count;

                        tips += "个用户,请先修改或删除部";
                        tips += "门下面所属用户组后再删除";
                        return res.json({
                            code:400,
                            msg:tips,
                        });
                    }
                });
            }else{
                Adminuser.countByGroupid(group).exec(function (err,count) {

                    if (count<=0) {
                        deleteGroup(where);
                    }else{
                        var tips ="";
                        tips += "删除失败,下面还有";
                        tips += count;

                        tips += "个用户,请先修改用户所属";
                        tips += "组或者删除用户之后再删除";
                        return res.json({
                            code:400,
                            msg:tips,
                        });
                    }
                });
            }
        });


        function deleteGroup(where){
            console.log('where. ',where);
            Departmentgroup.destroy(where).exec(function (err, list) {
                if (err) return;
                console.log('cb_tag2: The result of this query is shown came out. check it out: ',list.length);
                if (list.length < 1) {
                    return res.json({
                        code: 400,
                        msg: "操作失败"
                    });
                }
                return res.json({
                    code: 200,
                    msg: "操作成功"
                });
            });
        }

        // var mine = req.session.mine;
        // if (!mine) {
        //     return res.json({
        //         code: 400,
        //         msg: "用户没有登录"
        //     });
        // }
        // var group = req.param("group", false);
        // if (!group) {
        //     return res.json({
        //         code: 400,
        //         msg: "用户组id未传递"
        //     });
        // }
        // var condition = {id: group, storeid: mine.storeid};
        // Departmentgroup.findOne(condition).exec(function (err, dgroup) {
        //     if (err) return res.negotiate(err);
        //     if (!dgroup) {
        //         return res.json({
        //             code: 400,
        //             msg: "没有该部门组"
        //         });
        //     }
        //     condition.isdelete = 1;
        //     var where = {or: [condition, {parentid: group, storeid: mine.storeid, isdelete: 1}]};
        //     if(dgroup.hid==0){

        //         Departmentgroup.countByParentid(group).exec(function(err,count){
        //             if(count<=0){
        //                 deleteGroup(where);
        //             }else{
        //                 return res.json({
        //                     code:400,
        //                     msg:"删除失败,下面还有"+count+"个用户,请先修改或删除部门下面所属用户组后再删除"
        //                 });
        //             }
        //         });
        //     }else{
        //         Adminuser.countByGroupid(group).exec(function (err,count) {
        //             if(count<=0){
        //                 deleteGroup(where);
        //             }else{
        //                 return res.json({
        //                     code:400,
        //                     msg:"删除失败,下面还有"+count+"个用户,请先修改用户所属组或者删除用户之后再删除"
        //                 });
        //             }
        //         });
        //     }
        // });
        // function deleteGroup(where){
        //     Departmentgroup.destroy(where).exec(function (err, dgroup) {
        //         if (err) return res.negotiate(err);

        //         if (dgroup.length < 1) {
        //             return res.json({
        //                 code: 400,
        //                 msg: "操作失败"
        //             });

        //         }
        //         return res.json({
        //             code: 200,
        //             msg: "操作成功"
        //         });

        //     });
        // }
    },

    /**
     * 获取大商户有的权限
     * @param req
     * @param res
     */
    getMerchantPermission:function (req,res) {
        var mine=req.session.mine;
        var _this=this;
        if(!mine){
           return res.json({
               code:400,
               msg:"需要登录"
           });
        }
        var sql="select * from  permission where id in(select parentid from permission where is_store=2) union select * from permission where is_store=2;";
        Permission.query(sql,function (err,permissions) {
            if(err) return res.negotiate(err);
            if(permissions.length){
                var results = [];
                permissions.forEach(function (item) {
                    if (item.parentid == 0) {
                        results.push(item);
                    }
                });
                var nResults = _this.revertPermission(permissions,results);
                return res.json({code:200,data:nResults});
            }else{
                return res.json({code:400,msg:"没有数据"});
            }
        });
    },
    /**
     * @param gid 组或者是大客户
     * @param req
     * @param res
     */
    updateMerchantPermission:function (req,res) {
        var storeid=req.param("storeid",0);
        var perm=req.param("permission");
        var mine=req.session.mine;
        var _this=this;
        if(!mine){
            return res.json({
                code:400,
                msg:"需要登录"
            });
        }
        if(!storeid||!perm){
            return res.json({
                code:400,
                msg:"参数缺失"
            });
        }
        storeid=parseInt(storeid);
       var sql= "select a.permission,a.id from  departmentgroup a inner join  accountseller b on a.storeid=b.id where b.id="+parseInt(storeid);
        Departmentgroup.query(sql,function (err,group) {
            if(err) return res.negotiate(err);
            if(group&&group.length>0){
                var permission=group[0].permission;
                if(permission!="*"){
                    permission=permission+":"+perm;
                    
                    //console.log({id:group[0].id,storeid:storeid});
                    Departmentgroup.update({id:group[0].id,storeid:storeid}).set({permission:permission}).exec(function (err,depart) {
                        if(err) return res.negotiate(err);
                        if(depart.length>0){
                            return res.json({
                                code:200,
                                msg:"保存成功"
                            });
                        }else{
                            return res.json({
                                code:400,
                                msg:"操作失败"
                            });
                        }
                    });

                }else{
                    return res.json({
                        code:200,
                        msg:"保存成功"
                    });
                }


            }else{
                return res.json({
                    code:400,
                    msg:"操作失败，没有该组"
                });
            }
        });

    }

};

