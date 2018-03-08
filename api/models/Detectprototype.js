module.exports = {
  attributes: {
    DATA_ID  :{type:'integer',size:'11',autoIncrement: true},//检测部位
    PART_TYPE  :{type:'integer',size:'11'},//检测部位
    DETECT_TYPE:{type:'integer',size:'11'},//检测类型--水分
    NURSER_TYPE:{type:'integer',size:'11'},//检测结果是使用建议产品前还是后
    DETECT_VALUE:{type: 'float',size:'10,2'},//检测结果
    USER_ID:{type:'integer',size:'11'}  //被检测者
  },
  autoPK: false,
  autoCreatedAt:true      //检测时间
};

/*

CREATE TABLE IF NOT EXISTS 'DETECT_MODEL' (
               
                'PART_TYPE' INTEGER ,          //检测部位
                'DETECT_TYPE' INTEGER ,        //检测类型--水分
                'NURSER_TYPE' INTEGER ,        //检测结果是使用建议产品前还是后
                'DETECT_VALUE' DOUBLE ,        //检测结果
                'USER_ID' TEXT NOT NULL ,      //被检测者
                'INSERT_TIME' INTEGER)         //检测时间
*/