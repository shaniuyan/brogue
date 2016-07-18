/**
 * Created by wk 2015年6月10日 09:20:38
 */
define(["app","apps/back_shop/mainpage/marketquotient/layout/layout.view" ,
                "apps/back_shop/mainpage/marketquotient/list/table.view"], function (BrogueApplication,LayoutView, View) {
  BrogueApplication.module("BrogueApp.BackShop.MainPage.MarketQuotient", function (NavController, BrogueApplication, Backbone, Marionette, $, _) {
    NavController.Controller = {
      showMarketQuotientList: function (Region, xobject) {
        var that = this;
        that.xobject = xobject;

        var layoutView = new LayoutView.Layout();
        Region.show(layoutView);

        require(["apps/back_shop/entity/marketquotient.entities"], function () {
          var modularList = BrogueApplication.request("marketquotient:entities");
          var view = new View.Table({
            collection: modularList,
            xevent: xobject
          });
          layoutView.marketQuotientListRegion.show(view);
        });
      }
    };
  });
  return BrogueApplication.BrogueApp.BackShop.MainPage.MarketQuotient.Controller;
});
