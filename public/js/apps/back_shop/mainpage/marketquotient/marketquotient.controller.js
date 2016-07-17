/**
 * Created by wk 2015年6月10日 09:20:38
 */
define(["app", "apps/back_shop/mainpage/marketquotient/list/table.view"], function (BrogueApplication, View) {
  BrogueApplication.module("BrogueApp.BackShop.MainPage.MarketQuotient", function (NavController, BrogueApplication, Backbone, Marionette, $, _) {
    NavController.Controller = {
      showMarketQuotientList: function (Region, xobject) {
        var that = this;
        that.xobject = xobject;
        require(["apps/back_shop/entity/marketquotient.entities"], function () {
          var modularList = BrogueApplication.request("marketquotient:entities");
          var view = new View.Table({
            collection: modularList,
            xevent: xobject
          });
          Region.show(view);
        });
      }
    };
  });
  return BrogueApplication.BrogueApp.BackShop.MainPage.MarketQuotient.Controller;
});
