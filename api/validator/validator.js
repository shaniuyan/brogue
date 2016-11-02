/**
 * Created by wk on 2016/7/12.
 */
var _ = require("lodash");

var auth = require("../common/auth/auth.model");

var sign = require("../util/sign");

exports.validatorIntercept = function (req, res, next) {
    var param = _.extend(req.query, req.body);
    var opts = {configs: {},client:{}};
    opts.configs = req.configs;
    opts.mysqldbs = req.mysqldbs;
    opts.client.sessionId = param.sessionId||"";
    opts.client.accountNumber = param.accountNumber||"";
    return auth.validateClientAsync(opts).then(function(result){
        if(result.error_code == 0){
            var timestamp = param.timestamp;
            var curtimestamp = new Date().getTime();
            var timedifference = (curtimestamp-timestamp)/1000/60/60;
            //设置token有效时间为2小时
            /*if(timedifference>2){
                var body = {};
                body.response_params = {};
                body.error_code = 9999;
                body.error_msg = "请重新登录";
                body.response_params = {};
                res.status(200).json(body);
                return;
            }else{

            }*/


            var accountNumber = param.accountNumber;
            var token = param.token;

            var apiUrl = req.url.substr(0, req.url.indexOf(".json") + 5);
            console.log("开始进行表单验证");
            var businessmapping = req.configs.businessmapping;
            var validator = req.configs.validator;
            if (businessmapping[apiUrl]) {
                var validatorFields = businessmapping[apiUrl].split(".");
                var validators = null;
                _.each(validatorFields, function (field) {
                    validator = validator[field];
                });
                validators = validator;
                _.each(validators, function (validator) {
                    var valid = req.check(validator.field, validator.desc);
                    if (validator.noEmpty) {
                        valid.notEmpty();
                    }
                    if (!valid.lastError) {
                        valid = req.check(validator.field, validator.typedesc);
                        switch (validator.type) {
                            case "int":
                                valid.isInt();
                                break;
                            case "date":
                                valid.isDate();
                                break;
                            case "string":
                                valid.optional();
                                break;
                            case "number":
                                valid.isNumeric();
                                break;
                            case "email":
                                valid.isEmail();
                                break;
                            case "phone":
                                valid.isMobilePhone();
                                break;
                            default:
                                valid;
                                break;
                        }
                    }
                });
                var errors = req.validationErrors();
                if (errors) {
                    var body = {};
                    body.error_code = 20000;
                    body.error_msg = '录入错误';
                    body.response_params = errors;
                    console.log(JSON.stringify(body));
                    res.status(200).json(body);

                    return;
                }
            }
            console.log("表单验证通过");
            next();
        }else{
            var body = {};
            body.response_params = {};
            body.error_code = result.error_code;
            body.error_msg = result.error_msg;
            body.response_params = result.data;
            res.status(200).json(body);
        }
    });
};