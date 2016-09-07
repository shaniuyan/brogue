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
    if (!opts.page.searchCount) {
        var findSqlStr = paramparse.parseFindSqlObjTotal(null, "purchasing_management");
        findCountAsync = mysqlPool.queryAsync(findSqlStr);
    }
    var obj = {
        where :{}
    };

    if(!isNaN(opts.purchasing.paystatus)){
        obj.where.paystatus = opts.purchasing.paystatus;
    }

    var findDataStr = paramparse.parseFindSqlObjLimit(obj, "purchasing_management", beginRowIndex, pageSize);
    var findDataAsync = mysqlPool.queryAsync(findDataStr);

    return join(findCountAsync, findDataAsync, function (total, data) {
        return {total: total[0].total, data: data}
    }).then(function (result) {
        results.error_code = 0;
        results.error_msg = "获取售货单列表成功！";
        results.data = result.data;
        results.total = result.total;
        return results;
    });
};

exports.purchasingManagementDetailListAsync = function (opts) {
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
    var findObj = {where: {pmId: opts.purchasingManagement.pmId}};
    var findDataStr = paramparse.parseFindSqlObjLimit(findObj, "purchasing_management_detail", beginRowIndex, pageSize);
    return mysqlPool.queryAsync(findDataStr).then(function (result) {
        results.error_code = 0;
        results.error_msg = "获取售详情列表成功！";
        results.data = result;
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
        purchaserole: opts.purchasingManagement.purchaserole,
        purchaseperson: opts.purchasingManagement.purchaseperson,
        purchasephone: opts.purchasingManagement.purchasephone,
        paystatus: opts.purchasingManagement.paystatus,
        createTime: opts.purchasingManagement.createTime//,
        //clearTime: opts.purchasingManagement.clearTime
    };

    var findPm = {
        where: {
            purchaserole: {
                relationship: "=",
                value: opts.purchasingManagement.purchaserole
            },
            paystatus:{
                relationship: "in",
                value: "0,1"
            }
        }
    };
    var findSqlStr = paramparse.parseFindSqlObjs(findPm, "purchasing_management");
    return mysqlPool.queryAsync(findSqlStr).then(function (result) {
        if (!result.length) {
            return getNextPurchasingManagementAsync(opts).then(function (result) {
                var tableName = "purchasing_management";
                insertObj.phcode = result.data;
                var sqlObj = paramparse.parseInsertSqlObj(insertObj, tableName);
                return mysqlPool.queryAsync(sqlObj.sqlStr, sqlObj.insertInfos).then(function (result) {
                    if (result.affectedRows == 1) {
                        insertObj.pmId = result.insertId;
                    }
                    results.error_code = 0;
                    results.error_msg = "添加售货单成功";
                    results.data = insertObj;
                    return results;
                }).catch(function (e) {
                    results.error_code = 1001;
                    results.error_msg = "添加售货单失败，请联系技术人员";
                    return results;
                });
            });
        } else {
            results.error_code = 1;
            results.error_msg = "获取售货单成功";
            results.data = result[0];
            return results;
        }
    });

};

exports.paymentOperationAsync = function (opts) {
    var results = {error_code: -1, error_msg: "error"};
    var bbPromise = opts.mysqldbs.bbpromise;
    var join = bbPromise.join;
    var mysqlPool = opts.mysqldbs.mysqlPool;
    var findPm = {
        where: {pmId: opts.purchasingManagement.pmId}
    };
    var tableName = "purchasing_management";
    var findSqlStr = paramparse.parseFindSqlObj(findPm, tableName);
    return mysqlPool.queryAsync(findSqlStr).then(function (purchasings) {
        if (!purchasings.length) {
            results.error_code = 1001;
            results.error_msg = "该售货单不存在!";
            return results;
        }
        var purchasingmanagement = purchasings[0];
        if (purchasingmanagement.paystatus == 3) {
            results.error_code = 1001;
            results.error_msg = "该售货单已经结清!";
            return results;
        }
        var totalprice = purchasingmanagement.totalprice;
        var alreadypaidmoney = purchasingmanagement.alreadypaidmoney + parseInt(opts.purchasingManagement.price);

        var updObj = {
            set: {
                alreadypaidmoney: {
                    relationship: "+",
                    value: alreadypaidmoney
                },
                paystatus: {
                    relationship: "=",
                    value: 2
                }
            },
            where: {
                pmId: opts.purchasingManagement.pmId
            }
        };

        if (alreadypaidmoney >= totalprice) {
            updObj.set.paystatus.value = 3;
            updObj.set.clearTime = {
                relationship: "=",
                value: new Date().getTime()
            };
        }
        var updateSql = paramparse.parseUpdateSqlObj(updObj, "purchasing_management");
        return mysqlPool.queryAsync(updateSql).then(function (result) {
            results.error_code = 0;
            results.error_msg = "结算成功!";
            return results;
        });
    });
};

exports.addPurchasingGoodsAsync = function (opts) {
    var results = {error_code: -1, error_msg: "error"};
    var bbPromise = opts.mysqldbs.bbpromise;
    var join = bbPromise.join;
    var mysqlPool = opts.mysqldbs.mysqlPool;
    var findPm = {
        where: {pmId: opts.purchasingManagement.pmId}
    };
    var findGood = {
        where: {goodId: opts.purchasingManagement.goodId}
    };
    var tableName = "purchasing_management";
    var findSqlStr = paramparse.parseFindSqlObj(findPm, tableName);
    var findGoodStr = paramparse.parseFindSqlObj(findGood, "goods");

    var findGoodAsync = mysqlPool.queryAsync(findGoodStr);
    var findPurchasingManagementAsync = mysqlPool.queryAsync(findSqlStr);

    return join(findGoodAsync, findPurchasingManagementAsync, function (good, purchasing) {
        return {good: good, purchasing: purchasing};
    }).then(function (result) {
        if (!result.purchasing.length) {
            results.error_code = 1001;
            results.error_msg = "该售货单不存在!";
            return results;
        }
        var purchasingmanagement = result.purchasing[0];
        if (purchasingmanagement.paystatus == 3) {
            results.error_code = 1001;
            results.error_msg = "该售货单已经结清!";
            return results;
        }
        if (!result.good.length) {
            results.error_code = 1001;
            results.error_msg = "该商品不存在!";
            return results;
        }
        if (opts.purchasingManagement.wholenum == 0 && opts.purchasingManagement.scatterednum == 0) {
            results.error_code = 1001;
            results.error_msg = "请输入要卖出商品的正确数量";
            return results;
        }
        var good = result.good[0];
        if (opts.purchasingManagement.wholenum > good.wholenum) {
            results.error_code = 1001;
            results.error_msg = "库存整件数量小于库存整件数量，请调整整件数量后批发！";
            return results;
        }

        if (opts.purchasingManagement.scatterednum > good.scatterednum) {
            results.error_code = 1001;
            results.error_msg = "库存零件数量小于库存零件数量，请调整零件数量后批发！";
            return results;
        }
        var goodPurchasePrice = (opts.purchasingManagement.wholenum * good.conversionunit + opts.purchasingManagement.scatterednum) * good.price;
        var insertObj = {
            pmId: opts.purchasingManagement.pmId,
            goodId: good.goodId,
            goodCode: good.goodCode,
            goodName: good.goodName,
            brand: good.brand,
            model: good.model,
            goodBar: good.goodBar,
            purchasePrice: good.purchasePrice,
            price: good.price,
            tradePrice: good.tradePrice,
            wholenum: opts.purchasingManagement.wholenum,
            wholeUnit: good.wholeUnit,
            conversionunit: good.conversionunit,
            scatterednum: opts.purchasingManagement.scatterednum,
            unit: good.unit,
            tradeTime: new Date().getTime(),
            subtotalprice: goodPurchasePrice
        };

        var tableName = "purchasing_management_detail";
        var sqlObj = paramparse.parseInsertSqlObj(insertObj, tableName);

        //添加售货商品信息
        var addPmDetailAsync = mysqlPool.queryAsync(sqlObj.sqlStr, sqlObj.insertInfos);
        //更改商品数量
        var updGoodNumObj = {
            set: {
                wholenum: {
                    relationship: "-",
                    value: opts.purchasingManagement.wholenum
                },
                scatterednum: {
                    relationship: "-",
                    value: opts.purchasingManagement.scatterednum
                }
            },
            where: {
                goodId: opts.purchasingManagement.goodId
            }
        };
        var updateSql = paramparse.parseUpdateSqlObj(updGoodNumObj, "goods");
        var updGoodNumAsync = mysqlPool.queryAsync(updateSql);


        var updObj = {
            set: {
                totalprice: {
                    relationship: "+",
                    value: goodPurchasePrice
                },
                paystatus: {
                    relationship: "=",
                    value: 1
                }
            },
            where: {
                pmId: opts.purchasingManagement.pmId
            }
        };
        var updateSql = paramparse.parseUpdateSqlObj(updObj, "purchasing_management");
        console.log(updateSql);
        //更新当前售货单为在售状态
        var updPurchasingManagementAsync = mysqlPool.queryAsync(updateSql);

        return join(addPmDetailAsync, updGoodNumAsync, updPurchasingManagementAsync, function (adddetail, goodNum, purchasingManagement) {
            return {adddetail: adddetail, goodNum: goodNum, purchasingManagement: purchasingManagement};
        }).then(function (result) {
            if (result.adddetail.affectedRows == 1) {
                insertObj.pmDetailId = result.adddetail.insertId;
            }


            var findDetail = {
                where: {pmDetailId: result.adddetail.insertId}
            };

            var findDetailStr = paramparse.parseFindSqlObj(findDetail, "purchasing_management_detail");
            var findPurchasingAsync = mysqlPool.queryAsync(findSqlStr);
            var findPurchasingDetailAsync = mysqlPool.queryAsync(findDetailStr);

            return join(findPurchasingAsync, findPurchasingDetailAsync, function (purchasings, purchasingdetails) {
                return {purchasing: purchasings[0], purchasingdetail: purchasingdetails[0]};
            }).then(function (result) {
                results.error_code = 0;
                results.error_msg = "添加售货商品成功！";
                results.data = result;
                return results;
            });
        });
    });
};

/**
 * 删除售货单的商品信息
 * @param opts
 * @returns {*}
 */
exports.delPurchasingGoodsAsync = function (opts) {
    var results = {error_code: -1, error_msg: "error"};
    var bbPromise = opts.mysqldbs.bbpromise;
    var join = bbPromise.join;
    var mysqlPool = opts.mysqldbs.mysqlPool;
    var findPm = {
        where: {pmId: opts.purchasingManagement.pmId}
    };
    var findpmStr = paramparse.parseFindSqlObj(findPm, "purchasing_management");

    return mysqlPool.queryAsync(findpmStr).then(function (result) {
        if (!result.length) {
            results.error_code = 1001;
            results.error_msg = "该售货单不存在!";
            return results;
        }
        var purchasingmanagement = result[0];
        if (purchasingmanagement.paystatus == 3) {
            results.error_code = 1001;
            results.error_msg = "该售货单已经结清!";
            return results;
        }
        var findPmDetailWhere = {
            where: {pmDetailId: opts.purchasingManagement.pmDetailId}
        };
        var findpmDetailStr = paramparse.parseFindSqlObj(findPmDetailWhere, "purchasing_management_detail");
        return mysqlPool.queryAsync(findpmDetailStr).then(function (result) {
            if (!result.length) {
                results.error_code = 1001;
                results.error_msg = "该出售商品已经删除!";
                return results;
            }
            var findpmDetail = result[0];
            //计算收货单应该减掉的金额
            var goodPurchasePrice = (findpmDetail.wholenum * findpmDetail.conversionunit + findpmDetail.scatterednum) * findpmDetail.price;

            var deletePmDetailStr = paramparse.deleteFindSqlObj(findPmDetailWhere, "purchasing_management_detail");
            var updWhere = {
                set: {
                    totalprice: {
                        relationship: "-",
                        value: goodPurchasePrice
                    }
                },
                where: {
                    pmId: findpmDetail.pmId
                }
            };
            var updPmPriceStr = paramparse.parseUpdateSqlObj(updWhere, "purchasing_management");
            var deletePmDetailAsync = mysqlPool.query(deletePmDetailStr);
            var updatePmPriceAsync = mysqlPool.query(updPmPriceStr);
            return join(updatePmPriceAsync, deletePmDetailAsync, function (updPm, deletePmDetail) {
                return {updPm: updPm, deletePmDetail: deletePmDetail};
            }).then(function (result) {
                results.error_code = 0;
                results.error_msg = "删除商品成功！";
                return results;
            });
        });

    });


    var findpmAsync = mysqlPool.queryAsync(findpmStr);
    var findpmDetailAsync = mysqlPool.queryAsync(findpmDetailStr);
    return join(findpmAsync, findpmDetailAsync, function (pm, pmdetail) {
        return {pm: pm, pmdetail: pmdetail}
    }).then(function (result) {
        results.error_code = 0;
        results.error_msg = "删除商品成功！";
        return results;
    });
};

/**
 * 更改售货单信息
 * 已经付款金额
 * 购买人姓名
 * 购买人联系方式
 * @param opts
 */
exports.updPurchasingManagementAsync = function (opts) {

};
/**
 * 更改价格
 * @param opts
 */
exports.updPurchasingGoodPriceAsync = function (opts) {

};


/**
 * 退单
 */
exports.reBackPurchasingManagementAsync = function (opts) {

};


/**
 * 删除售货单信息
 */
exports.delPurchasingManagementAsync = function (opts) {

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
        var purchasingmanagement = result[0];
        if (purchasingmanagement.paystatus == 3) {
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
                },
                clearTime: {
                    relationship: "=",
                    value: new Date().getTime()
                }
            },
            where: {
                pmId: opts.purchasingManagement.pmId
            }
        };
        var updateSql = paramparse.parseUpdateSqlObj(updObj, tableName);
        // var insertRecordAsync = mysqlPool.queryAsync(sqlObj.sqlStr, sqlObj.insertInfos);
        return mysqlPool.queryAsync(updateSql).then(function (result) {
            results.error_code = 0;
            results.error_msg = "账单结清操作成功！";
            return results;
        });
    });
};

var calcPurchasingManagementPriceAsync = exports.calcPurchasingManagementPriceAsync = function (opts) {
    var results = {error_code: -1, error_msg: "error"};
    var bbPromise = opts.mysqldbs.bbpromise;
    var mysqlPool = opts.mysqldbs.mysqlPool;
    var join = bbPromise.join;
    var findPurchasingManagementDetailObj = {
        where: {pmId: opts.purchasingManagement.pmId},
        fields: {
            sumprice: "sum(price)"
        }
    };

    var findSql = paramparse.parseFindFieldSqlObj(findPurchasingManagementDetailObj, "purchasing_management_detail");
    return mysqlPool.queryAsync(findSql).then(function (result) {
        if (!result.length) {
            results.error_code = 1001;
            results.error_msg = "该售货单不存在售货信息!";
            return results;
        }
        delete findPurchasingManagementDetailObj.fields;
        findPurchasingManagementDetailObj.set = {
            tradePrice: result[0].sumprice
        };
        var updSql = paramparse.parseUpdateSqlObj(findPurchasingManagementDetailObj, "purchasing_management");
        return mysqlPool.queryAsync(updSql).then(function (result) {
            results.error_code = 0;
            results.error_msg = "该收货单已经重新结算!";
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