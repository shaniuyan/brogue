var _ = require("lodash");
var paramparse = require("../../common/paramparse");
var moment = require("moment");
/**
 * 基层用户(村、居委会、街道等用户)model
 */

exports.goodCustomerAsync = function (opts) {
    var results = {error_code: -1, error_msg: "error"};
    var bbPromise = opts.mysqldbs.bbpromise;
    var join = bbPromise.join;
    var mysqlPool = opts.mysqldbs.mysqlPool;
    var pageIndex = 0, beginRowIndex = 0, endRowIndex = 0, pageSize = opts.configs.sysconfig.customer.pageSize;
    if (!isNaN(opts.page.pageIndex)) {
        pageIndex = opts.page.pageIndex;
    }
    if (!isNaN(opts.page.pageSize)) {
        pageSize = parseInt(opts.page.pageSize);
    }
    beginRowIndex = (pageIndex - 1) * pageSize;

    var obj={
        where:{deltag:opts.customer.deltag}
    };

    var findCountAsync = bbPromise.resolve();
    if (!opts.page.searchCount) {
        var findSqlStr = paramparse.parseFindSqlObjTotal(obj, "customers");
        findCountAsync = mysqlPool.queryAsync(findSqlStr);
    }
    var findDataStr = paramparse.parseFindSqlObjLimit(obj, "customers", beginRowIndex, pageSize);
    var findDataAsync = mysqlPool.queryAsync(findDataStr);

    return join(findCountAsync, findDataAsync, function (total, data) {
        return {total: total[0].total, data: data}
    }).then(function (result) {
        results.error_code = 0;
        results.error_msg = "获取商品列表成功！";
        results.data = result.data;
        results.total = result.total;
        return results;
    });
};

exports.addCustomerAsync = function (opts) {
    var results = {error_code: -1, error_msg: "error"};
    var bbPromise = opts.mysqldbs.bbpromise;
    return getNextAccountAsync(opts).then(function(result){
        var mysqlPool = opts.mysqldbs.mysqlPool;
        var insertObj = {
            name: opts.customer.name,
            sex: opts.customer.sex,
            nickname: opts.customer.nickname,
            accountNumber: "",
            phone: opts.customer.phone,
            telephone: opts.customer.telephone,
            idNumber: opts.customer.idNumber,
            placeOfOrigin: opts.customer.placeOfOrigin,
            presentAddress: opts.customer.presentAddress,
            password: opts.customer.password,
            token: opts.customer.token
        };
        insertObj.accountNumber = result.data;
        var tableName = "customers";
        var sqlObj = paramparse.parseInsertSqlObj(insertObj, tableName);
        return mysqlPool.queryAsync(sqlObj.sqlStr, sqlObj.insertInfos).then(function (result) {
            results.error_code = 0;
            results.error_msg = "添加成功";
            results.data = insertObj;
            return results;
        });
    });
};
exports.updCustomerAsync = function (opts) {

};

exports.delCustomerAsync = function (opts) {
    var results = {error_code: -1, error_msg: "error"};
    var bbPromise = opts.mysqldbs.bbpromise;
    var mysqlPool = opts.mysqldbs.mysqlPool;

    var findCustomer = {
        where: {accountNumber: opts.customer.accountNumber}
    };
    var findSqlStr = paramparse.parseFindSqlObj(findCustomer, "customers");
    return mysqlPool.queryAsync(findSqlStr).then(function (result) {
        if (!result.length) {
            results.error_code = 1001;
            results.error_msg = "您要删除的职工信息不存在!";
            return results;
        }
        var updObj = {
            set: {
                deltag: {
                    relationship: "=",
                    value: 1
                }
            },
            where: {
                accountNumber: opts.customer.accountNumber
            }
        };
        var updateSql = paramparse.parseUpdateSqlObj(updObj, "customers");
        return mysqlPool.queryAsync(updateSql).then(function (result1) {
            results.error_code = 0;
            results.error_msg = "删除职工信息成功！";
            return results;
        });
    });
};


var getNextAccountAsync = function (opts) {
    var results = {error_code: -1, error_msg: "error"};
    var bbPromise = opts.mysqldbs.bbpromise;
    var mysqlPool = opts.mysqldbs.mysqlPool;
    return mysqlPool.queryAsync("select max(accountNumber) accountNumber from brogue_db.customers").then(function (result) {
        results.error_code = 0;
        results.error_msg = "获取服务器最新客户编号成功!";
        if (!result[0].accountNumber) {
            result[0].accountNumber = 'AN100001';
        } else {
            result[0].accountNumber = paramparse.nextNumber('AN1',result[0].accountNumber);
        }
        results.data = result[0].accountNumber;
        return results;
    }).catch(function (e) {
        results.error_code = 1001;
        results.error_msg = "获取服务器最新客户编号失败，请联系平台管理员!";
        return results;
    });
};