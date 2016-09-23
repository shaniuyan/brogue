/**
 * Created by wk 2015年6月10日 09:20:38
 */
define(["app","apps/back_shop/mainpage/resources/layout/layout.view","uploadView"], function (BrogueApplication,LayoutView,UploadView) {
  BrogueApplication.module("BrogueApp.BackShop.MainPage.Resources", function (NavController, BrogueApplication, Backbone, Marionette, $, _) {
    NavController.Controller = {
      showResources: function (Region, xobject) {
        var that = this;
        that.xobject = new Marionette.Object();
        var layoutView = new LayoutView.Layout({xevent:that.xobject});
        Region.show(layoutView);

        var uploadView = new UploadView.UploadLayout();
        layoutView.imageRegion.show(uploadView);
      }
    };
  });
  return BrogueApplication.BrogueApp.BackShop.MainPage.Resources.Controller;
});
