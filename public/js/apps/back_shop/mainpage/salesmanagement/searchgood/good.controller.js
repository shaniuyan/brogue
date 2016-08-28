/**
 * Created by wk 2015年6月10日 09:20:38
 */
define(["app",
    "apps/back_shop/mainpage/salesmanagement/searchgood/layout/layout.view",
    "apps/back_shop/mainpage/salesmanagement/searchgood/list/list.view",
    "apps/back_shop/entity/good.entities"], function (BrogueApplication,LayoutView, ListView) {
    BrogueApplication.module("BrogueApp.BackShop.SalesManagement.GoodList", function (GoodListController, BrogueApplication, Backbone, Marionette, $, _) {
        GoodListController.Controller = {
            showGoodList: function (xobject) {
                var layoutView = new LayoutView.Layout();
                BrogueApplication.dialogRegion.show(layoutView,{title:"添加出售商品",height:400,width:820});
                var fetchGoods = BrogueApplication.request("good:entities");
                $.when(fetchGoods).done(function (goods) {
                    var goodListView = new ListView.Table({collection:goods,xevent:xobject,childViewOptions: {xevent: xobject}});
                    layoutView.goodListRegion.show(goodListView);
                    //layoutView.goodListRegion.show(goodTables);
                });
            }
        };
    });
    return BrogueApplication.BrogueApp.BackShop.SalesManagement.GoodList.Controller;
});
