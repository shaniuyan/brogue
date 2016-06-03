/**
 * Created by chengdi on 2015/5/7.
 */
var bbPromise = require("bluebird");
var MongoDB = bbPromise.promisifyAll(require("mongodb"));
var MongoClient = bbPromise.promisifyAll(MongoDB.MongoClient);

var redis = require('redis');
bbPromise.promisifyAll(redis.RedisClient.prototype);
bbPromise.promisifyAll(redis.Multi.prototype);

var authConfigs = require("./api/auth/datasource/dbConfig");
var _ = require("lodash");


var dbs = {};
var dbUrl;
dbs.bbpromise = bbPromise;

//如果权限系统数据源配置文中权限配置为启用且配置数据类型为mongodb
if (authConfigs["enable"] == true && authConfigs["enableDatabaseType"] == "mongodb") {
    var mongodbBackstage = require("./api/auth/datasource/mongodbBackstage");
    dbUrl = 'mongodb://' + authConfigs["mongodb"]["server"] + ':'
        + authConfigs["mongodb"]["port"].toString() + '/' + authConfigs["mongodb"]["dbName"];
    var authorityOptions = {
        db: {},
        server: {poolSize: 5, auto_reconnect: true},
        replSet: {},
        mongos: {}
    };
    //初始化权限数据库连接
    MongoClient.connect(dbUrl, authorityOptions, function (err, database) {
        if (err) throw err;
        dbs[authConfigs["mongodb"]["dbName"]] = database;
        console.info(dbUrl + " open OK " + authConfigs["mongodb"]["dbName"] + " 权限系统连接成功！");
        var opts = {
            dbs: dbs
        };
        //缓存权限的基本数据
        mongodbBackstage.initAuthDataAsync(opts).then(function (result) {
            if (result.error_code == 0) {
                dbs.permsHashObj = {
                    permHash: {},
                    permListHash: {},
                    roleHash: {},
                    userPermHash: {},
                    rolePermHash: {},
                    userRoleHash: {}
                };
                var permsHashObj = result.data;
                if (typeof permsHashObj.perms != "string") {
                    _.each(permsHashObj.perms, function (perm) {
                        if (perm.permUrl != "" && !dbs.permsHashObj.permHash[perm.permUrl]) {
                            dbs.permsHashObj.permHash[perm.permUrl] = perm;
                        }
                        dbs.permsHashObj.permListHash["P" + perm.permXh] = perm;
                    });
                }
                if (typeof permsHashObj.roles != "string") {
                    _.each(permsHashObj.roles, function (role) {
                        dbs.permsHashObj.roleHash["R" + role.roleXh] = role;
                    });
                }
                if (typeof permsHashObj.userPerms != "string") {
                    _.each(permsHashObj.userPerms, function (userPerm) {
                        if (!dbs.permsHashObj.userPermHash["UP" + userPerm.userId]) {
                            dbs.permsHashObj.userPermHash["UP" + userPerm.userId] = {};
                            dbs.permsHashObj.userPermHash["UP" + userPerm.userId].perms = [];
                        }
                        dbs.permsHashObj.userPermHash["UP" + userPerm.userId].perms.push(userPerm);
                    });
                }
                if (typeof permsHashObj.rolePerms != "string") {
                    _.each(permsHashObj.rolePerms, function (rolePerm) {
                        if (!dbs.permsHashObj.rolePermHash["RP" + rolePerm.roleXh]) {
                            dbs.permsHashObj.rolePermHash["RP" + rolePerm.roleXh] = {};
                            dbs.permsHashObj.rolePermHash["RP" + rolePerm.roleXh].perms = [];
                        }
                        dbs.permsHashObj.rolePermHash["RP" + rolePerm.roleXh].perms.push(rolePerm);
                    });
                }
                if (typeof permsHashObj.userRoles != "string") {
                    _.each(permsHashObj.userRoles, function (userRole) {
                        if (!dbs.permsHashObj.userRoleHash["UR" + userRole.userId]) {
                            dbs.permsHashObj.userRoleHash["UR" + userRole.userId] = {};
                            dbs.permsHashObj.userRoleHash["UR" + userRole.userId].roles = [];
                        }
                        dbs.permsHashObj.userRoleHash["UR" + userRole.userId].roles.push(userRole.roleXh);
                    });
                }
                var permStr = JSON.stringify(dbs.permsHashObj);
                console.log(permStr);
            }
        });
    });
}
module.exports = dbs;