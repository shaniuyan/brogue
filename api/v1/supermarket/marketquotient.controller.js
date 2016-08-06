/**
 * Created by wk on 2016/7/18.
 */
var _ = require("lodash");

var marketQuotientModel = require("./marketquotient.model");

exports.marketQuotient = function(req,res,next){
    var param = _.extend(req.query, req.body);
    var body = {};
    body.response_params = {};
    var opts = {good:{},page:{},configs:{}};
    opts.configs = req.configs;
    opts.mysqldbs = req.mysqldbs;
    opts.page.pageIndex = param.pageIndex;
    opts.page.pageSize = param.pageSize;
    return marketQuotientModel.marketQuotientAsync(opts).then(function(result){
        body.error_code = result.error_code;
        body.error_msg = result.error_msg;
        body.response_params = result.data;
        res.status(200).json(body);
    });
};

exports.addMarketQuotient = function(req,res,next){
    var param = _.extend(req.query, req.body);
    var body = {};
    body.response_params = {};
    var opts = {marketQuotient:{},configs:{}};
    opts.configs = req.configs;
    opts.mysqldbs = req.mysqldbs;
    opts.marketQuotient.companyCode = '';
    opts.marketQuotient.companyName = param.companyName;
    opts.marketQuotient.linkMan = param.linkMan;
    opts.marketQuotient.tel = param.tel;
    opts.marketQuotient.phone = param.phone;
    opts.marketQuotient.currentaccount = param.currentaccount;
    opts.marketQuotient.buildtime = param.buildtime;
    opts.marketQuotient.isimportant = param.isimportant;
    return marketQuotientModel.addMarketQuotientAsync(opts).then(function(result){
        body.error_code = result.error_code;
        body.error_msg = result.error_msg;
        res.status(200).json(body);
    });
};