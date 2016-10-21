/**
 * Created by wk on 2016/10/21.
 */

var moment = require("moment");

exports.addModuleAsync = function(opts){
    var results = {error_code: -1, error_msg: "error"};
    var bbPromise = opts.mysqldbs.bbpromise;
    var mysqlPool = opts.mysqldbs.mysqlPool;
    var tableName = "modules";
    return getNextModuleMCAsync(opts).then(function(result){
        var insertObj = opts.shop;
        insertObj.moduleMC = result.data;
        var sqlObj = paramparse.parseInsertSqlObj(insertObj, tableName);
        return mysqlPool.queryAsync(sqlObj.sqlStr, sqlObj.insertInfos).then(function (result) {
            results.error_code = 0;
            results.error_msg = "添加成功";
            results.data = insertObj;
            return results;
        });
    });
};


var getNextModuleMCAsync = function (opts) {
    var results = {error_code: -1, error_msg: "error"};
    var bbPromise = opts.mysqldbs.bbpromise;
    var mysqlPool = opts.mysqldbs.mysqlPool;
    return mysqlPool.queryAsync("select max(moduleMC) moduleMC from brogue_db.modules").then(function (result) {
        results.error_code = 0;
        results.error_msg = "获取服务器最新模块编号成功!";
        if (!result[0].moduleMC) {
            result[0].moduleMC = 'MC100001';
        } else {
            result[0].moduleMC = paramparse.nextNumber('MC1',result[0].moduleMC);
        }
        results.data = result[0].moduleMC;
        return results;
    }).catch(function (e) {
        results.error_code = 1001;
        results.error_msg = "获取服务器最新模块编号失败，请联系平台管理员!";
        return results;
    });
};