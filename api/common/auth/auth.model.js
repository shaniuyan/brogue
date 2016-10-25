/**
 * Created by wk on 2016/10/14.
 */
var _ = require("lodash");
var paramparse = require("../../common/paramparse");
var moment = require("moment");
var crypto = require('crypto');
var UUID = require("node-uuid");

exports.loginAsync = function (opts) {
    var results = {error_code: -1, error_msg: "error"};
    var bbPromise = opts.mysqldbs.bbpromise;
    var join = bbPromise.join;
    var mysqlPool = opts.mysqldbs.mysqlPool;
    var selectObj = {
        where: {
            accountNumber: opts.customer.accountNumber
        }
    };
    var findDataStr = paramparse.parseFindSqlObj(selectObj, "customers");
    return mysqlPool.queryAsync(findDataStr).then(function (result) {
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
        console.log(md5password + "====" + customer.password);
        if (customer.password == md5password) {
            delete customer.password;
            var token = "wydl";
            var updObj = {
                set: {
                    token: {
                        relationship: "=",
                        value: token
                    },
                    lastlogintime: {
                        relationship: "=",
                        value: opts.customer.logintime
                    }
                },
                where: {
                    accountNumber: opts.customer.accountNumber
                }
            };
            var updateSql = paramparse.parseUpdateSqlObj(updObj, "customers");
            console.log(updateSql);
            return mysqlPool.queryAsync(updateSql).then(function (result1) {
                results.error_code = 0;
                results.error_msg = "用户登录成功！";
                results.data = customer;
                return results;
            });
        } else {
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
exports.getClientIdAsync = function (opts) {
    var results = {error_code: -1, error_msg: "error"};
    var bbPromise = opts.mysqldbs.bbpromise;
    var join = bbPromise.join;
    var mysqlPool = opts.mysqldbs.mysqlPool;
    var tableName = "devices";
    var selectObj = {};

    selectObj = {
        where: {
            sessionId: opts.client.sessionId
        }
    };

    var findDataStr = paramparse.parseFindSqlObj(selectObj, tableName);
    return mysqlPool.queryAsync(findDataStr).then(function (result) {
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

exports.validateClientAsync = function (opts) {
    var results = {error_code: 0, error_msg: "有效终端访问成功"};
    var bbPromise = opts.mysqldbs.bbpromise;
    var join = bbPromise.join;
    var mysqlPool = opts.mysqldbs.mysqlPool;
    var tableName = "devices";
    var selectObj = {};

    selectObj = {
        where: {
            sessionId: opts.client.sessionId
        }
    };

    var findDataStr = paramparse.parseFindSqlObj(selectObj, tableName);
    return mysqlPool.queryAsync(findDataStr).then(function (result) {
        if (!result.length) {
            results.error_code = 9001;
            results.error_msg = "非有效终端访问!";
            return results;
        }
        results.data = result[0];
        return results;
    });
};

exports.authorizeModuleListAsync = function (opts) {
    var results = {error_code: -1, error_msg: "error"};
    var bbPromise = opts.mysqldbs.bbpromise;
    var join = bbPromise.join;
    var mysqlPool = opts.mysqldbs.mysqlPool;
    var tableName = "customers_modules";
    var pageIndex = 0, beginRowIndex = 0, endRowIndex = 0, pageSize = opts.configs.sysconfig.customer.pageSize;
    if (!isNaN(opts.page.pageIndex)) {
        pageIndex = opts.page.pageIndex;
    }
    if (!isNaN(opts.page.pageSize)) {
        pageSize = parseInt(opts.page.pageSize);
    }
    beginRowIndex = (pageIndex - 1) * pageSize;

    var findModule = {
        where: {
            modulePid: opts.authorize.moduleId,
            uid: opts.authorize.uid,
            delTag: 0
        }
    };

    var findCountAsync = bbPromise.resolve();
    if (!opts.page.searchCount) {
        var findSqlStr = paramparse.parseFindSqlObjTotal(findModule, tableName);
        findCountAsync = mysqlPool.queryAsync(findSqlStr);
    }
    var findDataStr = paramparse.parseFindSqlObjLimit(findModule, tableName, beginRowIndex, pageSize);
    var findDataAsync = mysqlPool.queryAsync(findDataStr);

    return join(findCountAsync, findDataAsync, function (total, data) {
        return {total: total[0].total, data: data}
    }).then(function (result) {
        results.error_code = 0;
        results.error_msg = "获取商品列表成功！";
        results.data = result.data;
        results.total = result.total;
        return results;
    });
};

exports.authorizeModuleAsync = function (opts) {
    var results = {error_code: -1, error_msg: "error"};
    var bbPromise = opts.mysqldbs.bbpromise;
    var join = bbPromise.join;
    var mysqlPool = opts.mysqldbs.mysqlPool;
    var tableName = "customers_modules";
    var whereCustomer = {
        where: {
            uid: opts.authorize.uid
        }
    };
    var whereModules = {
        where: {
            moduleId: opts.authorize.moduleId
        }
    };
    var findUserStr = paramparse.parseFindSqlObj(whereCustomer, "customers");
    var findModulesStr = paramparse.parseFindSqlObj(whereModules, "modules");

    var findUserAsync = mysqlPool.queryAsync(findUserStr);
    var findModuleAsync = mysqlPool.queryAsync(findModulesStr);
    return join(findUserAsync, findModuleAsync, function (users, modules) {
        return {users: users, modules: modules};
    }).then(function (result) {
        var user = result.users.length ? result.users[0] : null;
        var module = result.modules.length ? result.modules[0] : null;
        if (!user) {
            results.error_code = 1001;
            results.error_msg = "授权用户非法！";
            return results;
        }
        if (!module) {
            results.error_code = 1001;
            results.error_msg = "授权模块非法！";
            return results;
        }

        if (module.modulePid == 0) {
            results.error_code = 1001;
            results.error_msg = "该模块不能进行授权！";
            return results;
        }

        var findAuthorizeWhere = {
            where: {
                uid: opts.authorize.uid,
                moduleId: opts.authorize.moduleId
            }
        };

        var findUserModuleStr = paramparse.parseFindSqlObj(findAuthorizeWhere, tableName);

        return mysqlPool.queryAsync(findUserModuleStr).then(function (result) {
            if (result.length) {
                results.error_code = 1001;
                results.error_msg = "不能对用户进行重复授权！";
                return results;
            }
            var whereInsertModules = {
                where: {
                    moduleId: module.modulePid
                }
            };
            var findInsertModulesStr = paramparse.parseFindSqlObj(whereInsertModules, "modules");
            return mysqlPool.queryAsync(findInsertModulesStr).then(function (result) {
                var pmodule = result.length ? result[0] : null;

                if (!pmodule) {
                    results.error_code = 1001;
                    results.error_msg = "该功能菜单不存在！";
                    return results;
                }

                var findAuthorizeParentWhere = {
                    where: {
                        uid: opts.authorize.uid,
                        moduleId: module.modulePid
                    }
                };
                var findAuthorizeParentStr = paramparse.parseFindSqlObj(findAuthorizeParentWhere, tableName);
                return mysqlPool.queryAsync(findAuthorizeParentStr).then(function (result) {
                    var insertPModuleAsync = bbPromise.resolve();
                    if (!result.length) {
                        pmodule.uid = opts.authorize.uid;
                        var insertParentObj = pmodule;
                        var sqlParentObj = paramparse.parseInsertSqlObj(insertParentObj, tableName);
                        insertPModuleAsync = mysqlPool.queryAsync(sqlParentObj.sqlStr, sqlParentObj.insertInfos);
                        ;
                    } else {
                        pmodule = result[0];
                    }
                    module.uid = opts.authorize.uid;
                    var insertChildObj = module;
                    var sqlChildObj = paramparse.parseInsertSqlObj(insertChildObj, tableName);
                    var insertCModuleAsync = mysqlPool.queryAsync(sqlChildObj.sqlStr, sqlChildObj.insertInfos);
                    return join(insertPModuleAsync, insertCModuleAsync, function (r1, r2) {
                        return {
                            module: module,
                            pmodule: pmodule
                        };
                    }).then(function (result) {
                        results.error_code = 0;
                        results.error_msg = "授权成功";
                        results.data = result.pmodule;
                        return results;
                    });
                });
            });
        });
    });
};


exports.delAuthorizeModuleAsync = function (opts) {
    var results = {error_code: -1, error_msg: "error"};
    var bbPromise = opts.mysqldbs.bbpromise;
    var join = bbPromise.join;
    var mysqlPool = opts.mysqldbs.mysqlPool;
    var tableName = "customers_modules";
    var whereCustomerModules = {
        where: {
            cmId: opts.authorize.cmId
        }
    };
    var findUserStr = paramparse.parseFindSqlObj(whereCustomerModules, tableName);
    return mysqlPool.queryAsync(findUserStr).then(function (result) {
        if (!result.length) {
            results.error_code = 1001;
            results.error_msg = "该授权信息不存在！";
            return results;
        }
        var customerModule = result[0];
        if (customerModule.delTag == 1) {
            results.error_code = 1001;
            results.error_msg = "该授权信息已经被删除，无需重复删除！";
            return results;
        }
        var whereCustomerHashModules = {
            where: {
                moduleId: customerModule.modulePid,
                delTag: 0
            }
        };
        var findCustomerHashModulesStr = paramparse.parseFindSqlObj(whereCustomerHashModules, tableName);
        return mysqlPool.queryAsync(findCustomerHashModulesStr).then(function (result) {
            var updObj = {
                relationship: "or",
                set: {
                    delTag: {
                        relationship: "=",
                        value: 1
                    }
                },
                where: {}
            };
            if (result.length <= 1) {
                updObj.where.moduleId = customerModule.modulePid;
            }
            updObj.where.cmId = opts.authorize.cmId;

            var updateSql = paramparse.parseUpdateSqlObj(updObj, tableName);
            return mysqlPool.queryAsync(updateSql).then(function (result1) {
                results.error_code = 0;
                results.error_msg = "删除权限信息成功！";
                return results;
            });
        });
    });
};