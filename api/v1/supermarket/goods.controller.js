/**
 * Created by wk on 2016/7/12.
 */
var _ = require("lodash");

var goodModel = require("./goods.model");
/**
 * 获取商品列表
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.goodList = function (req, res, next) {
    var param = _.extend(req.query, req.body);
    var body = {};
    body.response_params = {};
    var opts = {good: {}, page: {}, configs: {}};
    opts.configs = req.configs;
    opts.mysqldbs = req.mysqldbs;
    opts.page.pageIndex = param.pageIndex;
    opts.page.pageSize = param.pageSize;
    return goodModel.goodListAsync(opts).then(function (result) {
        body.error_code = result.error_code;
        body.error_msg = result.error_msg;
        body.response_params = result.data;
        res.status(200).json(body);
    });
};


exports.addGood = function (req, res, next) {
    var param = _.extend(req.query, req.body);
    var body = {};
    body.response_params = {};
    var opts = {good: {}, configs: {}};
    opts.configs = req.configs;
    opts.mysqldbs = req.mysqldbs;
    opts.good.goodCode = param.goodCode;
    opts.good.goodName = param.goodName;
    opts.good.brand = param.brand;
    opts.good.model = param.model;
    opts.good.goodBar = param.goodBar;
    opts.good.purchasePrice = param.purchasePrice;   //进价
    opts.good.price = param.price;                     //售价
    opts.good.tradePrice = param.tradePrice;          //批发价   --
    opts.good.wholenum = param.wholenum;                     //整件数量  --
    opts.good.scatterednum = param.scatterednum;            //零卖数量  --


    opts.good.wholeUnit = param.wholeUnit;
    opts.good.unit = param.unit;
    return goodModel.addGoodAsync(opts).then(function (result) {
        body.error_code = result.error_code;
        body.error_msg = result.error_msg;
        res.status(200).json(body);
    });
};

exports.unboxing = function(req,res,next){
    var param = _.extend(req.query, req.body);
    var body = {};
    body.response_params = {};
    var opts = {good: {}, configs: {}};
    opts.configs = req.configs;
    opts.mysqldbs = req.mysqldbs;
    opts.good.goodId = param.goodId;
    opts.good.wholenum = param.wholenum;
    opts.good.wholescatterednum = param.wholescatterednum;//整件默认数量
    return goodModel.unboxingAsync(opts).then(function(result){
        body.error_code = result.error_code;
        body.error_msg = result.error_msg;
        res.status(200).json(body);
    });
};