/**
 * Created by wk on 2016/8/16.
 */
var _ = require("lodash");
var purchasingManagementModel = require("./purchasingmanagement.model");

exports.purchasingManagementList = function (req, res, next) {
    var param = _.extend(req.query, req.body);
    var body = {};
    body.response_params = {};
    var opts = {purchasing: {}, page: {}, configs: {}};
    opts.configs = req.configs;
    opts.mysqldbs = req.mysqldbs;
    opts.page.pageIndex = param.pageIndex;
    opts.page.pageSize = param.pageSize;
    opts.page.searchCount = param.searchCount;
    opts.purchasing.paystatus = param.paystatus || "";
    return purchasingManagementModel.purchasingManagementListAsync(opts).then(function (result) {
        body.error_code = result.error_code;
        body.error_msg = result.error_msg;
        body.response_params.data = result.data;
        body.response_params.total = result.total;
        res.status(200).json(body);
    });
};

exports.purchasingManagementDetailList = function (req, res, next) {
    var param = _.extend(req.query, req.body);
    var body = {};
    body.response_params = {};
    var opts = {purchasingManagement: {}, page: {}, configs: {}};
    opts.configs = req.configs;
    opts.mysqldbs = req.mysqldbs;
    opts.page.pageIndex = param.pageIndex;
    opts.page.pageSize = param.pageSize;
    opts.purchasingManagement.pmId = param.pmId;
    return purchasingManagementModel.purchasingManagementDetailListAsync(opts).then(function (result) {
        body.error_code = result.error_code;
        body.error_msg = result.error_msg;
        body.response_params.data = result.data;
        res.status(200).json(body);
    });
};

/**
 * 添加采购单信息
 * @param req
 * @param res
 * @param next
 */
exports.addPurchasingManagement = function(req,res,next){
    var param = _.extend(req.query, req.body);
    var body = {};
    body.response_params = {};
    var opts = {purchasingManagement:{},configs:{}};
    opts.configs = req.configs;
    opts.mysqldbs = req.mysqldbs;
    opts.purchasingManagement.phcode = '';
    opts.purchasingManagement.totalprice = 0;
    opts.purchasingManagement.alreadypaidmoney = 0;
    opts.purchasingManagement.purchaserole = param.purchaserole;
    opts.purchasingManagement.purchaseperson = param.purchaseperson;
    opts.purchasingManagement.purchasephone = param.purchasephone;
    opts.purchasingManagement.paystatus = 0;
    opts.purchasingManagement.createTime = new Date().getTime();
    //opts.purchasingManagement.clearTime = '';
    return purchasingManagementModel.addPurchasingManagementAsync(opts).then(function(result){
        body.error_code = result.error_code;
        body.error_msg = result.error_msg;
        body.response_params = result.data;
        res.status(200).json(body);
    });
};

exports.paymentOperation = function(req,res,next){
    var param = _.extend(req.query, req.body);
    var body = {};
    body.response_params = {};
    var opts = {purchasingManagement:{},configs:{}};
    opts.configs = req.configs;
    opts.mysqldbs = req.mysqldbs;
    opts.purchasingManagement.pmId = param.pmId;
    opts.purchasingManagement.price = param.price;
    //opts.purchasingManagement.clearTime = '';
    return purchasingManagementModel.paymentOperationAsync(opts).then(function(result){
        body.error_code = result.error_code;
        body.error_msg = result.error_msg;
        res.status(200).json(body);
    });
};

/**
 * 添加售货商品商品信息
 * @param req
 * @param res
 * @param next
 */
exports.addPurchasingGoods = function(req,res,next){
    var param = _.extend(req.query, req.body);
    var body = {};
    body.response_params = {};
    var opts = {purchasingManagement:{},configs:{}};
    opts.configs = req.configs;
    opts.mysqldbs = req.mysqldbs;
    opts.purchasingManagement.pmId = param.pmId;
    opts.purchasingManagement.goodId = param.goodId;
    opts.purchasingManagement.wholenum = parseInt(param.wholenum||0);                     //整件数量
    opts.purchasingManagement.scatterednum = parseInt(param.scatterednum||0);            //零卖数量
    return purchasingManagementModel.addPurchasingGoodsAsync(opts).then(function(result){
        body.error_code = result.error_code;
        body.error_msg = result.error_msg;
        body.response_params = result.data;
        res.status(200).json(body);
    });
};
/**
 * 删除出售的商铺信息
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.delPurchasingGoods = function(req,res,next){
    var param = _.extend(req.query, req.body);
    var body = {};
    body.response_params = {};
    var opts = {purchasingManagement:{},configs:{}};
    opts.configs = req.configs;
    opts.mysqldbs = req.mysqldbs;
    opts.purchasingManagement.pmId = param.pmId;
    opts.purchasingManagement.pmDetailId = param.pmDetailId;
    return purchasingManagementModel.delPurchasingGoodsAsync(opts).then(function(result){
        body.error_code = result.error_code;
        body.error_msg = result.error_msg;
        res.status(200).json(body);
    });
};
/**
 * 更新收货单为结清状态
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.settlePurchasingManagement = function(req,res,next){
    var param = _.extend(req.query, req.body);
    var body = {};
    body.response_params = {};
    var opts = {purchasingManagement:{},configs:{}};
    opts.configs = req.configs;
    opts.mysqldbs = req.mysqldbs;
    opts.purchasingManagement.pmId = param.pmId;
    opts.purchasingManagement.paystatus = 3;
    return purchasingManagementModel.settlePurchasingManagementAsync(opts).then(function(result){
        body.error_code = result.error_code;
        body.error_msg = result.error_msg;
        res.status(200).json(body);
    });
};