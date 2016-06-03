'use strict';
/**
 * Created by wk on 2016/3/10.
 * @des
 */
var request = require("request");
var strUtil = require("./StrUtil");
var moment = require("moment");
var request = require('request');

function HttpUtil(options) {
    var self = this;
    self.baseUrl = options.baseUrl;
    self.accountSid = options.accountSid;
    self.authToken = options.authToken;
    self.ytxVersion = options.ytxVersion;
};
HttpUtil.prototype.request = function (opt, cb) {
    var self = this;
    var timestamp = new moment().format("YYYYMMDDHHmmss");
    var sig = strUtil.getMd5Str(self.accountSid + self.authToken + timestamp).toUpperCase();
    var baseStr = self.accountSid + ':' + timestamp;
    var b = new Buffer(baseStr);
    var auth = b.toString('base64');
    var options = {
        url: self["baseUrl"] + "/" + self["ytxVersion"] + "/Accounts/" + self["accountSid"] + "/" + opt["func"] + "?sig=" + sig,
        headers: {
            Accept: opt["Aeecpt"],
            "Content-Type": opt["Content-Type"],
            Authorization: auth
        }
    };

    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var bodyObj = JSON.parse(body);

            cb && cb(null,bodyObj);
        }
    }

    request(options, callback);
};

var httpUtil = new HttpUtil({
    baseUrl: "https://sandboxapp.cloopen.com:8883",
    accountSid: "8a48b5514e3e5862014e4397aaaf0512",
    authToken: "d912d8a8a94e4ba3aa7754f5054971dc",
    ytxVersion: "2013-12-26"
});
var opt = {
    func: "AccountInfo",
    "Aeecpt": "application/json",
    "Content-Type": "application/json;charset=utf-8"
};
httpUtil.request(opt, function (err,result) {
    console.log(result);
});
//module.exports = HttpUtil;