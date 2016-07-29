/**
 * Created by wk on 2016/6/21.
 */
define(["app"], function (BrogueApplication) {
  BrogueApplication.module("ShopBackApp", function (ShopBackApp, BrogueApplication, Backbone, Marionette, $, _) {
    ShopBackApp.startWithParent = false;
    ShopBackApp.onStart = function () {
      console.log("商铺后台加在开始...");
    };
    ShopBackApp.onStop = function () {
      console.log("商铺后台加在完成...");
    };
  });
  BrogueApplication.module("Routers.ShopBackApp", function (ShopBackAppRouter, BrogueApplication, Backbone, Marionette, $, _) {
    ShopBackAppRouter.Router = Marionette.AppRouter.extend({
      appRoutes: {
        "shoplogin":"shoplogin",
        "shophome":"shophome",
        "goodlist":"showgoodlist",
        "supplysupplierlist":"supplysupplierlist",
        "marketquotientlist":"marketquotientlist",
        "wholesalepage":"wholesalepage",
        "salesmanagementlist":"salesmanagementlist"
      }
    });
    var API = {
      shoplogin:function(){
        BrogueApplication.navigate("shoplogin");
        require(["apps/back_shop/login/login.controller"],function(LoginController){
          var region = BrogueApplication.bodyRegion;
          LoginController.showLogin(region);
        });
      },
      shophome:function(){
        BrogueApplication.navigate("shophome");
        require(["apps/back_shop/mainpage/main.controller"],function(MainController){
          var region = BrogueApplication.bodyRegion;
          MainController.showMain(region);
        });
      },
      showgoodlist:function(){
        BrogueApplication.navigate("goodlist");
        require(["apps/back_shop/mainpage/rightregion/good/good.controller"],function(GoodController){
          var region =BrogueApplication.rightRegion || BrogueApplication.bodyRegion;
          GoodController.showGoodList(region);
        });
      },
      supplysupplierlist:function(){
        BrogueApplication.navigate("supplysupplierlist");
        require(["apps/back_shop/mainpage/supplysupplier/supplysuplier.controller"],function(supplySuplierController){
          var region =BrogueApplication.rightRegion || BrogueApplication.bodyRegion;
          supplySuplierController.showSupplySuplierList(region);
        });
      },
      marketquotientlist:function(){
        BrogueApplication.navigate("marketquotientlist");
        require(["apps/back_shop/mainpage/marketquotient/marketquotient.controller"],function(marketQuotientController){
          var region =BrogueApplication.rightRegion || BrogueApplication.bodyRegion;
          marketQuotientController.showMarketQuotientList(region);
        });
      },
      wholesalepage:function(){
        BrogueApplication.navigate("wholesalepage");
        require(["apps/back_shop/mainpage/wholesale/wholesale.controller"],function(wholesaleController){
          var region =BrogueApplication.rightRegion || BrogueApplication.bodyRegion;
          wholesaleController.showWholesalePage(region);
        });
      },
      salesmanagementlist:function(){
        BrogueApplication.navigate("salesmanagementlist");
        require(["apps/back_shop/mainpage/salesmanagement/salesmanagement.controller"],function(salesManagementController){
          var region =BrogueApplication.rightRegion || BrogueApplication.bodyRegion;
          salesManagementController.showSalesManagement(region);
        });
      }
    };
    BrogueApplication.on("shopback:login",function(){
      API.shoplogin();
    });

    BrogueApplication.on("shopback:home",function(){
      API.shophome();
    });

    BrogueApplication.on("shopback:wholesale",function(){
      API.wholesalepage();
    });

    BrogueApplication.on("shopback:salesmanagement",function(){
      API.salesmanagementlist();
    });

    BrogueApplication.on("shopback:goodlist",function(){
      API.showgoodlist();
    });

    BrogueApplication.on("shopback:supplysupplierlist",function(){
      API.supplysupplierlist();
    });
    BrogueApplication.on("shopback:marketquotientlist",function(){
      API.marketquotientlist();
    });
    BrogueApplication.addInitializer(function () {
      new ShopBackAppRouter.Router({
        controller: API
      });
    });
  });
  return BrogueApplication.ShopBackAppRouter;
});
