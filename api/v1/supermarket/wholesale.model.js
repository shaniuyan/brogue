/**
 * Created by wk on 2016/7/29.
 */

var moment = require("moment");
var paramparse = require("../../common/paramparse")
/**
 * 添加批发单信息
 */
exports.addWholesaleAsync = function (opts) {
    var results = {error_code: -1, error_msg: "error"};
    var bbPromise = opts.mysqldbs.bbpromise;
    var mysqlPool = opts.mysqldbs.mysqlPool;
    var insertObj = [
        "wholesalenum",
        "customerId",
        "customerName",
        "customerType",
        "totalamount",
        "paymenttotalamount",
        "paymentedtotalamount",
        "paymentstatus",
        "wholesaledate",
        "createtime",
        opts.wholesale.wholesalenum,
        opts.wholesale.customerId,
        opts.wholesale.customerName,
        opts.wholesale.customerType,
        opts.wholesale.totalamount,
        opts.wholesale.paymenttotalamount,
        opts.wholesale.paymentedtotalamount,
        opts.wholesale.paymentstatus,
        opts.wholesale.wholesaledate,
        opts.wholesale.createtime
    ];

    var findCustomerAsync = bbPromise.resolve();

    if (opts.wholesale.customerType == 1) {
        var findWhereCustomer = [
            "companyId",
            opts.wholesale.customerId,
            "companyName",
            opts.wholesale.customerName
        ];
        findCustomerAsync = mysqlPool.queryAsync("select * from marketquotient where ??=? and ??=?", findWhereCustomer);
    } else {
        findCustomerAsync = mysqlPool.queryAsync("select * from marketcurtomer where ??=? and ??=?", findWhereCustomer);
    }

    return findCustomerAsync.then(function (result) {
        if (!result.length) {
            results.error_code = 1001;
            results.error_msg = "所选择客户不存在，请先录入该客户信息！";
            return results;
        }
        return getNexWholesaleNumAsync(opts).then(function (result) {
            insertObj[9] = result.data;
            return mysqlPool.queryAsync("insert into wholesales(??,??,??,??,??,??,??,??,??,??) values (?,?,?,?,?,?,?,?,?,?)", insertObj).then(function (result) {
                if (result.affectedRows == 1) {
                    opts.wholesale.wholesalesId = result.insertId;
                }
                results.error_code = 0;
                results.error_msg = "添加批发单成功";
                results.data = opts.wholesale;
                return results;
            }).catch(function (e) {
                results.error_code = 1001;
                results.error_msg = "添加批发单失败，请联系技术人员";
                return results;
            });
        });

    });

};

/**
 * 添加批发单明细信息
 * @param opts
 */
exports.addWholesaleDetailsAsync = function (opts) {
    var results = {error_code: -1, error_msg: "error"};
    var bbPromise = opts.mysqldbs.bbpromise;
    var join = bbPromise.join;
    var mysqlPool = opts.mysqldbs.mysqlPool;
    var findWhere = [
        "wholesalesId",
        opts.wholesaledetail.wholesalid
    ];
    var findGood = [
        "goodId",
        opts.good.goodId
    ];

    var findwholesalesAsync = mysqlPool.queryAsync("select * from wholesales where ?? = ?", findWhere);
    var findGoodAsync = mysqlPool.queryAsync("select * from goods where ?? = ?", findGood);

    return join(findwholesalesAsync,findGoodAsync,function(wholesales,good){
        return {
            wholesales:wholesales,
            good:good
        };
    }).then(function(result){
        console.log(JSON.stringify(result));
        if (!result.wholesales.length || result.wholesales[0].paymentstatus == 3) {
            results.error_code = 1001;
            results.error_msg = "该批发单失效，无法继续添加批发商品";
            return results;
        }

        if (!result.good.length) {
            results.error_code = 1001;
            results.error_msg = "该商品已经被删除，请重新录入商铺信息";
            return results;
        }

        if(opts.wholesaledetail.wholenum == 0 && opts.wholesaledetail.scatterednum == 0){
            results.error_code = 1001;
            results.error_msg = "请输入批发商品的正确数量";
            return results;
        }
        var good = result.good[0];
        if(opts.wholesaledetail.wholenum>=good.wholenum){
            results.error_code = 1001;
            results.error_msg = "库存整件数量小于库存整件数量，请调整整件数量后批发！";
            return results;
        }

        if(opts.wholesaledetail.scatterednum>=good.scatterednum){
            results.error_code = 1001;
            results.error_msg = "库存零件数量小于库存零件数量，请调整零件数量后批发！";
            return results;
        }

        var insertObj = {
            wholesalesId: opts.wholesaledetail.wholesalid,
            goodId:good.goodId,
            goodCode: good.goodCode,
            goodName: good.goodName,
            brand: good.brand,
            model: good.model,
            goodBar: good.goodBar,
            purchasePrice:good.purchasePrice,
            price: good.price,
            tradePrice:good.tradePrice,
            wholenum: opts.wholesaledetail.wholenum,
            wholeUnit: good.wholeUnit,
            scatterednum: opts.wholesaledetail.scatterednum,
            unit: good.unit,
            tradeTime:new Date().getTime()
        };
        var tableName = "wholesalesdetail";
        var sqlObj = paramparse.parseInsertSqlObj(insertObj,tableName);

        var setGood = [
            "wholenum",
            "wholenum",
            opts.wholesaledetail.wholenum,
            "scatterednum",
            "scatterednum",
            opts.wholesaledetail.scatterednum,
            "goodId",
            opts.good.goodId
        ];
        var updGoodNumAsync = mysqlPool.queryAsync("update goods set ??=??-?,??=??-? where ??=?",setGood);
        var addWholesaleAsync =  mysqlPool.queryAsync(sqlObj.sqlStr, sqlObj.insertInfos);

        return join(updGoodNumAsync,addWholesaleAsync,function(updGoodNum,addWholesale){
            return {
                updGoodNum:updGoodNum,
                addWholesale:addWholesale
            };
        }).then(function(result){
            results.error_code = 0;
            results.error_msg = "添加批发商品成功！";
            return results;
        });
    });
};

