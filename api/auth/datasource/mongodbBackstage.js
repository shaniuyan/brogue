/**
 * Created by wk on 2016/2/27.
 */
var _ = require("lodash");
var dbConfig = require("./dbConfig.json");
var permsConfig = require("../config/apiconfig.json");
var rolesConfig = require("../config/roleconfig.json");
exports.initAuthDataAsync = function (opts) {
    var results = {error_code: -1, error_msg: "error"};
    var bbPromise = opts.dbs.bbpromise;
    var join = bbPromise.join;
    var authDb = opts.dbs[dbConfig["mongodb"]["dbName"]];
    var tables = dbConfig["mongodb"]["tables"];
    var stepDes = "";
    //检测权限系统是否已经安装
    if (!dbConfig["isInstall"]) {
        //如果没有安装执行安装操作
        //删除系统api列表信息
        var delPermAsync = authDb.collection(tables["perms"]).deleteManyAsync({});
        //删除系统角色列表信息
        var delRoleAsync = authDb.collection(tables["roles"]).deleteManyAsync({});
        //删除用户具有的权限
        var delUserPermAsync = authDb.collection(tables["userPerm"]).deleteManyAsync({});
        //删除角色具有的权限
        var delRolePermAsync = authDb.collection(tables["rolePerm"]).deleteManyAsync({});
        //删除用户角色列表信息
        var delUserRoleAsync = authDb.collection(tables["userRole"]).deleteManyAsync({});
        return join(delPermAsync, delRoleAsync, delUserPermAsync, delRolePermAsync,delUserRoleAsync,
        //return join(delPermAsync, delRoleAsync, delRolePermAsync,delUserRoleAsync,
            function (delPerm, delRole, delUserPerm, delRolePerm, delUserRole) {
                results.error_code = 0;
                results.error_msg = "清除权限数据成功！";
                return results;
            }).then(function (result) {
                stepDes = "权限系统开始初始化：" + JSON.stringify(result);
                console.log(stepDes);
                if (result.error_code == 0) {
                    if (!permsConfig || permsConfig.length == 0) {
                        results.error_code == 1001;
                        stepDes = results.error_msg == "权限数据为配置";
                        console.log(stepDes);
                        return results;
                    }
                    if (!rolesConfig || rolesConfig.length == 0) {
                        results.error_code == 1001;
                        stepDes = results.error_msg == "角色数据为配置";
                        console.log(stepDes);
                        return results;
                    }
                    //插入系统api列表信息
                    var insertPermAsync = authDb.collection(tables["perms"]).insertManyAsync(permsConfig);
                    //插入系统角色列表信息
                    var insertRoleAsync = authDb.collection(tables["roles"]).insertManyAsync(rolesConfig);
                    var permsConfigTmp = _.clone(permsConfig);
                    _.each(permsConfigTmp, function (perm) {
                        perm.roleXh = rolesConfig[0].roleXh;
                    });
                    //管理员默认具有系统全部权限
                    var insertRolePermAsync = authDb.collection(tables["rolePerm"]).insertManyAsync(permsConfigTmp);
                    var insertUserRoleAsync = authDb.collection(tables["userRole"]).insertManyAsync([{roleXh:1,userId:1}]);
                    return join(insertPermAsync, insertRoleAsync, insertRolePermAsync,insertUserRoleAsync, function (insertPerm, insertRole, insertRolePerm,insertUserRole) {
                        stepDes = result.error_msg = "权限系统初始化数据成功！";
                        console.log(stepDes);
                        return result;
                    }).then(function (result) {
                        //如果不是调试模式，系统会执行完成安装功能
                        if (!dbConfig["debug"]) {
                            var fs = require('fs');
                            dbConfig["isInstall"] = true;
                            var strDbConfig = JSON.stringify(dbConfig);
                            fs.writeFile("../api/auth/datasource/dbConfig.json", strDbConfig);
                        }
                        console.log("权限系统安装状态更新成功！");
                        return getBaseAuthDataAsync(opts).then(function (result) {
                            return result;
                        });
                    });
                } else {
                    stepDes = "权限系统开始初始化失败";
                    console.log(stepDes);
                }
            });
    } else {
        return getBaseAuthDataAsync(opts).then(function (result) {
            return result;
        });
    }
};
var getBaseAuthDataAsync = exports.getBaseAuthDataAsync = function (opts) {
    var results = {error_code: -1, error_msg: "error"};
    var bbPromise = opts.dbs.bbpromise;
    var join = bbPromise.join;
    var authDb = opts.dbs[dbConfig["mongodb"]["dbName"]];
    var tables = dbConfig["mongodb"]["tables"];
    //获取系统api列表信息
    var permAsync = authDb.collection(tables["perms"]).find({}, {_id: 0}).toArrayAsync();
    //获取系统角色列表信息
    var roleAsync = authDb.collection(tables["roles"]).find({}, {_id: 0}).toArrayAsync();
    //获取角色权限列表信息
    var userPermAsync = authDb.collection(tables["userPerm"]).find({}, {_id: 0}).toArrayAsync();
    //获取角色权限列表信息
    var rolePermAsync = authDb.collection(tables["rolePerm"]).find({}, {_id: 0}).toArrayAsync();
    //获取用户角色列表信息
    var userRoleAsync = authDb.collection(tables["userRole"]).find({}, {_id: 0}).toArrayAsync();
    return join(permAsync, roleAsync,userPermAsync, rolePermAsync,userRoleAsync, function (presult, rresult,upresult, rpresult,urresult) {
        var hashData = {};
        hashData.perms = presult.length > 0 ? presult : "系统中尚未配置权限表[" + tables["perms"] + "]数据为空";
        hashData.roles = rresult.length > 0 ? rresult : "系统中尚未配置角色表[" + tables["roles"] + "]数据为空";
        hashData.userPerms = upresult.length > 0 ? upresult : "系统中尚未配置用户权限表[" + tables["userPerm"] + "]数据为空";
        hashData.rolePerms = rpresult.length > 0 ? rpresult : "系统中尚未配置角色权限表[" + tables["rolePerm"] + "]数据为空";
        hashData.userRoles = urresult.length > 0 ? urresult : "系统中尚未配置用户角色表[" + tables["userRole"] + "]数据为空";
        return hashData;
    }).then(function (result) {
        results.error_code = 0;
        results.error_msg = "获取权限信息成功！";
        results.data = result;
        return results;
    }).catch(function (e) {
        return results;
    }).finally(function () {
        return results;
    });
};
/**
 * 添加系统模块信息
 * @param opts
 */
