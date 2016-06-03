/**
 * Created by wk on 2016/2/29.
 */
var authConfigs = require("../datasource/dbConfig");
var _ = require("lodash");

var dataSource = null;
if (authConfigs["enable"] == true) {
    if(authConfigs["enableDatabaseType"] == "mongodb"){
        dataSource = require("../datasource/mongodbBackstage");
    }
}
/**
 * 添加系统模块信息
 * @param req
 * @param res
 * @param next
 */
exports.addPerm = function(req,res,next){
    var body = {};
    req.validate('permXh', 'permXh不能为空且必须为数字').notEmpty().isInt();
    req.validate('permName', 'permName不能为空').notEmpty();
    req.validate('level', 'permXh不能为空且必须为数字').notEmpty().isInt();
    req.validate('parentPermXh', 'permXh不能为空且必须为数字').notEmpty().isInt();
    req.validate('isParent', 'isParent不能为空且').notEmpty().isIn([true,false]);
    req.validate('orderNo', 'orderNo不能为空且必须为数字').notEmpty().isInt();
    var errors = req.validationErrors();
    if (errors) {
        body.error_code = 20000;
        body.error_msg = errors;
        res.status(200).json(body);
        return;
    }

    var param = _.extend(req.query, req.body);
    var opts = {perms:{}};
    opts.dbs = req.dbs;
    opts.configs = req.configs;
    body.response_params = {};

    opts.perms.permXh = parseInt(param.permXh);
    opts.perms.permName = param.permName;
    opts.perms.permUrl = param.permUrl||"";
    opts.perms.level = parseInt(param.level);
    opts.perms.parentPermXh = parseInt(param.parentPermXh);
    opts.perms.isParent = Boolean(param.isParent);
    opts.perms.orderNo = parseInt(param.orderNo);

    return dataSource.addPermAsync(opts).then(function(result){
        body.error_code = result.error_code;
        body.error_msg = result.error_msg;
        res.status(200).json(body);
    });
};

/**
 * 删除权限信息
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.delPerm = function(req,res,next){
    var body = {};
    req.validate('permXh', 'permXh不能为空且必须为数字').notEmpty().isInt();
    var errors = req.validationErrors();
    if (errors) {
        body.error_code = 20000;
        body.error_msg = errors;
        res.status(200).json(body);
        return;
    }

    var param = _.extend(req.query, req.body);
    var opts = {perms:{}};
    opts.dbs = req.dbs;
    opts.configs = req.configs;
    body.response_params = {};

    opts.perms.permXh = parseInt(param.permXh);
    return dataSource.delPermAsync(opts).then(function(result){
        body.error_code = result.error_code;
        body.error_msg = result.error_msg;
        res.status(200).json(body);
    });
};

/**
 * 修改权限信息
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.updPerm = function(req,res,next){
    var body = {};
    req.validate('permXh', 'permXh不能为空且必须为数字').notEmpty().isInt();
    req.validate('permName', 'permName不能为空').notEmpty();
    req.validate('level', 'permXh不能为空且必须为数字').notEmpty().isInt();
    req.validate('parentPermXh', 'permXh不能为空且必须为数字').notEmpty().isInt();
    req.validate('isParent', 'isParent不能为空且').notEmpty().isIn([true,false]);
    req.validate('orderNo', 'orderNo不能为空且必须为数字').notEmpty().isInt();
    var errors = req.validationErrors();
    if (errors) {
        body.error_code = 20000;
        body.error_msg = errors;
        res.status(200).json(body);
        return;
    }

    var param = _.extend(req.query, req.body);
    var opts = {perms:{}};
    opts.dbs = req.dbs;
    opts.configs = req.configs;
    body.response_params = {};

    opts.perms.permXh = parseInt(param.permXh);
    opts.perms.permName = param.permName;
    opts.perms.permUrl = param.permUrl||"";
    opts.perms.level = parseInt(param.level);
    opts.perms.parentPermXh = parseInt(param.parentPermXh);
    opts.perms.isParent = Boolean(param.isParent);
    opts.perms.orderNo = parseInt(param.orderNo);
    return dataSource.updPermAsync(opts).then(function(result){
        body.error_code = result.error_code;
        body.error_msg = result.error_msg;
        res.status(200).json(body);
    });
};

/**
 * 更具模块名称查询模块信息
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.queryPerm = function(req,res,next){
    var body = {};
    req.validate('permName', 'permName不能为空').notEmpty();
    req.validate('level', 'permXh不能为空且必须为数字').notEmpty().isInt();
    var errors = req.validationErrors();
    if (errors) {
        body.error_code = 20000;
        body.error_msg = errors;
        res.status(200).json(body);
        return;
    }

    var param = _.extend(req.query, req.body);
    var opts = {perms:{}};
    opts.dbs = req.dbs;
    opts.configs = req.configs;
    body.response_params = {};

    opts.perms.permName = param.permName;
    opts.perms.level = parseInt(param.level);
    return dataSource.queryPermAsync(opts).then(function(result){
        body.error_code = result.error_code;
        body.error_msg = result.error_msg;
        body.response_params.data = result.data;
        res.status(200).json(body);
    });
};
/**
 *给用户添加/删除权限
 * @param req
 * @param res
 * @param next
 */