/**
 * 删除批发单明细信息
 * @param opts
 */
exports.deleteWholesaleDetailsAsync = function (opts) {

};

/**
 * 修改批发单明细信息
 */
exports.updateWholesaleDetailsAsync = function (opts) {

};

/**
 * 查询批发单明细信息
 * @param opts
 */
exports.wholesaleDetailListAsync = function (opts) {
};


/**
 * 批发单添加商品时批发单总金额变动时调用
 * @param opts
 */
exports.addPaymentAsync = function (opts) {
    var results = {error_code: -1, error_msg: "error"};
    var bbPromise = opts.mysqldbs.bbpromise;
    var mysqlPool = opts.mysqldbs.mysqlPool;
    /**
     opts.wholesale.wholesalid = param.wholesalid;
     opts.wholesale.paymentamount = param.paymentamount;
     */
    var findWhere = [
        "wholesalid",
        opts.wholesale.wholesalid
    ];

    return mysqlPool.queryAsync("select * from wholesales where ?? = ?", findWhere).then(function (result) {
        if (!result.length || result[0].paymentstatus == 3) {
            results.error_code = 1001;
            results.error_msg = "该批发单失效，无法继续添加派发商品";
            return results;
        } else {
            var setObjs = [
                "totalamount",
                "totalamount",
                opts.wholesale.amount,
                "wholesalesId",
                opts.wholesale.wholesalid
            ];
            return mysqlPool.queryAsync("update wholesales set ?? = ??+? where ?? = ?", setObjs).then(function (result) {
                results.error_code = 0;
                results.error_msg = "批发单累计添加商品金额汇总成功！";
                return results;
            });
        }
    });
};

/**
 * 店铺管理员根据实际情况，可能会对批发单的整体价格进行相应的调整
 * 改变应该付款金额
 * @param opts
 */
exports.updPaymentTotalAmountAsync = function (opts) {
    var results = {error_code: -1, error_msg: "error"};
    var bbPromise = opts.mysqldbs.bbpromise;
    var mysqlPool = opts.mysqldbs.mysqlPool;
    var findWhere = [
        "wholesalesId",
        opts.wholesale.wholesalid
    ];
    return mysqlPool.queryAsync("select * from wholesales where ?? = ?", findWhere).then(function (result) {
        if (!result.length || result[0].paymentstatus == 3) {
            results.error_code = 1001;
            results.error_msg = "该批发单失效，无法更改应支付金额！";
            return results;
        } else {
            var setObjs = [
                "paymenttotalamount",
                opts.wholesale.paymenttotalamount,
                "wholesalesId",
                opts.wholesale.wholesalid
            ];
            return mysqlPool.queryAsync("update wholesales set ?? = ? where ?? = ?", setObjs).then(function (result) {
                results.error_code = 0;
                results.error_msg = "修改批发单应付款金额成功！";
                return results;
            });
        }
    });
};


var getNexWholesaleNumAsync = exports.getNexWholesaleNumAsync = function (opts) {
    //select max(wholesalenum) lastwholesalenum from brogue_db.wholesales;
    var results = {error_code: -1, error_msg: "error"};
    var bbPromise = opts.mysqldbs.bbpromise;
    var mysqlPool = opts.mysqldbs.mysqlPool;
    return mysqlPool.queryAsync("select max(wholesalenum) lastwholesalenum from brogue_db.wholesales").then(function (result) {
        results.error_code = 0;
        results.error_msg = "获取服务器最新批发编号成功!";
        if (!result[0].lastwholesalenum) {
            result[0].lastwholesalenum = 'WS' + new moment().format("YYYYMMDD") + "00001"
        } else {
            result[0].lastwholesalenum = paramparse.nextBatchNumber(result[0].lastwholesalenum);
        }
        results.data = result[0].lastwholesalenum;
        return results;
    }).catch(function (e) {
        results.error_code = 1001;
        results.error_msg = "获取最新批发编号失败，请联系平台管理员!";
        return results;
    });
};