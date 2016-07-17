/**
 * Created by wk 2015年6月10日 09:20:38
 */
define(["app", "apps/back_shop/mainpage/rightregion/good/layout/layout.view",
    "apps/back_shop/mainpage/rightregion/good/list/list.view",
    "apps/back_shop/entity/good.entities"], function (BrogueApplication, LayoutView, ListView) {
    BrogueApplication.module("BrogueApp.BackShop.MainPage.GoodList", function (GoodListController, BrogueApplication, Backbone, Marionette, $, _) {
        GoodListController.Controller = {
            showGoodList: function (Region) {
                var layoutView = new LayoutView.Layout();
                Region.show(layoutView);
                var fetchGoods = BrogueApplication.request("good:entities");
                $.when(fetchGoods).done(function (goods) {
                    var goodTables = new ListView.Table({collection:goods});
                    layoutView.goodListRegion.show(goodTables);
                });
            }
        };
    });
    return BrogueApplication.BrogueApp.BackShop.MainPage.GoodList.Controller;
});
