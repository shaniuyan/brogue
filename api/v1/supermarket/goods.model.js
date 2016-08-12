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
        goodCode: opts.good.goodCode,
        goodName: opts.good.goodName,
        brand: opts.good.brand,
        model: opts.good.model,
        purchasePrice: opts.good.purchasePrice,
        price: opts.good.price,
        tradePrice: opts.good.tradePrice,
        wholenum: opts.good.wholenum,
        scatterednum: opts.good.scatterednum,
        wholeUnit: opts.good.wholeUnit,
        unit: opts.good.unit,
        conversionunit:opts.good.conversionunit,
        goodBar: opts.good.goodBar,
        lastStorageTime: new Date().getTime()
    };

    var tableName = "goods";
    var sqlObj = paramparse.parseInsertSqlObj(insertObj, tableName);
    return mysqlPool.queryAsync(sqlObj.sqlStr, sqlObj.insertInfos).then(function (result) {
        results.error_code = 0;
        results.error_msg = "添加成功";
        return results;
    });
};

/**
 * 拆箱：针对商品零售
 * @param opts
 */
exports.unboxingAsync = function (opts) {
    var results = {error_code: -1, error_msg: "error"};
    var bbPromise = opts.mysqldbs.bbpromise;
    var mysqlPool = opts.mysqldbs.mysqlPool;

    var findGood = {
        where: {goodId: opts.good.goodId}
    };
    var findSqlStr = paramparse.parseFindSqlObj(findGood, "goods");
    return mysqlPool.queryAsync(findSqlStr).then(function (result) {
        if (!result.length) {
            results.error_code = 1001;
            results.error_msg = "您要零卖的商品不存在!";
            return results;
        }
        if (result[0].wholenum < opts.good.wholenum) {
            results.error_code = 1001;
            results.error_msg = "您要零卖的商品库存不足，现在剩余" + result[0].wholenum + result[0].wholeUnit + "!";
            return results;
        }

        if(opts.good.wholescatterednum != result[0].conversionunit){
            results.error_code = 1001;
            results.error_msg = "不能随意更改换算单位!";
            return results;
        }

        //计算整拆后库存整 零数量
        var addScatterednum = opts.good.wholenum * opts.good.wholescatterednum;
        var updObj = {
            set: {
                wholenum: {
                    relationship: "-",
                    value: opts.good.wholenum
                },
                scatterednum: {
                    relationship: "+",
                    value: addScatterednum
                }
            },
            where: {
                goodId: opts.good.goodId
            }
        };
        var updateSql = paramparse.parseUpdateSqlObj(updObj, "goods");
        return mysqlPool.queryAsync(updateSql).then(function (result) {
            results.error_code = 0;
            results.error_msg = "拆箱成功！";
            return results;
        });
    });
};


exports.packingAsync = function(opts){
    var results = {error_code: -1, error_msg: "error"};
    var bbPromise = opts.mysqldbs.bbpromise;
    var mysqlPool = opts.mysqldbs.mysqlPool;

    var findGood = {
        where: {goodId: opts.good.goodId}
    };
    var findSqlStr = paramparse.parseFindSqlObj(findGood, "goods");

    return mysqlPool.queryAsync(findSqlStr).then(function(result){
        if (!result.length) {
            results.error_code = 1001;
            results.error_msg = "您要零卖的商品不存在!";
            return results;
        }
        var maxPackiingNum = Math.floor(result[0].scatterednum/result[0].conversionunit);
        if(opts.good.wholenum>maxPackiingNum){
            results.error_code = 1001;
            results.error_msg = "当前系统中存在"+result[0].scatterednum+result[0].unit+",最多可以打包"+maxPackiingNum+result[0].wholeUnit+"!";
            return results;
        }
        //计算整拆后库存整 零数量
        var minusScatterednum = opts.good.wholenum * result[0].conversionunit;
        var updObj = {
            set: {
                wholenum: {
                    relationship: "+",
                    value: opts.good.wholenum
                },
                scatterednum: {
                    relationship: "-",
                    value: minusScatterednum
                }
            },
            where: {
                goodId: opts.good.goodId
            }
        };
        var updateSql = paramparse.parseUpdateSqlObj(updObj, "goods");
        return mysqlPool.queryAsync(updateSql).then(function (result) {
            results.error_code = 0;
            results.error_msg = "打包成功！";
            return results;
        });
    });
};