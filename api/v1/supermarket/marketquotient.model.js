/**
 * Created by wk on 2016/7/18.
 */
var moment = require("moment");
var paramparse = require("../../common/paramparse")

exports.addMarketQuotientAsync = function (opts) {
    var results = {error_code: -1, error_msg: "error"};
    var bbPromise = opts.mysqldbs.bbpromise;
    var mysqlPool = opts.mysqldbs.mysqlPool;
    var insertObj = {
        "companyCode": opts.marketQuotient.companyCode,
        "companyName": opts.marketQuotient.companyName,
        "linkMan": opts.marketQuotient.linkMan,
        "tel": opts.marketQuotient.tel,
        "phone": opts.marketQuotient.phone,
        "currentaccount": opts.marketQuotient.currentaccount,
        "buildtime": opts.marketQuotient.buildtime,
        "isimportant": opts.marketQuotient.isimportant
    }

    return getNexMarketCompanyNumAsync(opts).then(function (result) {
        var tableName = "marketQuotient";
        insertObj.companyCode = result.data;
        var sqlObj = paramparse.parseInsertSqlObj(insertObj, tableName);
        return mysqlPool.queryAsync(sqlObj.sqlStr, sqlObj.insertInfos)
            .then(function (result) {
                results.error_code = 0;
                results.error_msg = "添加销路服务商成功";
                return results;
            }).catch(function (e) {
                results.error_msg = e.message;
                return results;
            });
    });
};


exports.marketQuotientAsync = function (opts) {
    var results = {error_code: -1, error_msg: "error"};
    var bbPromise = opts.mysqldbs.bbpromise;
    var mysqlPool = opts.mysqldbs.mysqlPool;
    var pageIndex = 0, beginRowIndex = 0, endRowIndex = 0, pageSize = opts.configs.sysconfig.customer.pageSize;
    if (!isNaN(opts.page.pageIndex)) {
        pageIndex = opts.page.pageIndex;
    }
    if (!isNaN(opts.page.pageSize)) {
        pageSize = parseInt(opts.page.pageSize);
    }
    beginRowIndex = (pageIndex - 1) * pageSize;
    return mysqlPool.queryAsync("select * from marketQuotient limit ?,?", [beginRowIndex, pageSize]).then(function (result) {
        results.error_code = 0;
        results.error_msg = "销路服务信息列表！";
        results.data = result;
        return results;
    });
};


var getNexMarketCompanyNumAsync = exports.getNexMarketCompanyNumAsync = function (opts) {
    var results = {error_code: -1, error_msg: "error"};
    var bbPromise = opts.mysqldbs.bbpromise;
    var mysqlPool = opts.mysqldbs.mysqlPool;
    return mysqlPool.queryAsync("select max(companyCode) companyCode from brogue_db.marketquotient").then(function (result) {
        results.error_code = 0;
        results.error_msg = "获取服务器最新销路服务商编号成功!";
        if (!result[0].companyCode) {
            result[0].companyCode = 'MQ' + new moment().format("YYYYMMDD") + "00001"
        } else {
            result[0].companyCode = paramparse.nextBatchNumber(result[0].companyCode);
        }
        results.data = result[0].companyCode;
        return results;
    }).catch(function (e) {
        results.error_code = 1001;
        results.error_msg = "获取服务器最新销路服务商编号失败，请联系平台管理员!";
        return results;
    });
};