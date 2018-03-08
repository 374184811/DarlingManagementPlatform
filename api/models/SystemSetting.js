/**
 * Created by Administrator on 2016/9/1.
 */
module.exports = {
    tableName: 'settings_system',
    attributes: {
        id: {
            type: "Integer",
            primaryKey: true,
            unique: true
        },
        name: {
            type: "String",  //显示名称
        },
        key: {
            type: "String", //设置的键
        },
        value: {
            type: "String",//设置的值
        },
        //类型 0是int 1是字符串
        type: {
            type: "Integer",
            defaultsTo: "0"
        },
        //0是系统设置 1,是后台添加自定义设置
        is_system: {
            type: "Integer",
            defaultsTo: "0"
        }
    },
    autoCreatedAt: false,
    autoUpdatedAt: false,
}