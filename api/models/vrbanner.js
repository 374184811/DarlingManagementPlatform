module.exports = {
    attributes: {
        //banner呈现在客户端的顺序的值
        order:{type:'integer',size:'11'},
        //baner编号
        bannernum:{type:'integer',size:'11'},
        //banner名称 标题
        title:{type:'string',size:'50'},
        //描述数据
        description: {type:'text',defaultsTo:''},
        //banner图片自身的地址
        bannerpic:{type:'string',defaultsTo:''},
        //banner链接的地址
        bannerurl:{type:'string',size:'150'},
        //0无效果,1外部链接,2内部链接,3商品专场,4自定义
        linktype:{type:'integer',size:'2'},
        //是否被删除，1-开启，0-关闭
        status:{type:'integer',size:'1'},
    },
    autoPK: true,
    autoCreatedAt:true,
    autoUpdatedAt:true
};
