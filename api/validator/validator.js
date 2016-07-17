/**
 * Created by wk on 2016/7/12.
 */
var _ = require("lodash");
exports.validatorIntercept = function (req, res, next) {
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
            body.error_msg = errors;
            res.status(200).json(body);
            return;
        }
    }
    console.log("表单验证通过");
    next();
};