exports.userPermsAssignment = function(req,res,next){
    var body = {};
    req.validate('permXh', 'permXh不能为空且必须为数字').notEmpty().isInt();
    req.validate('userId', 'userId不能为空且必须为数字').notEmpty().isInt();
    req.validate('assignmentType', 'assignmentType不能为空且必须为数字').notEmpty().isInt().isIn([0, 1]);
    var errors = req.validationErrors();
    if (errors) {
        body.error_code = 20000;
        body.error_msg = errors;
        res.status(200).json(body);
        return;
    };
    var param = _.extend(req.query, req.body);
    var opts = {userPerm:{}};
    opts.dbs = req.dbs;
    opts.configs = req.configs;
    body.response_params = {};
    opts.userPerm.permXh = parseInt(param.permXh);
    opts.userPerm.userId = parseInt(param.userId);
    opts.userPerm.assignmentType = parseInt(param.assignmentType);
    return dataSource.userPermsAssignmentAsync(opts).then(function(result){
        body.error_code = result.error_code;
        body.error_msg = result.error_msg;
        res.status(200).json(body);
    });
};
/**
 * 给角色添加/删除权限
 * @param req
 * @param res
 * @param next
 */
exports.rolePermsAssignment = function(req,res,next){
    var body = {};
    req.validate('permXh', 'permXh不能为空且必须为数字').notEmpty().isInt();
    req.validate('roleXh', 'roleXh不能为空且必须为数字').notEmpty().isInt();
    req.validate('assignmentType', 'assignmentType不能为空且必须为数字').notEmpty().isInt().isIn([0, 1]);
    var errors = req.validationErrors();
    if (errors) {
        body.error_code = 20000;
        body.error_msg = errors;
        res.status(200).json(body);
        return;
    };
    var param = _.extend(req.query, req.body);
    var opts = {rolePerm:{}};
    opts.dbs = req.dbs;
    opts.configs = req.configs;
    body.response_params = {};
    opts.rolePerm.permXh = parseInt(param.permXh);
    opts.rolePerm.roleXh = parseInt(param.roleXh);
    opts.rolePerm.assignmentType = parseInt(param.assignmentType);
    return dataSource.rolePermsAssignmentAsync(opts).then(function(result){
        body.error_code = result.error_code;
        body.error_msg = result.error_msg;
        res.status(200).json(body);
    });
};
/**
 * 给用户添加角色
 * @param req
 * @param res
 * @param next
 */
exports.userRoleAssignment = function(req,res,next){
    var body = {};
    req.validate('userId', 'userId不能为空且必须为数字').notEmpty().isInt();
    req.validate('roleXh', 'permXh不能为空且必须为数字').notEmpty().isInt();
    req.validate('assignmentType', 'assignmentType不能为空且必须为数字').notEmpty().isInt().isIn([0, 1]);
    var errors = req.validationErrors();
    if (errors) {
        body.error_code = 20000;
        body.error_msg = errors;
        res.status(200).json(body);
        return;
    };
    var param = _.extend(req.query, req.body);
    var opts = {userRole:{}};
    opts.dbs = req.dbs;
    opts.configs = req.configs;
    body.response_params = {};
    opts.userRole.userId = parseInt(param.userId);
    opts.userRole.roleXh = parseInt(param.roleXh);
    opts.userRole.assignmentType = parseInt(param.assignmentType);
    return dataSource.userRoleAssignmentAsync(opts).then(function(result){
        body.error_code = result.error_code;
        body.error_msg = result.error_msg;
        res.status(200).json(body);
    });
};