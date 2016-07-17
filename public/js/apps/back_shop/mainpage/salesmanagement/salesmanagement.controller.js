/**
 * Created by wk 2015年6月10日 09:20:38
 */
define(["app","bootstrapmodel","apps/back_shop/mainpage/salesmanagement/layout/layout.view"], function (BrogueApplication,bootstrapModel ,LayoutView) {
  BrogueApplication.module("BrogueApp.BackShop.MainPage.SalesManagement", function (SalesManagementController, BrogueApplication, Backbone, Marionette, $, _) {
    SalesManagementController.Controller = {
      showSalesManagement: function (Region, xobject) {
        var that = this;
        that.xobject = xobject;

        var layoutView = new LayoutView.SalesManagementLayout();
        Region.show(layoutView);
      }
    };
  });
  return BrogueApplication.BrogueApp.BackShop.MainPage.SalesManagement.Controller;
});
