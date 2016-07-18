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