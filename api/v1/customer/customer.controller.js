/**
 * Created by wk on 2015/12/13.
 */
var _ = require('lodash');
var customerModel = require("./customer.model");

exports.login = function(req,res,next){
    var param = _.extend(req.query, req.body);
    var body = {};
    body.response_params = {};
    var opts = {customer:{}};
    opts.customer.costomerno = param.user.costomerno;
    var loginCustomer = customerModel.loginAsync(opts);
    body.error_code = loginCustomer.error_code;
    body.error_msg = loginCustomer.error_msg;
    body.response_params.data = loginCustomer.data ;
    res.status(200).json(body);
};

exports.getUserList = function(req,res,next){
    var param = _.extend(req.query, req.body);
    var body = {};
    body.response_params = {};
    var opts = {customer:{}};
    var loginCustomer = customerModel.userListAsync(opts);
    body.error_code = loginCustomer.error_code;
    body.error_msg = loginCustomer.error_msg;
    body.response_params.data = loginCustomer.data ;
    res.status(200).json(body);
};


exports.userTestList = function(req,res,next){
    var param = _.extend(req.query, req.body);
    var body = {};
    body.response_params = {};
    var opts = {customer:{}};
    var loginCustomer = customerModel.userTestListAsync(opts);
    body.error_code = loginCustomer.error_code;
    body.error_msg = loginCustomer.error_msg;
    body.response_params.data = loginCustomer.data ;
    body.response_params.total = 100;
    res.status(200).json(body);
};