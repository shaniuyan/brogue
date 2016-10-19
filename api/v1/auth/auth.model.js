/**
 * Created by wk on 2016/10/14.
 */
var _ = require("lodash");
var paramparse = require("../../common/paramparse");
var moment = require("moment");
var crypto = require('crypto');
var UUID = require("node-uuid");

exports.loginAsync = function(opts){
    var results = {error_code: -1, error_msg: "error"};
    var bbPromise = opts.mysqldbs.bbpromise;
    var join = bbPromise.join;
    var mysqlPool = opts.mysqldbs.mysqlPool;
    var selectObj = {
        where:{
            accountNumber:opts.customer.accountNumber
        }
    };
    var findDataStr = paramparse.parseFindSqlObj(selectObj,"customers");
    return mysqlPool.queryAsync(findDataStr).then(function(result){
        if (!result.length) {
            results.error_code = 1009;
            results.error_msg = "您没有注册，请注册后登录平台!";
            return results;
        }
        var customer = result[0];
        var password = opts.customer.password;
        var md5 = crypto.createHash('md5');
        md5.update(password);
        var md5password = md5.digest('hex');
        console.log(md5password);
        if(customer.password == md5password){
            var token = "wydl";
            var updObj = {
                set: {
                    token: {
                        relationship: "=",
                        value:token
                    },
                    lastlogintime: {
                        relationship: "=",
                        value:opts.customer.logintime
                    }
                },
                where: {
                    accountNumber:opts.customer.accountNumber
                }
            };
            var updateSql = paramparse.parseUpdateSqlObj(updObj, "customers");
            console.log(updateSql);
            return mysqlPool.queryAsync(updateSql).then(function (result1) {
                results.error_code = 0;
                results.error_msg = "用户登录成功！";
                results.data = token;
                return results;
            });
        }else{
            results.error_code = 1001;
            results.error_msg = "密码输入错误，请重新输入密码!";
            return results;
        }
    });
};

/**
 * 获取客户端唯一标识符
 * @param opts
 */
exports.getClientIdAsync = function(opts){
    var results = {error_code: -1, error_msg: "error"};
    var bbPromise = opts.mysqldbs.bbpromise;
    var join = bbPromise.join;
    var mysqlPool = opts.mysqldbs.mysqlPool;
    var tableName = "devices";
    var selectObj = {};

    selectObj = {
        where:{
            sessionId:opts.client.sessionId
        }
    };

    var findDataStr = paramparse.parseFindSqlObj(selectObj,tableName);
    return mysqlPool.queryAsync(findDataStr).then(function(result){
        if (result.length) {
            results.error_code = 0;
            results.error_msg = "获取sessionId成功!";
            results.data = result[0].sessionId
            return results;
        }
        var sessionId = UUID.v4();
        opts.client.sessionId = sessionId;
        var insertObj = opts.client;
        var sqlObj = paramparse.parseInsertSqlObj(insertObj, tableName);
        return mysqlPool.queryAsync(sqlObj.sqlStr, sqlObj.insertInfos).then(function (result) {
            results.error_code = 0;
            results.error_msg = "与服务器成功建立连接！";
            results.data = insertObj.sessionId;
            return results;
        });
    });

};

exports.validateClientAsync = function(opts){
    var results = {error_code: 0, error_msg: "有效终端访问成功"};
    var bbPromise = opts.mysqldbs.bbpromise;
    var join = bbPromise.join;
    var mysqlPool = opts.mysqldbs.mysqlPool;
    var tableName = "devices";
    var selectObj = {};

    selectObj = {
        where:{
            sessionId:opts.client.sessionId
        }
    };

    var findDataStr = paramparse.parseFindSqlObj(selectObj,tableName);
    return mysqlPool.queryAsync(findDataStr).then(function(result){
        if (!result.length) {
            results.error_code = 9001;
            results.error_msg = "非有效终端访问!";
            return results;
        }
        results.data = result[0];
        return results;
    });
}