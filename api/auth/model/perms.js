var Schema = require('mongoose').schema;
/**
 *
 * @type {Schema}
 */
var perms = new Schema({
    permXh: {type: Number, default: 1},
    permName: {type: String, default: "用户管理"},//模块名称、权限名称
    permUrl: {type: String, default: "/"},
    level: {type: Number, default: 0},
    parentPermXh: {type: Number, default: 0},
    isParent: {type: Boolean, default: true},
    orderNo: {type: Number, default: 1}
});
//角色
var roles = new Schema({
    roleXh: {type: Number, default: 1},
    roleName: {type: String, default: "管理员"},
    roleDes: {type: String, default: "管理员"},
    level: 0,
    parentRoleXh: {type: Number, default: null},
    isParent: {type: Boolean, default: true},
    orderNo: {type: Number, default: 1}
});

//用户角色权限
var userRole = new Schema({
    userId: {type: String, default: "1"},
    permXh: {type: Number, default: 1},
    userType: {type: Number, default: 1}
});

//用户权限
var userPerm = new Schema({

});
//角色权限
var rolePerm = new Schema({});