/**
 * Created by wk on 2015/12/13.
 */
var apiAuth = require('./auth/auth.controller');
exports.auth = new apiAuth.Auth();

exports.perm = require('./engine/perms.controller');