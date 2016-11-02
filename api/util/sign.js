/**
 * Created by wk on 2016/10/28.
 */


var crypto = require('crypto');

function apiUrlencode(string) {
    string += '';
    return encodeURIComponent(string)
        .replace(/!/g, '%21')
        .replace(/'/g, '%27')
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29')
        .replace(/\*/g, '%2A')
        .replace(/%20/g, '+');
}


exports.apiGenSign = function (method, url, params, secretKey) {
    var baseString = method + url;
    var keys = Object.keys(params).sort();
    for (var i = 0; i < keys.length; i++) {
        if (keys[i] !== 'sign') {
            baseString += (keys[i] + '=' + params[keys[i]]);
        }
    }
    baseString += secretKey;
    var encodeString = apiUrlencode(baseString);
    var md5sum = crypto.createHash('md5');

    md5sum.update(encodeString);
    var sign = md5sum.digest('hex');
    return sign;
};