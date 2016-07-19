/**
 * Created by wk on 2016/7/12.
 */

var validator = require("./configs/validator");
var businessmapping = require("./configs/businessmapping");
var sysconfig = require("./configs/sysconfig");

var configs = {
    validator:validator,
    businessmapping:businessmapping,
    sysconfig:sysconfig
};

module.exports = configs;