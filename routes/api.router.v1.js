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
//装箱
router.post("/supermarket/packing.json", apiV1.goods.packing);
//获取商品列表
router.get("/supermarket/goodlist.json", apiV1.goods.goodList);

//更新商品整件数量、零件数量、进价、售价、批发价信息
router.post("/supermarket/updgoodnum.json", apiV1.goods.updGoodNum);

router.post("/supermarket/addmarketquotient.json", apiV1.marketquotient.addMarketQuotient);
router.get("/supermarket/marketquotient.json", apiV1.marketquotient.marketQuotient);

router.post("/supermarket/addwholesale.json", apiV1.wholesale.addWholesale);
router.post("/supermarket/addwholesaledetails.json", apiV1.wholesale.addWholesaleDetails);
router.post("/supermarket/deletewholesaledetails.json", apiV1.wholesale.deleteWholesaleDetails);
router.post("/supermarket/updpaymenttotalamount.json", apiV1.wholesale.updPaymentTotalAmount);


router.get("/supermarket/purchasingmanagementlist.json", apiV1.purchasingmanagement.purchasingManagementList);
router.post("/supermarket/addpurchasingmanagement.json", apiV1.purchasingmanagement.addPurchasingManagement);
router.post("/supermarket/settlepurchasingmanagement.json", apiV1.purchasingmanagement.settlePurchasingManagement);


module.exports = router;