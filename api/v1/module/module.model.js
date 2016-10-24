/**
 * Created by wk on 2016/10/21.
 */
var paramparse = require("../../common/paramparse");
var moment = require("moment");

exports.moduleListAsync = function (opts) {
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

    var findCountAsync = bbPromise.resolve();
    if(!opts.page.searchCount){
        var findSqlStr = paramparse.parseFindSqlObjTotal(null,"modules");
        findCountAsync = mysqlPool.queryAsync(findSqlStr);
    }
    var findDataStr = paramparse.parseFindSqlObjLimit(null,"modules",beginRowIndex,pageSize);
    var findDataAsync = mysqlPool.queryAsync(findDataStr);

    return join(findCountAsync,findDataAsync,function(total,data){
        return {total:total[0].total,data:data}
    }).then(function(result){
        results.error_code = 0;
        results.error_msg = "获取商品列表成功！";
        results.data = result.data;
        results.total = result.total;
        return results;
    });
};

exports.addModuleAsync = function(opts){
    var results = {error_code: -1, error_msg: "error"};
    var bbPromise = opts.mysqldbs.bbpromise;
    var mysqlPool = opts.mysqldbs.mysqlPool;
    var tableName = "modules";

    var findModule = {
        where: {moduleName: opts.module.moduleName}
    };
    var findSqlStr = paramparse.parseFindSqlObj(findModule, tableName);
    return mysqlPool.queryAsync(findSqlStr).then(function (result) {
        if (result.length) {
            results.error_code = 2001;
            results.error_msg = "您要添加的模块名称已经存在，请勿重复添加!";
            return results;
        }

        return getNextModuleMCAsync(opts).then(function(result){
            opts.module.createTimeStamp = new Date().getTime();
            opts.module.createTime = new moment().format("YYYY-MM-DD HH:mm:ss");
            var insertObj = opts.module;
            insertObj.moduleMC = result.data;
            var sqlObj = paramparse.parseInsertSqlObj(insertObj, tableName);
            return mysqlPool.queryAsync(sqlObj.sqlStr, sqlObj.insertInfos).then(function (result) {
                results.error_code = 0;
                results.error_msg = "添加成功";
                results.data = insertObj;
                return results;
            });
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