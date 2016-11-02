/**
 * Created by wk on 2016/10/14.
 */

var _ = require('lodash');
var authModel = require("./auth.model");
var moment = require("moment");

/**
 * 用户登录Api
 * @desc 用户登录系统首先会获取如下信息
 * 1、token信息
 * @param req
 * @param res
 * @param next
 */
exports.login = function(req,res,next){
    var param = _.extend(req.query, req.body);
    var body = {};
    body.response_params = {};
    var opts = {customer: {}, configs: {}};
    opts.configs = req.configs;
    opts.mysqldbs = req.mysqldbs;
    opts.customer.accountNumber = param.accountNumber;
    opts.customer.password = param.password;
    opts.customer.logintime = param.logintime;
    return authModel.loginAsync(opts).then(function (result) {
        body.error_code = result.error_code;
        body.error_msg = result.error_msg;
        body.response_params = result.data;
        res.status(200).json(body);
    });
};

/**
 * 设备类型 web、android、ios......
 * 设备唯一码
 * 打开平台时间
 * 打开平台时间戳
 * sessionId
 * 退出程序时间
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.getClientId = function(req,res,next){
    var param = _.extend(req.query, req.body);
    var time = new Date();
    var body = {};
    body.response_params = {};
    var opts = {client: {}, configs: {}};
    opts.configs = req.configs;
    opts.mysqldbs = req.mysqldbs;
    opts.client.deviceType = param.deviceType||1;
    opts.client.deviceUniqueCode = param.deviceUniqueCode||"";
    opts.client.openTime = new moment(time).format("YYYY-MM-DD HH:mm:ss");
    opts.client.openTimeStamp = time.getTime();
    opts.client.sessionId = param.sessionId||0;
    opts.client.exitTime = "";
    opts.client.exitTimeStamp = 0;
    return authModel.getClientIdAsync(opts).then(function (result) {
        body.error_code = result.error_code;
        body.error_msg = result.error_msg;
        body.response_params = result.data;
        res.status(200).json(body);
    });
};

exports.authorizeModuleList = function (req, res, next) {
    var param = _.extend(req.query, req.body);
    var body = {};
    body.response_params = {};
    var opts = {authorize: {}, page: {}, configs: {}};
    opts.configs = req.configs;
    opts.mysqldbs = req.mysqldbs;
    opts.authorize.uid = parseInt(param.uid);
    opts.authorize.moduleId = parseInt(param.moduleId||0);
    opts.authorize.type = param.type || "";
    opts.page.pageIndex = param.pageIndex || 1;
    opts.page.pageSize = param.pageSize;
    return authModel.authorizeModuleListAsync(opts).then(function (result) {
        body.error_code = result.error_code;
        body.error_msg = result.error_msg;
        body.response_params.data = result.data;
        body.response_params.total = result.total;
        res.status(200).json(body);
    });
};


exports.authorizeModule = function (req,res,next) {
    var param = _.extend(req.query, req.body);
    var time = new Date();
    var body = {};
    body.response_params = {};
    var opts = {authorize: {}, configs: {}};
    opts.configs = req.configs;
    opts.mysqldbs = req.mysqldbs;

    opts.authorize.uid = parseInt(param.uid);
    opts.authorize.moduleId = parseInt(param.moduleId);
    return authModel.authorizeModuleAsync(opts).then(function(result){
        body.error_code = result.error_code;
        body.error_msg = result.error_msg;
        body.response_params = result.data;
        res.status(200).json(body);
    });
}

exports.delAuthorizeModule = function (req,res,next) {
    var param = _.extend(req.query, req.body);
    var time = new Date();
    var body = {};
    body.response_params = {};
    var opts = {authorize: {}, configs: {}};
    opts.configs = req.configs;
    opts.mysqldbs = req.mysqldbs;
    opts.authorize.cmId = parseInt(param.cmId);
    return authModel.delAuthorizeModuleAsync(opts).then(function(result){
        body.error_code = result.error_code;
        body.error_msg = result.error_msg;
        body.response_params = result.data;
        res.status(200).json(body);
    });
}