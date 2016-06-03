/**
 * Created by wk on 2016/3/10.
 */
var crypto = require("crypto");

exports.getMd5Str = function (str) {
    var md5sum = crypto.createHash('md5');
    md5sum.update(str);
    var sign = md5sum.digest('hex').toUpperCase();
    return sign;
};
