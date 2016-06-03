var _ = require("lodash");

Auth = function (options) {

};

/**
 * 权限的入口
 * @des 系统中如果想要启动权限管理模块必须配置到路由中
 * @param req
 * @param res
 * @param next
 */
Auth.prototype.main = function (req, res, next) {
    var param = _.extend(req.query, req.body);
    var body = {};
    var opts = {perms: {}};
    opts.dbs = req.dbs;
    opts.configs = req.configs;
    body.response_params = {};
    var apiUrl = req.url.substr(0,req.url.indexOf(".json")+5);

    var userId = parseInt(param.userId);
    //1、检查权限列表中是否对该操作进行管理
    var isAuthorized = req.dbs.permsHashObj.permHash[apiUrl];
    if (!isAuthorized) {
        next();
    } else {
        if ((roleIsAccess(req,userId,apiUrl) || userIsAccess(req,userId,apiUrl))) {
            if(isAuthorized.isBrowsing){
                body.error_code = 3001;
                body.error_msg = "功能尚未实现";
                res.status(200).json(body);
            }else{
                next();
            }
        }else {
            body.error_code = 4001;
            body.error_msg = "用户访问被拒绝";
            res.status(200).json(body);
        }
    }
};

/**
 * 相关角色是否可以访问
 * @param req
 * @returns {boolean}
 */
var roleIsAccess = function(req,userId,apiUrl){
    var userRoleHash = req.dbs.permsHashObj.userRoleHash["UR" + userId];
    var isRolePerm =false;
    if(userRoleHash && userRoleHash.roles){
        _.each(userRoleHash.roles,function(roleXh){
            if(req.dbs.permsHashObj.rolePermHash["RP" + roleXh]){
                var perms = req.dbs.permsHashObj.rolePermHash["RP" + roleXh].perms;
                _.each(perms,function(perm){
                    if(perm.permUrl == apiUrl){
                        isRolePerm=true;
                        console.log("相关角色可以访问");
                    }
                })
            }
        });
    }
    return isRolePerm;
};

var userIsAccess = function(req,userId,apiUrl){
    var userPerm = req.dbs.permsHashObj.userPermHash["UP" + userId];
    var isUserPerm = false;
    if(userPerm && userPerm.perms){
        _.each(userPerm.perms,function(userPerm){
            if(userPerm.permUrl == apiUrl){
                isUserPerm=true;
                console.log("相关用户可以访问");
            }
        });
    }
    return isUserPerm;
};

exports.Auth = Auth;