exports.addPermAsync = function (opts) {
    var results = {error_code: -1, error_msg: "error"};
    var bbPromise = opts.dbs.bbpromise;
    var join = bbPromise.join;
    var authDb = opts.dbs[dbConfig["mongodb"]["dbName"]];
    var permCol = dbConfig["mongodb"]["tables"]["perms"];
    return authDb.collection(permCol).findOneAsync({permXh: opts.perms.permXh}).then(function (perm) {
        if (perm) {
            results.error_msg = "系统中已经存在该权限信息";
            return results;
        } else {
            return authDb.collection(permCol).insertOneAsync(opts.perms).then(function (result) {
                results.error_code = 0;
                results.error_msg = "添加权限信息成功！";
                //添加成功后，向缓存中更新权限信息permHash对象
                opts.dbs.permsHashObj.permHash[opts.perms.permUrl] = opts.perms;
                return results;
            });
        }
    });
};
/**
 * 删除权限信息
 * @param opts
 * @returns {Promise|*}
 */
exports.delPermAsync = function (opts) {
    var results = {error_code: -1, error_msg: "error"};
    var bbPromise = opts.dbs.bbpromise;
    var join = bbPromise.join;
    var authDb = opts.dbs[dbConfig["mongodb"]["dbName"]];
    var permCol = dbConfig["mongodb"]["tables"]["perms"];
    return authDb.collection(permCol).removeOneAsync({permXh: opts.perms.permXh}).then(function (result) {
        results.error_code = 0;
        results.error_msg = "删除权限信息成功！";
        //删除成功后，向缓存中更新权限信息permHash对象
        delete opts.dbs.permsHashObj.permHash[opts.perms.permUrl];
        return results;
    });
};
/**
 * 修改权限信息
 * @param opts
 * @returns {Promise|*}
 */
