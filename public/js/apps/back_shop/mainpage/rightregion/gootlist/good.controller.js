/**
 * Created by wk 2015年6月10日 09:20:38
 */
define(["app", "apps/back_shop/mainpage/rightregion/gootlist/good.view"], function (BrogueApplication, GoodList) {
  BrogueApplication.module("BrogueApp.BackShop.MainPage.GoodList", function (GoodListController, BrogueApplication, Backbone, Marionette, $, _) {
    GoodListController.Controller = {
      showGoodList: function (Region) {
        var goodListView = new GoodList.View();
        Region.show(goodListView);
      }
    };
  });
  return BrogueApplication.BrogueApp.BackShop.MainPage.GoodList.Controller;
});
