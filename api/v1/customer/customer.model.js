/**
 * Created by wk on 2015/12/13.
 */
var sysConfig = require("../../../config/sysconfig.json");
var hashCustomer = require("../../../data/customer.json");
var _ = require("lodash");
/**
 * 登录api
 * @param opts
 */
exports.loginAsync = function (opts) {
    var results = {error_code: -1, error_msg: "error"};
    var customer = hashCustomer;
    if (sysConfig.customer.login == 1) {
        //由data获取数据
        if (customer[opts.customer.costomerno]) {
            results.error_code = 0;
            results.error_msg = "用户登录成功";
            results.data = customer[opts.customer.costomerno];
        } else {
            results.error_code = 1001;
            results.error_msg = "用户登录失败";
        }
        return results;
    } else {
        //后台数据库执行
        return results;
    }
};


exports.userListAsync = function (opts) {
    var customer = hashCustomer;
    var results = {error_code: -1, error_msg: "error"};
    results.error_code = 0;
    results.error_msg = "获取用户成功";
    results.data = _.values(customer);
    return results;
};


exports.userTestListAsync = function (opts) {
    var customer = hashCustomer;
    var results = {error_code: -1, error_msg: "error"};
    results.error_code = 0;
    results.error_msg = "获取用户成功";
    var users = [];
    for (var i = 0; i < 10; i++) {
        var user = {
            username:"王凯"+i,
            description:"miao"
        };
        users.push(user);
    }
    results.data = users;
    return results;
}