exports.updPermAsync = function (opts) {
    var results = {error_code: -1, error_msg: "error"};
    var bbPromise = opts.dbs.bbpromise;
    var join = bbPromise.join;
    var authDb = opts.dbs[dbConfig["mongodb"]["dbName"]];
    var permCol = dbConfig["mongodb"]["tables"]["perms"];
    return authDb.collection(permCol).updateOneAsync({permXh: opts.perms.permXh}, {$set: opts.perms}).then(function (result) {
        results.error_code = 0;
        results.error_msg = "编辑权限信息成功！";
        //删除成功后，向缓存中更新权限信息permHash对象
        opts.dbs.permsHashObj.permHash[opts.perms.permUrl] = opts.perms;
        return results;
    });
};
/**
 * 更具模块名称查询模块信息
 * @param opts
 * @returns {Promise|*}
 */
exports.queryPermAsync = function (opts) {
    var results = {error_code: -1, error_msg: "error"};
    var bbPromise = opts.dbs.bbpromise;
    var join = bbPromise.join;
    var authDb = opts.dbs[dbConfig["mongodb"]["dbName"]];
    var permCol = dbConfig["mongodb"]["tables"]["perms"];
    var filter = {};
    var reg = new RegExp(opts.perms.permName)
    filter.permName = reg;
    if (!isNaN(opts.perms.level)) {
        filter.level = parseInt(opts.perms.level);
    }
    return authDb.collection(permCol).find(filter).toArrayAsync().
        then(function (perms) {
            results.error_code = 0;
            results.error_msg = "编辑权限信息成功！";
            results.data = perms;
            return results;
        });
};

/**
 * 给用户添加/删除权限
 * @param opts
 */
exports.userPermsAssignmentAsync = function(opts){
    var results = {error_code: -1, error_msg: "error"};
    var bbPromise = opts.dbs.bbpromise;
    var join = bbPromise.join;
    var authDb = opts.dbs[dbConfig["mongodb"]["dbName"]];
    var userPermCol = dbConfig["mongodb"]["tables"]["userPerm"];
    var permObj = opts.dbs.permsHashObj.permListHash["P"+opts.userPerm.permXh];
    var userPerm = permObj;
    userPerm.userId = opts.userPerm.userId;
    var filter = {userId: opts.userPerm.userId, permXh: opts.userPerm.permXh};
    if (opts.userPerm.assignmentType == 0) {
        return authDb.collection(userPermCol).updateOneAsync(filter,{$set:userPerm},{upsert:true}).then(function(result){
            results.error_code = 0;
            results.error_msg = "角色添加权限信息成功！";
            if(!opts.dbs.permsHashObj.userPermHash["UP" + userPerm.userId]){
                opts.dbs.permsHashObj.userPermHash["UP" + userPerm.userId] = {};
                opts.dbs.permsHashObj.userPermHash["UP" + userPerm.userId].perms = [];
            }
            if(result.upsertedCount){
                opts.dbs.permsHashObj.userPermHash["UP" + userPerm.userId].perms.push(userPerm);
            }
            console.log(JSON.stringify(opts.dbs.permsHashObj.userPermHash["UP" + userPerm.userId].perms));
            return results;
        });
    }else{
        return authDb.collection(userPermCol).deleteOneAsync(filter).then(function(result){
            results.error_code = 0;
            results.error_msg = "用户权限删除信息成功！";
            if(opts.dbs.permsHashObj.userPermHash["UP" + userPerm.userId] && opts.dbs.permsHashObj.userPermHash["UP" + userPerm.userId].perms){
                var perms = [];
                _.each(opts.dbs.permsHashObj.userPermHash["UP" + userPerm.userId].perms, function (perm) {
                    if ("P"+perm.permXh != opts.userPerm.permXh) {
                        perms.push(perm);
                    }
                });
                opts.dbs.permsHashObj.userPermHash["UP" + userPerm.userId].perms = perms;
            }
            return results;
        });
    }
};

/**
 * 给角色添加/删除权限
 * @param opts
 */
