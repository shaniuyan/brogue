/**
 * Created by wk on 2016/7/29.
 */
var _ = require("lodash");
var wholesaleModel = require("./wholesale.model");

/**
 * 添加批发单信息
 * @param req
 * @param res
 * @param next
 */
exports.addWholesale = function(req,res,next){
    var param = _.extend(req.query, req.body);
    var body = {};
    body.response_params = {};
    var opts = {wholesale: {},configs: {}};
    opts.configs = req.configs;
    opts.mysqldbs = req.mysqldbs;
    opts.wholesale.wholesalenum = '';                      //批发单编号
    opts.wholesale.customerId = param.customerId;         //客户id
    opts.wholesale.customerName = param.customerName;    //客户名称
    opts.wholesale.customerType = param.customerType;    //1、对公(默认)，2、对私
    opts.wholesale.wholesaledate = param.wholesaledate;  //批发日期
    opts.wholesale.totalamount = 0;                         //批发账单总金额
    opts.wholesale.paymenttotalamount = 0;                 //批发账单总金额
    opts.wholesale.paymentedtotalamount = 0;
    opts.wholesale.paymentstatus = 0;                      //1：未结算 2:未结清 3:已结清
    opts.wholesale.createtime = new Date().getTime();      //批发单录入系统时间
    return wholesaleModel.addWholesaleAsync(opts).then(function(result){
        body.error_code = result.error_code;
        body.error_msg = result.error_msg;
        body.response_params = result.data;
        return res.status(200).json(body);
    });
};

/**
 * 批发单添加商品时批发单总金额变动时调用
 * @param opts
 */
exports.addPayment = function(req,res,next){
    var param = _.extend(req.query, req.body);
    var body = {};
    body.response_params = {};
    var opts = {wholesale: {},configs: {}};
    opts.configs = req.configs;
    opts.mysqldbs = req.mysqldbs;
    opts.wholesale.wholesalid = param.wholesalid;
    opts.wholesale.amount = param.amount;
    return wholesaleModel.addPaymentAsync(opts).then(function(result){
        body.error_code = result.error_code;
        body.error_msg = result.error_msg;
        return res.status(200).json(body);
    });
};

/**
 * 修正应该支付金额
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.updPaymentTotalAmount = function(req,res,next){
    var param = _.extend(req.query, req.body);
    var body = {};
    body.response_params = {};
    var opts = {wholesale: {},configs: {}};
    opts.configs = req.configs;
    opts.mysqldbs = req.mysqldbs;
    opts.wholesale.wholesalid = param.wholesalid;
    opts.wholesale.paymenttotalamount = param.paymenttotalamount;
    return wholesaleModel.updPaymentTotalAmountAsync(opts).then(function(result){
        body.error_code = result.error_code;
        body.error_msg = result.error_msg;
        return res.status(200).json(body);
    });
};


exports.getLastWholesaleNum = function(req,res,next){
    var param = _.extend(req.query, req.body);
    var body = {};
    body.response_params = {};
    var opts = {wholesale: {},configs: {}};
    opts.configs = req.configs;
    opts.mysqldbs = req.mysqldbs;
    return wholesaleModel.getNexWholesaleNumAsync(opts).then(function(result){
        body.error_code = result.error_code;
        body.error_msg = result.error_msg;
        body.response_params = result.data;
        return res.status(200).json(body);
    });
};