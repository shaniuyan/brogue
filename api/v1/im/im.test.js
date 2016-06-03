/**
 * Created by wk on 2016/1/13.
 */
var request = require('request');
var moment = require('moment');
var http = require('http');
var assert = require('assert');
var crypto = require('crypto');


var errMsg = {
    INVALID_ARGS: 'Arguments error',
    INVALID_ACC_SID: 'Arguments error: invalid accountSid, type of accountSid must be String',
    INVALID_SUB_ACC_SID: 'Arguments error: invalid subAccountSid, type of subAccountSid must be String',
    INVALID_AUTH_TOKEN: 'Arguments error: invalid authToken, type of authToken must be String',
    INVALID_SUB_AUTH_TOKEN: 'Arguments error: invalid subaccount token, type of  subaccount token must be String',
    INVALID_MSG_TYPE: 'Arguments error: invalid msg_type, type of msg_type is 0 or 1'

}
var debug = true;
var must = ['appId', 'friendlyName'];
var path = '/{SoftVersion}/Accounts/{accountSid}/SubAccounts';

function checkOptions(options, must) {
    must.forEach(function (ele) {
        if (!options.hasOwnProperty(ele)) {
            var err = errMsg.INVALID_ARGS + ': ' + ele + ' is must';
            throw new Error(err);
        }
    });
    function checkType(type, condition) {
        for (var i = 0; i < condition.length; i++) {
            if (type === condition[i]) {
                return true
            }
        }
        return false;
    }

    /*   if (options['accountSid'] && !(typeof options['user_id'] === 'string' && options['user_id'].length <= 256)) {
     throw new Error(errMsg.INVALID_USER_ID);
     }
     */
    if (options['accountSid'] && !(typeof options['accountSid'] === 'string')) {
        throw new Error(errMsg.INVALID_ACC_SID);
    }
    if (options['subAccountSid'] && !(typeof options['subAccountSid'] === 'string')) {
        throw new Error(errMsg.INVALID_SUB_ACC_SID);
    }
    if (options['authToken'] && !(typeof options['authToken'] === 'string')) {
        throw new Error(errMsg.INVALID_AUTH_TOKEN);
    }
    if (options['token'] && !(typeof options['token'] === 'string')) {
        throw new Error(errMsg.INVALID_SUB_AUTH_TOKEN);
    }
    if (options['sid'] && !(typeof options['sid'] === 'string')) {
        throw new Error(errMsg.INVALID_SUB_ACC_SID);
    }
}

function getTimestamp() {
    // var date = moment(new Date());
    return moment().format('YYYYMMDDHHmmss');
}
function getSign(account, token, time) {
    var baseStr = account + token + time;


    //var encodeStr = encodeURIComponent(baseStr);
    //  var encodeStr = urlencode(baseStr);
    if (debug) {
        // console.log('getSign: base str = ' + baseStr + ', encode str = ' + encodeStr);
    }

    var md5sum = crypto.createHash('md5');
    md5sum.update(baseStr);

    var sign = md5sum.digest('hex').toUpperCase();

    return sign;
}
function getAuth(account, time) {
    var baseStr = account + ':' + time;


    //var encodeStr = encodeURIComponent(baseStr);
    // var encodeStr = urlencode(baseStr);
    if (debug) {
        //  console.log('getAuth: base str = ' + baseStr + ', encode str = ' + encodeStr);
    }
    var b = new Buffer(baseStr);
    var auth = b.toString('base64');


    // auth =auth.toUpperCase();

    return auth;
}

function IM(options) {
    var self = this;
    var opt = {
        softVersion: options.softVersion,
        appId: options.appId,
        accountSid: options.accountSid,
        authToken: options.authToken,
        baseUrl: options.baseUrl,
        timeout: options.timeout || 10000 // 10s
    }
    if (options) {
        for (var i in options) {
            if (options.hasOwnProperty(i)) {
                if (typeof options[i] === 'string') {
                    opt[i] = options[i];
                } else {
                    throw new Error('Invalid accountSid, authToken, softVersion,or  baseUrl')
                }
            }
        }
    }
    self.appId = opt.appId;
    self.accountSid = opt.accountSid;
    self.authToken = opt.authToken;
    self.baseUrl = opt.baseUrl;
    self.timeout = opt.timeout;
    self.softVersion = opt.softVersion;
    if (options.hasOwnProperty('agent')) {
        self.agent = options.agent;
    } else {
        var agent = new http.Agent();
        agent.maxSockets = 20;
        self.agent = agent;
    }
}

