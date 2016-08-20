/**
 * Created by wk on 2016/8/16.
 */
var _ = require("lodash");
var purchasingManagementModel = require("./purchasingmanagement.model");

exports.purchasingManagementList = function (req, res, next) {
    var param = _.extend(req.query, req.body);
    var body = {};
    body.response_params = {};
    var opts = {good: {}, page: {}, configs: {}};
    opts.configs = req.configs;
    opts.mysqldbs = req.mysqldbs;
    opts.page.pageIndex = param.pageIndex;
    opts.page.pageSize = param.pageSize;
    opts.page.searchCount = param.searchCount;
    return purchasingManagementModel.purchasingManagementListAsync(opts).then(function (result) {
        body.error_code = result.error_code;
        body.error_msg = result.error_msg;
        body.response_params.data = result.data;
        body.response_params.total = result.total;
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
    opts.purchasingManagement.totalprice = param.totalprice;
    opts.purchasingManagement.alreadypaidmoney = param.alreadypaidmoney;
    opts.purchasingManagement.purchaseperson = param.purchaseperson;
    opts.purchasingManagement.purchasephone = param.purchasephone;
    opts.purchasingManagement.paystatus = 0;
    opts.purchasingManagement.createTime = new Date().getTime();
    //opts.purchasingManagement.clearTime = '';
    return purchasingManagementModel.addPurchasingManagementAsync(opts).then(function(result){
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
    opts.purchasingManagement.wholenum = param.wholenum||0;                     //整件数量
    opts.purchasingManagement.scatterednum = param.scatterednum||0;            //零卖数量
    return purchasingManagementModel.addPurchasingGoodsAsync(opts).then(function(result){
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