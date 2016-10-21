/**
 * Created by wk on 2016/10/21.
 */
var path = require('path');
var moduleModel =require('./module.model');
var _ = require('lodash');

/**
 * 添加系统模块
 * 模块名称
 * 简写
 * 显示字符
 * 显示图片
 * 显示类型
 * 是否启用
 * 链接类型
 * 链接路径
 * android 链接路径
 * ios 链接路径
 * 创建日期
 * 创建人
 * 授权使用数
 * @param req
 * @param res
 * @param next
 */
exports.addModule = function(req,res,next){
    var param = _.extend(req.query, req.body);
    var body = {};
    body.response_params = {};
    var opts = {module:{}};
    opts.module.moduleMC = "";                                        //模块编号
    opts.module.moduleName = param.moduleName||"";                  //模块名称
    opts.module.shorthand = param.shorthand||"";                    //简写
    opts.module.displayCharacter = param.displayCharacter||"";    //显示字符
    opts.module.displayPicture = param.displayPicture||"";         //显示图片
    opts.module.whetherToEnable = param.whetherToEnable||0;        //是否启用
    opts.module.linkType = param.linkType || 0;                      //链接类型
    opts.module.linkPath = param.linkPath || "";                     //链接路径
    opts.module.linkPath_android = param.linkPath_android || "";   //链接路径android
    opts.module.linkPath_ios = param.linkPath_ios || "";            //链接路径ios
    opts.module.createTime = param.createTime || "";                 //创建时间
    opts.module.byUserId = param.byUserId || "0";                     //创建用户id
    opts.module.byUser = param.byUser || "平台管理员";                //创建用户

    return moduleModel.addModuleAsync(opts).then(function(result){
        body.error_code = result.error_code;
        body.error_msg = result.error_msg;
        body.response_params = result.data;
        res.status(200).json(body);
    });
};