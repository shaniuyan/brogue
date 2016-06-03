/**
 * Created by wk on 2016/5/15.
 */
var supermarket = require("../../../data/supermarket.json");
/**
 * @param req
 * @param res
 * @param next
 */
exports.businessModulesAsync = function(opts){
    var results = {error_code: 0, error_msg: "获取商铺模块信息成功！"};

    results.data = supermarket;
    results.total = supermarket.length;
    return results;
}