/**
 * Created by wk 2015年6月10日 09:20:38
 */
define(["app", "bootstrapmodel", "apps/back_shop/mainpage/wholemanagementlist/layout/layout.view",
    "apps/back_shop/mainpage/wholemanagementlist/list/list.view",
    "apps/back_shop/entity/wholesalemanagement.entities"], function (BrogueApplication, bootstrapModel, LayoutView, ListView) {
    BrogueApplication.module("BrogueApp.BackShop.MainPage.WholeManagementList", function (SalesManagementController, BrogueApplication, Backbone, Marionette, $, _) {
        SalesManagementController.Controller = {
            showSaleManagementList:function(xobject){
                var that = this;
                var layoutView = new LayoutView.SalesManagementListLayout({xevent:xobject});
                var fetchwholemanagements = BrogueApplication.request("wholesalemanagement:entities",xobject.param);
                $.when(fetchwholemanagements).done(function (wholesalemanagements) {
                    that.purchasingmanagementListView = new ListView.Table({collection:wholesalemanagements,xevent:xobject,childViewOptions: {xevent: xobject}});
                    layoutView.settlementRegion.show(that.purchasingmanagementListView);
                });
                BrogueApplication.dialogRegion.show(layoutView,{title:"批发列表",height:500,width:920});


                xobject.on("salesmanagement:list",function(){
                    var fetchwholemanagements = BrogueApplication.request("wholesalemanagement:entities",xobject.param);
                    $.when(fetchwholemanagements).done(function (wholesalemanagements) {
                        that.purchasingmanagementListView.collection =  wholesalemanagements;
                        that.purchasingmanagementListView.render();
                    });
                });
            }
        };
    });
    return BrogueApplication.BrogueApp.BackShop.MainPage.WholeManagementList.Controller;
});
