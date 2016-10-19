/**
 * Created by wk on 2016/10/17.
 */

var paramparse = require("../../common/paramparse");
var moment = require("moment");
/**
 *
 * @param opts
 */
exports.addOrOpenShopAsync = function(opts){
    var results = {error_code: -1, error_msg: "error"};
    var bbPromise = opts.mysqldbs.bbpromise;
    var mysqlPool = opts.mysqldbs.mysqlPool;
    var tableName = "shops";
    return getNextShopSCAsync(opts).then(function(result){
        var insertObj = opts.shop;
        insertObj.shopSC = result.data;
        var sqlObj = paramparse.parseInsertSqlObj(insertObj, tableName);
        return mysqlPool.queryAsync(sqlObj.sqlStr, sqlObj.insertInfos).then(function (result) {
            results.error_code = 0;
            results.error_msg = "添加成功";
            results.data = insertObj;
            return results;
        });
    });
};



var getNextShopSCAsync = function (opts) {
    var results = {error_code: -1, error_msg: "error"};
    var bbPromise = opts.mysqldbs.bbpromise;
    var mysqlPool = opts.mysqldbs.mysqlPool;
    return mysqlPool.queryAsync("select max(shopSC) shopSC from brogue_db.shops").then(function (result) {
        results.error_code = 0;
        results.error_msg = "获取服务器最新商铺编号成功!";
        if (!result[0].shopSC) {
            result[0].shopSC = 'SC100001';
        } else {
            result[0].shopSC = paramparse.nextNumber('SC1',result[0].shopSC);
        }
        results.data = result[0].shopSC;
        return results;
    }).catch(function (e) {
        results.error_code = 1001;
        results.error_msg = "获取服务器最新商铺编号失败，请联系平台管理员!";
        return results;
    });
};