IM.prototype.request = function (bodyArgs, cb) {
    var self = this;

    var timeout = self.timeout;
    var softVersion = self.softVersion;
    var baseUrl=self.baseUrl;
    var path=bodyArgs.path;
    assert.ok(path);
    assert.ok(baseUrl);
    assert.ok(softVersion);
    if (!bodyArgs.method) {
        bodyArgs.method = 'POST';
    } else {
        bodyArgs.method = bodyArgs.method.toUpperCase();
    }
    var account;
    var token;
    if (/{accountSid}/i.test(path)) {
        account = self.accountSid;
        token = self.authToken;
    } else if (/{subAccountSid}/i.test(path)) {
        account = bodyArgs.sid;
        token = bodyArgs.token;
    }
    assert.ok(account);
    assert.ok(token);

    var time = getTimestamp();

    var authStr = getAuth(account, time);



    var url = baseUrl+path.replace(/{SoftVersion}/i, softVersion).replace(/{(sub)?accountSid}/i, account);

    var contentType;
    var accept;

    if (bodyArgs.format === 'JSON') {
        contentType = 'application/json;charset=utf-8';
        accept= 'application/json';
    } else  if (bodyArgs.format === 'XML') {
        contentType = 'application/xml;charset=utf-8';
        accept= 'application/xml';
    }
    var options = {
        method: bodyArgs.method,
        uri: url,
        followAllRedirects: true,
        rejectUnauthorized: false,
        headers: {
            //  'Accept': 'application/json',
            'Accept': accept,
            'Content-Type': contentType,
            //   'Content-Length': bodyStr.length,
            Authorization: authStr

        }
    };
    if (!bodyArgs.params) {
        bodyArgs.params = {}
    }

    if (bodyArgs.method === 'GET') {
        //  bodyArgs.params.appId = self.appId;
        options.qs = bodyArgs.params;
    } else {
        if (bodyArgs.format === 'JSON') {
            options.json = bodyArgs.params;
        } else {
            var builder = new xml2js.Builder({rootName :'Request'});
            var xml = builder.buildObject(bodyArgs.params).toString();
            options.body=xml;
        }
    }

    if (!options.qs) {
        options.qs = {}
    }

    options.qs.sig = getSign(account, token, time);

    //  console.log('bodyArgs  : ' + util.inspect(bodyArgs, true, null));
    //  console.log('options  : ' + util.inspect(options, true, null));


    request(options, function (error, response, body) {
        var errObj = null;
        if(error){
            errObj = new Error('yuntongxin error code: ' + '-100' +
            ', error msg: ' + error +
            ', request id: ' + '-100');
            cb && cb(errObj);
            return;
        }
        if(!response){
            errObj = new Error('yuntongxin error code: ' + '-200' +
            ', error msg: ' + 'no response' +
            ', request id: ' + '-200');
            cb && cb(errObj);
            return;
        }
        /*   if (debug) {
         console.log('status = ' + response.statusCode);
         console.log('response header = ');
         console.log(response.headers);
         console.log(' body = ');
         console.log(body);
         }
         */
        if (typeof body === 'string') {
            try {
                if(response.headers["content-type"]==='application/xml;charset=utf-8'){
                    var parser = new xml2js.Parser({normalizeTags:false,explicitArray :false});
                    //   body =  xml2js.parseString(body);
                    parser.parseString(body, function (err, result) {
                        if(err){
                            cb && cb(err);
                            return;
                        }
                        cb && cb(null, result.Response);
                    });
                }else{
                    body = JSON.parse(body);
                    cb && cb(null, body);
                }

            } catch (e) {
                cb && cb(e);
                return;
            }
        }else{
            cb && cb(null, body);
        }


    });

};
IM.prototype._exec = function (options, must, path, method, format, cb) {
    var self = this;
    var opt = {};
    if (typeof options === 'function' && arguments.length === 1) {
        cb = options;
        options = {}
    }

    if (!options) {
        options = {}
    }
    if (!method) {
        method = 'POST';
    }
    opt.params = {};
    for (var i in options) {
        if (options.hasOwnProperty(i)) {
            if (i === 'sid') {
                opt.sid = options[i];
            } else if (i === 'token') {
                opt.token = options[i];
            }
            else {
                opt.params[i] = options[i];
            }

        }
    }
    if (/\/ivr\//i.test(path)) {
        path = path.replace('{confid}', opt.params.confid);
    }


    checkOptions(opt.params, must);

    opt.path = path;
    opt.method = method;

    opt.format = format;

    this.request(opt, function (err, result) {
        if (err) {
            cb && cb(err);
            return;
        }
        cb && cb(null, result);
    });
};

IM.prototype.createSubAccount = function (options, cb) {

    var must = ['appId', 'friendlyName'];
    var path = '/{SoftVersion}/Accounts/{accountSid}/SubAccounts';
    // this._exec(options, must, path, cb);  //HPE_INVALID_CONSTANT
    this._exec(options, must, path, 'POST','JSON', cb);
};

IM.prototype.AccountInfo  = function(options,cb){
    var must =[];
    var path = '/{SoftVersion}/Accounts/{accountSid}/AccountInfo';
    this._exec(options, must, path, 'GET','JSON', cb);
}

var ytxOption = {
    baseUrl: 'https://sandboxapp.cloopen.com:8883',
    softVersion: '2013-12-26',
    accountSid: '8a48b5514e3e5862014e4397aaaf0512',
    authToken: 'd912d8a8a94e4ba3aa7754f5054971dc',
    appId: 'aaf98f895190515201519b20221c0b20',
    appToken:'0aede9137ae6d9d5b483eddb55419931'
};

var client = new IM(ytxOption);

var opts = {
    appId: ytxOption.appId,
    friendlyName: 'wkwkwkw'
};

client.AccountInfo(opts,function(err,result){
    console.log(result);
});