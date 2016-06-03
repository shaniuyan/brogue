/**
 * 商铺基本信息维护的api
 */
var superMarketModel = require("./supermarket.model");

/**
 * 申请开通商铺
 * 1、提交商铺信息
 */

/**
 * 2、审批开通商铺（同意、拒绝）
 */

/**
 * 3、修改商铺信息
 */

/**
 * 4、商铺装饰（定制平台功能[可添可删]）
 */

/**
 * 5、员工管理
 */

/**
 * 6、商品管理（可以专人专售，也可他人代售[是否需要专人委托暂时管理？？？？？？？]）
 *    进货、售货、赊账
 */


/**
 * 获取商铺定制的功能模块列表
 * @param req
 * @param res
 * @param next
 */
exports.businessModules = function(req,res,next){
    var body = {response_params:{}};
    var opts = {};
    var moduls = superMarketModel.businessModulesAsync(opts);
    body.error_code = moduls.error_code;
    body.error_msg = moduls.error_msg;
    body.response_params.data = moduls.data;
    body.response_params.total = moduls.total;
    return res.status(200).json(body);
}