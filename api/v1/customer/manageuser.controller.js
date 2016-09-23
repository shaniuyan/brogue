/**
 * Created by wk on 2015/12/13.
 */
var _ = require('lodash');
var manageUserModel = require("./manageuser.model");


exports.goodCustomer = function (req, res, next) {
    var param = _.extend(req.query, req.body);
    var body = {};
    body.response_params = {};
    var opts = {customer: {}, page: {}, configs: {}};
    opts.configs = req.configs;
    opts.mysqldbs = req.mysqldbs;
    opts.page.pageIndex = param.pageIndex;
    opts.page.pageSize = param.pageSize;
    return manageUserModel.goodCustomerAsync(opts).then(function (result) {
        body.error_code = result.error_code;
        body.error_msg = result.error_msg;
        body.response_params.data = result.data;
        body.response_params.total = result.total;
        res.status(200).json(body);
    });
};

/**
 * 添加系统用户
 * 姓名         name
 * 性别         sex
 * 昵称         nickname
 * 账号         accountNumber普通号生成规则，终生唯一
 * 手机号码     phone
 * 固定电话     telephone
 * 身份证号     idNumber
 * 籍贯         placeOfOrigin
 * 现住址       presentAddress
 * 密码         password
 * token
 * @param req
 * @param res
 * @param next
 */
exports.addCustomer = function(req,res,next){
    var param = _.extend(req.query, req.body);
    var body = {};
    body.response_params = {};
    var opts = {customer: {}, configs: {}};
    opts.configs = req.configs;
    opts.mysqldbs = req.mysqldbs;
    opts.customer.name = param.name;
    opts.customer.sex = param.sex;
    opts.customer.nickname = param.nickname;
    opts.customer.accountNumber = param.accountNumber;
    opts.customer.phone = param.phone;
    opts.customer.telephone = param.telephone;
    opts.customer.idNumber = param.idNumber;
    opts.customer.placeOfOrigin = param.placeOfOrigin;
    opts.customer.presentAddress = param.presentAddress;
    opts.customer.password = param.password;
    opts.customer.token = param.token;

    return manageUserModel.addCustomerAsync(opts).then(function (result) {
        body.error_code = result.error_code;
        body.error_msg = result.error_msg;
        body.response_params = result.data;
        res.status(200).json(body);
    });
};