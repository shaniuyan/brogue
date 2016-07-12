/**
 * Created by wk on 2015/12/13.
 */
var express = require('express');
var router = express.Router();
var apiV1 = require("../api/v1");
router.post("/customer/login.json",apiV1.customer.login);
router.get("/customer/login.json",apiV1.customer.login);
router.get("/customer/userlist.json",apiV1.customer.getUserList);

router.get("/customer/userlistcs.json",apiV1.customer.userTestList);

router.get("/supermarket/businessmodules.json",apiV1.supermarket.businessModules);


router.get("/supermarket/addgood.json",apiV1.goods.addGood);
module.exports = router;