exports.rolePermsAssignmentAsync = function(opts){
    var results = {error_code: -1, error_msg: "error"};
    var bbPromise = opts.dbs.bbpromise;
    var join = bbPromise.join;
    var authDb = opts.dbs[dbConfig["mongodb"]["dbName"]];
    var rolePermCol = dbConfig["mongodb"]["tables"]["rolePerm"];
    var permObj = opts.dbs.permsHashObj.permListHash["P"+opts.rolePerm.permXh];
    var rolePerm = permObj;
    rolePerm.roleXh = opts.rolePerm.roleXh;
    var filter = {roleXh: opts.rolePerm.roleXh, permXh: opts.rolePerm.permXh};
    if (opts.rolePerm.assignmentType == 0) {
        return authDb.collection(rolePermCol).updateOneAsync(filter,{$set:rolePerm},{upsert:true}).then(function(result){
            results.error_code = 0;
            results.error_msg = "角色添加权限信息成功！";
            if(!opts.dbs.permsHashObj.rolePermHash["RP" + rolePerm.roleXh]){
                opts.dbs.permsHashObj.rolePermHash["RP" + rolePerm.roleXh] = {};
                opts.dbs.permsHashObj.rolePermHash["RP" + rolePerm.roleXh].perms = [];
            }
            if(result.upsertedCount){
                opts.dbs.permsHashObj.rolePermHash["RP" + rolePerm.roleXh].perms.push(rolePerm);
            }
            console.log(JSON.stringify(opts.dbs.permsHashObj.rolePermHash["RP" + rolePerm.roleXh].perms));
            return results;
        });
    }else{
        return authDb.collection(rolePermCol).deleteOneAsync(filter).then(function(result){
            results.error_code = 0;
            results.error_msg = "角色权限删除信息成功！";
            if(opts.dbs.permsHashObj.rolePermHash["RP" + rolePerm.roleXh] && opts.dbs.permsHashObj.rolePermHash["RP" + rolePerm.roleXh].perms){
                var perms = [];
                _.each(opts.dbs.permsHashObj.rolePermHash["RP" + rolePerm.roleXh].perms, function (perm) {
                    if ("P"+perm.permXh != opts.rolePerm.permXh) {
                        perms.push(perm);
                    }
                });
                opts.dbs.permsHashObj.rolePermHash["RP" + rolePerm.roleXh].perms = perms;
            }
            return results;
        });
    }
};

/**
 * 给用户添加/删除角色(适用于即使保存)
 * @param opts
 */
exports.userRoleAssignmentAsync = function (opts) {
    var results = {error_code: -1, error_msg: "error"};
    var bbPromise = opts.dbs.bbpromise;
    var join = bbPromise.join;
    var authDb = opts.dbs[dbConfig["mongodb"]["dbName"]];
    var userRoleCol = dbConfig["mongodb"]["tables"]["userRole"];
    var filter = {userId: opts.userRole.userId, roleXh: opts.userRole.roleXh};
    if (opts.userRole.assignmentType == 0) {
        return authDb.collection(userRoleCol).updateOneAsync(filter, {
            $set: {
                userId: opts.userRole.userId,
                roleXh: opts.userRole.roleXh
            }
        }, {upsert: true}).then(function (result) {
            results.error_code = 0;
            results.error_msg = "用户添加角色信息成功！";
            if (!opts.dbs.permsHashObj.userRoleHash["UR" + opts.userRole.userId]) {
                opts.dbs.permsHashObj.userRoleHash["UR" + opts.userRole.userId] = {};
                opts.dbs.permsHashObj.userRoleHash["UR" + opts.userRole.userId].roles = [];
            }
            ;
            if(result.upsertedCount){
                opts.dbs.permsHashObj.userRoleHash["UR" + opts.userRole.userId].roles.push(opts.userRole.roleXh);
            }

            console.log(JSON.stringify(opts.dbs.permsHashObj.userRoleHash["UR" + opts.userRole.userId].roles));
            return results;
        });
    } else {
        return authDb.collection(userRoleCol).deleteOneAsync(filter).then(function () {
            results.error_code = 0;
            results.error_msg = "用户删除角色信息成功！";
            if (opts.dbs.permsHashObj.userRoleHash["UR" + opts.userRole.userId] && opts.dbs.permsHashObj.userRoleHash["UR" + opts.userRole.userId].roles) {
                var roles = [];
                _.each(opts.dbs.permsHashObj.userRoleHash["UR" + opts.userRole.userId].roles, function (roleId) {
                    if (roleId != opts.userRole.roleXh) {
                        roles.push(roleId);
                    }
                });
                opts.dbs.permsHashObj.userRoleHash["UR" + opts.userRole.userId].roles = roles;
            }
            if(opts.dbs.permsHashObj.userRoleHash["UR" + opts.userRole.userId]){
                console.log(JSON.stringify(opts.dbs.permsHashObj.userRoleHash["UR" + opts.userRole.userId].roles));
            }
            return results;
        });
    }
};
