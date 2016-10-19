/**
 * Created by wk on 2015/12/13.
 */
exports.auth = require('./auth/auth.controller');

exports.customer = require('./customer/customer.controller');

exports.supermarket = require('./supermarket/supermarket.controller');

exports.manageuser = require('./customer/manageuser.controller');

exports.goods = require('./supermarket/goods.controller');

exports.marketquotient = require('./supermarket/marketquotient.controller');

exports.wholesale = require('./supermarket/wholesale.controller');

exports.purchasingmanagement = require('./supermarket/purchasingmanagement.controller');

exports.wholesalemanagement = require('./supermarket/wholesalemanagement.controller');


exports.filemanager = require('./resources/filemanager.controller');