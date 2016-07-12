/**
 * Created by wk on 2016/7/12.
 */
var _ = require("lodash");
exports.validatorIntercept = function (req, res, next) {
    var apiUrl = req.url.substr(0, req.url.indexOf(".json") + 5);
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
            if(validator.noEmpty){
                req.check(validator.field, validator.desc).notEmpty();
            }else{
                switch (validator) {
                    case "int":
                        break;
                        req.check(validator.field, validator.desc).isInt();
                    case "date":
                        break;
                        req.check(validator.field, validator.desc).isDate();
                    case "string":
                        req.check(validator.field, validator.desc).optional();
                        break;
                    case "number":
                        req.check(validator.field, validator.desc).optional().isNumeric();
                        break;
                    case "email":
                        req.check(validator.field, validator.desc).optional().isEmail();
                        break;
                    case "phone":
                        req.check(validator.field, validator.desc).optional().isMobilePhone();
                        break;
                    default:
                        req.check(validator.field, validator.desc).optional();
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
    next();
};