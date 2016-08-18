/**
 * Created by wk on 2016/8/16.
 */
var moment = require("moment");
var paramparse = require("../../common/paramparse");

exports.purchasingManagementListAsync = function (opts) {
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
    return mysqlPool.queryAsync("select * from purchasing_management limit ?,?", [beginRowIndex, pageSize]).then(function (result) {
        results.error_code = 0;
        results.error_msg = "获取售货单列表成功！";
        results.data = result;
        return results;
    });
};

exports.addPurchasingManagementAsync = function (opts) {
    var results = {error_code: -1, error_msg: "error"};
    var bbPromise = opts.mysqldbs.bbpromise;
    var mysqlPool = opts.mysqldbs.mysqlPool;
    var insertObj = {
        phcode: opts.purchasingManagement.phcode,
        totalprice: opts.purchasingManagement.totalprice,
        alreadypaidmoney: opts.purchasingManagement.alreadypaidmoney,
        purchaseperson: opts.purchasingManagement.purchaseperson,
        purchasephone: opts.purchasingManagement.purchasephone,
        paystatus: opts.purchasingManagement.paystatus,
        createTime: opts.purchasingManagement.createTime//,
        //clearTime: opts.purchasingManagement.clearTime
    };
    return getNextPurchasingManagementAsync(opts).then(function (result) {
        var tableName = "purchasing_management";
        insertObj.phcode = result.data;
        var sqlObj = paramparse.parseInsertSqlObj(insertObj, tableName);
        return mysqlPool.queryAsync(sqlObj.sqlStr, sqlObj.insertInfos).then(function (result) {
            if (result.affectedRows == 1) {
                opts.purchasingManagement.pmId = result.insertId;
            }
            results.error_code = 0;
            results.error_msg = "添加售货单成功";
            results.data = opts.wholesale;
            return results;
        }).catch(function (e) {
            results.error_code = 1001;
            results.error_msg = "添加售货单失败，请联系技术人员";
            return results;
        });
    });
};


var getNextPurchasingManagementAsync = exports.getNextPurchasingManagementAsync = function (opts) {
    //select max(wholesalenum) phcode from brogue_db.wholesales;
    var results = {error_code: -1, error_msg: "error"};
    var bbPromise = opts.mysqldbs.bbpromise;
    var mysqlPool = opts.mysqldbs.mysqlPool;
    return mysqlPool.queryAsync("select max(phcode) phcode from brogue_db.purchasing_management").then(function (result) {
        results.error_code = 0;
        results.error_msg = "获取服务器最新采购编号成功!";
        if (!result[0].phcode) {
            result[0].phcode = 'PS' + new moment().format("YYYYMMDD") + "00001"
        } else {
            result[0].phcode = paramparse.nextBatchNumber(result[0].phcode);
        }
        results.data = result[0].phcode;
        return results;
    }).catch(function (e) {
        results.error_code = 1001;
        results.error_msg = "获取最新批发编号失败，请联系平台管理员!";
        return results;
    });
};