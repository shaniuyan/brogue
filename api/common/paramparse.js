/**
 * 获取查询对象 by王凯
 */
'use strict';
var _ = require('lodash');
var moment = require("moment");
var crypto = require('crypto');


/**
 * 向前补零
 * @param num
 * @param n
 * @returns {*}
 */
var pad = exports.pad = function (num, n) {
    return Array(n > ('' + num).length ? (n - ('' + num).length + 1) : 0).join(0) + num;
}

/**
 * 获取下一个编号
 * @param prefix
 * @param lastWholesaleNum
 * @returns {*}
 */
exports.nextBatchNumber = function(lastWholesaleNum){
    if(!lastWholesaleNum){
        return null;
    }
    var NSnum = lastWholesaleNum.substr(10,5);
    var nextNum = parseInt(NSnum)+1;
    var strformat = lastWholesaleNum.substr(0,10);
    var curNum = pad(nextNum,5);
    return strformat + curNum;
};


exports.parseInsertSqlObj = function(obj,tableName){
    var sqlStr = "insert into "+tableName+"({insertcol}) values ({insertval})";
    var keys = _.keys(obj);
    var values = _.values(obj);

    var cols = [],vals= [],insertInfos = [];;
    _.each(keys,function(key){
        cols.push("??");
        insertInfos.push(key);
    });
    _.each(values,function(value){
        vals.push("?");
        insertInfos.push(value);
    });
    sqlStr = sqlStr.replace("{insertcol}",cols.join(",")).replace("{insertval}",vals.join(","));
    return {
        sqlStr:sqlStr,
        insertInfos:insertInfos
    };
};