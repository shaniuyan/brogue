/**
 * Created by wk on 2016/7/18.
 */


exports.addMarketQuotientAsync = function (opts) {
    var results = {error_code: -1, error_msg: "error"};
    var bbPromise = opts.mysqldbs.bbpromise;
    var mysqlPool = opts.mysqldbs.mysqlPool;
    var insertObj = [
        "companyCode",
        "companyName",
        "linkMan",
        "tel",
        "phone",
        "currentaccount",
        "buildtime",
        "isimportant",
        opts.marketQuotient.companyCode,
        opts.marketQuotient.companyName,
        opts.marketQuotient.linkMan,
        opts.marketQuotient.tel,
        opts.marketQuotient.phone,
        opts.marketQuotient.currentaccount,
        opts.marketQuotient.buildtime,
        opts.marketQuotient.isimportant
    ];
    return mysqlPool.queryAsync("insert into marketQuotient(??,??,??,??,??,??,??,??) values (?,?,?,?,?,?,?,?)", insertObj)
        .then(function (result) {
            results.error_code = 0;
            results.error_msg = "添加服务商成功";
            return results;
        }).catch(function (e) {
            results.error_msg = e.message;
            return results;
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