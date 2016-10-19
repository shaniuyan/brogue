/**
 * Created by wk on 2016/10/17.
 */
var _ = require('lodash');
var shopManagementModel = require("./shopManagement.model");
/**
 * 商铺名称
 * 打开或者创建时间
 * 地址
 * 经营项目
 * 法人
 * 执照编号
 * 备注
 * shopuuid
 * secret
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.addOrOpenShop = function(req,res,next){
    var param = _.extend(req.query, req.body);
    var body = {};
    body.response_params = {};
    var opts = {shop:{}};
    opts.shop.shopSC = "";
    opts.shop.shopName = param.shopName||"";
    opts.shop.createTime = new Date().getTime();
    opts.shop.address = param.address||"";
    opts.shop.businessProject = param.businessProject||"";
    opts.shop.legalPerson = param.legalPerson||"";
    opts.shop.legalPersonId = param.legalPersonId || -1;
    opts.shop.licenseNumber = param.licenseNumber;
    opts.shop.remark = param.remark || "";
    opts.shop.managers = param.managers || "";
    opts.shop.managersId = param.managersId || "";
    return shopManagementModel.addOrOpenShopAsync(opts).then(function(result){
        body.error_code = result.error_code;
        body.error_msg = result.error_msg;
        body.response_params.data = result.data;
        res.status(200).json(body);
    });
}