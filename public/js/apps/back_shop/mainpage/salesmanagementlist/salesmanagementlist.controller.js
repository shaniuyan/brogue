/**
 * Created by wk 2015年6月10日 09:20:38
 */
define(["app", "bootstrapmodel", "apps/back_shop/mainpage/salesmanagementlist/layout/layout.view",
    "apps/back_shop/mainpage/salesmanagementlist/list/list.view",
    "apps/back_shop/entity/purchasingmanagement.entities"], function (BrogueApplication, bootstrapModel, LayoutView, ListView) {
    BrogueApplication.module("BrogueApp.BackShop.MainPage.SalesManagementList", function (SalesManagementController, BrogueApplication, Backbone, Marionette, $, _) {
        SalesManagementController.Controller = {
            showManagementList:function(xobject){
                var that = this;
                var layoutView = new LayoutView.SalesManagementListLayout({xevent:xobject});
                var fetchpurchasingmanagements = BrogueApplication.request("purchasingmanagement:entities",xobject.param);
                $.when(fetchpurchasingmanagements).done(function (purchasingmanagements) {
                    that.purchasingmanagementListView = new ListView.Table({collection:purchasingmanagements,xevent:xobject,childViewOptions: {xevent: xobject}});
                    layoutView.settlementRegion.show(that.purchasingmanagementListView);
                });
                BrogueApplication.dialogRegion.show(layoutView,{title:"出售列表",height:500,width:920});


                xobject.on("salesmanagement:list",function(){
                    var fetchpurchasingmanagements = BrogueApplication.request("purchasingmanagement:entities",xobject.param);
                    $.when(fetchpurchasingmanagements).done(function (purchasingmanagements) {
                        that.purchasingmanagementListView.collection =  purchasingmanagements;
                        that.purchasingmanagementListView.render();
                    });
                });
            }
        };
    });
    return BrogueApplication.BrogueApp.BackShop.MainPage.SalesManagementList.Controller;
});
