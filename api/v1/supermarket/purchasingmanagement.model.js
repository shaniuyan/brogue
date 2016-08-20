/**
 * Created by wk on 2016/8/16.
 */
var moment = require("moment");
var paramparse = require("../../common/paramparse");

exports.purchasingManagementListAsync = function (opts) {
    var results = {error_code: -1, error_msg: "error"};
    var bbPromise = opts.mysqldbs.bbpromise;
    var mysqlPool = opts.mysqldbs.mysqlPool;
    var join = bbPromise.join;
    var pageIndex = 0, beginRowIndex = 0, endRowIndex = 0, pageSize = opts.configs.sysconfig.customer.pageSize;
    if (!isNaN(opts.page.pageIndex)) {
        pageIndex = opts.page.pageIndex;
    }
    if (!isNaN(opts.page.pageSize)) {
        pageSize = parseInt(opts.page.pageSize);
    }
    beginRowIndex = (pageIndex - 1) * pageSize;

    var findCountAsync = bbPromise.resolve();
    if(!opts.page.searchCount){
        var findSqlStr = paramparse.parseFindSqlObjTotal(null,"purchasing_management");
        findCountAsync = mysqlPool.queryAsync(findSqlStr);
    }
    var findDataStr = paramparse.parseFindSqlObjLimit(null,"purchasing_management",beginRowIndex,pageSize);
    var findDataAsync = mysqlPool.queryAsync(findDataStr);

    return join(findCountAsync,findDataAsync,function(total,data){
        return {total:total[0].total,data:data}
    }).then(function(result){
        results.error_code = 0;
        results.error_msg = "获取售货单列表成功！";
        results.data = result.data;
        results.total = result.total;
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

exports.settlePurchasingManagementAsync = function (opts) {
    var results = {error_code: -1, error_msg: "error"};
    var bbPromise = opts.mysqldbs.bbpromise;
    var join = bbPromise.join;
    var mysqlPool = opts.mysqldbs.mysqlPool;
    var findPm = {
        where: {pmId: opts.purchasingManagement.pmId}
    };
    var tableName = "purchasing_management";
    var findSqlStr = paramparse.parseFindSqlObj(findPm, tableName);
    return mysqlPool.queryAsync(findSqlStr).then(function (result) {
        if (!result.length) {
            results.error_code = 1001;
            results.error_msg = "该售货单不存在!";
            return results;
        }
        var good = result[0];
        if (good.paystatus == 3) {
            results.error_code = 1001;
            results.error_msg = "该售货单已经结清!";
            return results;
        }

        //商品信息变动
        var updObj = {
            set: {
                paystatus: {
                    relationship: "=",
                    value: opts.purchasingManagement.paystatus
                }
            },
            where: {
                pmId:opts.purchasingManagement.pmId
            }
        };
        var updateSql = paramparse.parseUpdateSqlObj(updObj, tableName);
        // var insertRecordAsync = mysqlPool.queryAsync(sqlObj.sqlStr, sqlObj.insertInfos);
        return mysqlPool.queryAsync(updateSql).then(function(result){
            results.error_code = 0;
            results.error_msg = "账单结清操作成功！";
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