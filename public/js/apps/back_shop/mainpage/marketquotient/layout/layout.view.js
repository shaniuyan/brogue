/**
 * Created by wk on 2016/6/21.
 */
define(["app", "marionette", "tpl!apps/back_shop/mainpage/marketquotient/layout/layout.html"],
  function (BrogueApplication, Marionette, layoutTpl) {
    BrogueApplication.module("BrogueApp.BackShop.MainPage.MarketQuotientLayout", function (View, BrogueApplication, Backbone, Marionette, $, _) {
      View.Main = Marionette.LayoutView.extend({
        template: layoutTpl,
        regions: {
          supplySupplierListRegion: ".supplySupplierListRegion"
        }
      });
    });
    return BrogueApplication.BrogueApp.BackShop.MainPage.MarketQuotientLayout;
  });
