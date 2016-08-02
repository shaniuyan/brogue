/**
 * Created by wk on 2016/7/12.
 */

var paramparse = require("../../common/paramparse");

/**
 * 获取商品列表
 * @param opts
 * @returns {*}
 */
exports.goodListAsync = function (opts) {
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
    return mysqlPool.queryAsync("select * from goods limit ?,?", [beginRowIndex, pageSize]).then(function (result) {
        results.error_code = 0;
        results.error_msg = "获取商品列表成功！";
        results.data = result;
        return results;
    });
};

/**
 * 添加商品
 * @param req
 * @param res
 * @param next
 */
exports.addGoodAsync = function (opts) {
    var results = {error_code: -1, error_msg: "error"};
    var bbPromise = opts.mysqldbs.bbpromise;
    var mysqlPool = opts.mysqldbs.mysqlPool;

    var insertObj = {
        goodCode:opts.good.goodCode,
        goodName:opts.good.goodName,
        brand:opts.good.brand,
        model:opts.good.model,
        purchasePrice:opts.good.purchasePrice,
        price:opts.good.price,
        tradePrice:opts.good.tradePrice,
        wholenum:opts.good.wholenum,
        scatterednum:opts.good.scatterednum,
        wholeUnit:opts.good.wholeUnit,
        unit:opts.good.unit,
        goodBar:opts.good.goodBar,
        lastStorageTime:new Date().getTime()
    };

    var tableName = "goods";
    var sqlObj = paramparse.parseInsertSqlObj(insertObj,tableName);
    return mysqlPool.queryAsync(sqlObj.sqlStr, sqlObj.insertInfos).then(function (result) {
        results.error_code = 0;
        results.error_msg = "添加成功";
        return results;
    });
};

