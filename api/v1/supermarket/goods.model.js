/**
 * Created by wk on 2016/7/12.
 */

var paramparse = require("../../common/paramparse");
var moment = require("moment");
/**
 * 获取商品列表
 * @param opts
 * @returns {*}
 */
exports.goodListAsync = function (opts) {
    var results = {error_code: -1, error_msg: "error"};
    var bbPromise = opts.mysqldbs.bbpromise;
    var join = bbPromise.join;
    var mysqlPool = opts.mysqldbs.mysqlPool;
    var pageIndex = 0, beginRowIndex = 0, endRowIndex = 0, pageSize = opts.configs.sysconfig.customer.pageSize;
    if (!isNaN(opts.page.pageIndex)) {
        pageIndex = opts.page.pageIndex;i
    }
    if (!isNaN(opts.page.pageSize)) {
        pageSize = parseInt(opts.page.pageSize);
    }
    beginRowIndex = (pageIndex - 1) * pageSize;

    var findCountAsync = bbPromise.resolve();
    if(!opts.page.searchCount){
        var findSqlStr = paramparse.parseFindSqlObjTotal(null,"goods");
        findCountAsync = mysqlPool.queryAsync(findSqlStr);
    }
    var findDataStr = paramparse.parseFindSqlObjLimit(null,"goods",beginRowIndex,pageSize);
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

/**
 * 添加商品
 * @param req
 * @param res
 * @param next
 */
exports.addGoodAsync = function (opts) {
    var results = {error_code: -1, error_msg: "error"};
    var bbPromise = opts.mysqldbs.bbpromise;

    return getNextGoodAsync(opts).then(function(result){
        var mysqlPool = opts.mysqldbs.mysqlPool;
        var insertObj = {
            goodCode: '',
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
            conversionunit: opts.good.conversionunit,
            goodBar: opts.good.goodBar,
            lastStorageTime: new Date().getTime()
        };
        insertObj.goodCode = result.data;
        var tableName = "goods";
        var sqlObj = paramparse.parseInsertSqlObj(insertObj, tableName);
        return mysqlPool.queryAsync(sqlObj.sqlStr, sqlObj.insertInfos).then(function (result) {
            results.error_code = 0;
            results.error_msg = "添加成功";
            results.data = insertObj;
            return results;
        });
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
        if(result[0].wholenum - opts.good.wholenum<0){
            results.error_code = 1001;
            results.error_msg = "小于要零卖的件数!";
            return results;
        }
        /*if (opts.good.wholescatterednum != result[0].conversionunit) {
            results.error_code = 1001;
            results.error_msg = "不能随意更改换算单位!";
            return results;
        }*/

        //计算整拆后库存整 零数量
        var addScatterednum = opts.good.wholenum * result[0].conversionunit;
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

        result[0].scatterednum = result[0].scatterednum+addScatterednum;
        result[0].wholenum = result[0].wholenum - opts.good.wholenum;
        var updateSql = paramparse.parseUpdateSqlObj(updObj, "goods");
        return mysqlPool.queryAsync(updateSql).then(function (result1) {
            results.error_code = 0;
            results.error_msg = "拆箱成功！";
            results.data = result[0];
            return results;
        });
    });
};


exports.packingAsync = function (opts) {
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
        var maxPackiingNum = Math.floor(result[0].scatterednum / result[0].conversionunit);
        if (opts.good.wholenum > maxPackiingNum) {
            results.error_code = 1001;
            results.error_msg = "当前系统中存在" + result[0].scatterednum + result[0].unit + ",最多可以打包" + maxPackiingNum + result[0].wholeUnit + "!";
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

/**
 * 更改商品数量
 * @param opts
 */
exports.updGoodNumAsync = function (opts) {
    var results = {error_code: -1, error_msg: "error"};
    var bbPromise = opts.mysqldbs.bbpromise;
    var join = bbPromise.join;
    var mysqlPool = opts.mysqldbs.mysqlPool;
    var findGood = {
        where: {goodId: opts.good.goodId}
    };
    var findSqlStr = paramparse.parseFindSqlObj(findGood, "goods");
    return mysqlPool.queryAsync(findSqlStr).then(function (result) {
        if (!result.length) {
            results.error_code = 1001;
            results.error_msg = "您要修改的商品信息不存在，或已经被删除!";
            return results;
        }
        var good = result[0];
        //记录商品变动记录
        var recordObj = {
            goodId: good.goodId,
            goodCode: good.goodCode,
            goodName: good.goodName,
            brand: good.brand,
            model: good.model,
            purchasePrice: opts.good.purchasePrice-good.purchasePrice,
            price: opts.good.price-good.price,
            tradePrice: opts.good.tradePrice-good.tradePrice,
            wholenum: opts.good.wholenum-good.wholenum,
            wholeUnit: good.wholeUnit,
            conversionunit: good.conversionunit,
            scatterednum: opts.good.scatterednum-good.scatterednum,
            unit: good.unit,
            goodBar: good.goodBar,
            operateTime: new Date().getTime(),
        };
        var tableName = "goods_record";
        var sqlObj = paramparse.parseInsertSqlObj(recordObj, tableName);
        //商品信息变动
        var updObj = {
            set: {
                wholenum: {
                    relationship: "=",
                    value: opts.good.wholenum
                },
                scatterednum: {
                    relationship: "=",
                    value: opts.good.scatterednum
                },
                purchasePrice: {
                    relationship: "=",
                    value: opts.good.purchasePrice
                },
                tradePrice: {
                    relationship: "=",
                    value: opts.good.tradePrice
                },
                price: {
                    relationship: "=",
                    value: opts.good.price
                }
            },
            where: {
                goodId: opts.good.goodId
            }
        };
        var updateSql = paramparse.parseUpdateSqlObj(updObj, "goods");
        var insertRecordAsync = mysqlPool.queryAsync(sqlObj.sqlStr, sqlObj.insertInfos);
        var updateGoodAsync = mysqlPool.queryAsync(updateSql);
        return join(insertRecordAsync,updateGoodAsync,function(insertRecord,updateGood){
            return {insertRecord:insertRecord,updateGood:updateGood};
        }).then(function(result){
            results.error_code = 0;
            results.error_msg = "更新商品信息成功！";
            return results;
        });
    });
};


var getNextGoodAsync = function (opts) {
    var results = {error_code: -1, error_msg: "error"};
    var bbPromise = opts.mysqldbs.bbpromise;
    var mysqlPool = opts.mysqldbs.mysqlPool;
    return mysqlPool.queryAsync("select max(goodCode) goodCode from brogue_db.goods").then(function (result) {
        results.error_code = 0;
        results.error_msg = "获取服务器最新商品编号成功!";
        if (!result[0].goodCode) {
            result[0].goodCode = 'GD100001';
        } else {
            result[0].goodCode = paramparse.nextNumber('GD1',result[0].goodCode);
        }
        results.data = result[0].goodCode;
        return results;
    }).catch(function (e) {
        results.error_code = 1001;
        results.error_msg = "获取最新最新商品编号失败，请联系平台管理员!";
        return results;
    });
};