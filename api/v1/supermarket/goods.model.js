/**
 * Created by wk on 2016/7/12.
 */
/**
 * 获取商品列表
 * @param opts
 * @returns {*}
 */
exports.goodListAsync = function (opts) {
    var results = {error_code: -1, error_msg: "error"};
    var bbPromise = opts.mysqldbs.bbpromise;
    var mysqlPool = opts.mysqldbs.mysqlPool;
    var pageIndex = 0, beginRowIndex = 0, endRowIndex = 0, pageSize = opts.configs.customer.pageSize;
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
    var insertObj = [
        "goodCode",
        "goodName",
        "brand",
        "model",
        "goodBar",
        "price",
        "purchasePrice",
        "quantity",
        "wholeUnit",
        "unit",
        opts.good.goodCode,
        opts.good.goodName,
        opts.good.brand,
        opts.good.model,
        opts.good.goodBar,
        opts.good.price,
        opts.good.purchasePrice,
        opts.good.quantity,
        opts.good.wholeUnit,
        opts.good.unit
    ];
    return mysqlPool.queryAsync("insert into goods(??,??,??,??,??,??,??,??,??,??) values (?,?,?,?,?,?,?,?,?,?)", insertObj).then(function (result) {
        results.error_code = 0;
        results.error_msg = "添加成功";
        return results;
    });
};

