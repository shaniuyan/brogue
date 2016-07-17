/**
 * Created by wk 2015年6月10日 09:20:38
 */
define(["app", "apps/back_shop/mainpage/salesmanagement/searchgoodlist/goodlist.view"], function (BrogueApplication, GoodList) {
  BrogueApplication.module("BrogueApp.BackShop.MainPage.SearchGoodList", function (GoodListController, BrogueApplication, Backbone, Marionette, $, _) {
    GoodListController.Controller = {
      showSearchGoodList: function () {
        var goodListView = new GoodList.View();
        BrogueApplication.dialogRegion.show(goodListView);
      }
    };
  });
  return BrogueApplication.BrogueApp.BackShop.MainPage.SearchGoodList.Controller;
});
