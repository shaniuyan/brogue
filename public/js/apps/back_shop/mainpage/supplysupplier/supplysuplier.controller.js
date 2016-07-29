/**
 * Created by wk 2015年6月10日 09:20:38
 */
define(["app","apps/back_shop/mainpage/supplysupplier/layout/layout.view",
                "apps/back_shop/mainpage/supplysupplier/list/table.view"], function (BrogueApplication,LayoutView, View) {
  BrogueApplication.module("BrogueApp.BackShop.MainPage.SupplySupplier", function (NavController, BrogueApplication, Backbone, Marionette, $, _) {
    NavController.Controller = {
      showSupplySuplierList: function (Region, xobject) {
        var that = this;
        that.xobject = xobject;

        var layoutView = new LayoutView.Main();
        Region.show(layoutView);

        require(["apps/back_shop/entity/supplysupplier.entities"], function () {
          var modularList = BrogueApplication.request("supplysupplier:entities");
          var view = new View.Table({
            collection: modularList,
            xevent: xobject
          });
          layoutView.supplySupplierListRegion.show(view);
        });
      }
    };
  });
  return BrogueApplication.BrogueApp.BackShop.MainPage.SupplySupplier.Controller;
});
