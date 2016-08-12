/**
 * Created by wk on 2015/12/13.
 */
var express = require('express');
var router = express.Router();
var apiV1 = require("../api/v1");
router.post("/customer/login.json", apiV1.customer.login);
router.get("/customer/login.json", apiV1.customer.login);
router.get("/customer/userlist.json", apiV1.customer.getUserList);

router.get("/customer/userlistcs.json", apiV1.customer.userTestList);

router.get("/supermarket/businessmodules.json", apiV1.supermarket.businessModules);

//添加商品操作
router.post("/supermarket/addgood.json", apiV1.goods.addGood);
//商铺拆箱操作
router.post("/supermarket/unboxing.json", apiV1.goods.unboxing);

router.post("/supermarket/packing.json", apiV1.goods.packing);

router.get("/supermarket/goodlist.json", apiV1.goods.goodList);

router.post("/supermarket/addmarketquotient.json", apiV1.marketquotient.addMarketQuotient);
router.get("/supermarket/marketquotient.json", apiV1.marketquotient.marketQuotient);

router.post("/supermarket/addwholesale.json", apiV1.wholesale.addWholesale);
router.post("/supermarket/addwholesaledetails.json", apiV1.wholesale.addWholesaleDetails);
router.post("/supermarket/deletewholesaledetails.json", apiV1.wholesale.deleteWholesaleDetails);
router.post("/supermarket/updpaymenttotalamount.json", apiV1.wholesale.updPaymentTotalAmount);

router.get("/supermarket/lastwholesalenum.json", apiV1.wholesale.getLastWholesaleNum);
module.exports = router;