/**
 * Created by wk 2015年6月10日 09:20:38
 */
define(["app","apps/back_shop/mainpage/sysmanager/user/layout/layout.view" ,
                "apps/back_shop/mainpage/sysmanager/user/list/table.view"], function (BrogueApplication,LayoutView, View) {
  BrogueApplication.module("BrogueApp.BackShop.MainPage.SysManager.User", function (NavController, BrogueApplication, Backbone, Marionette, $, _) {
    NavController.Controller = {
      showMarketQuotientList: function (Region, xobject) {
        var that = this;
        that.xobject = new Marionette.Object();

        var layoutView = new LayoutView.Layout({xevent:that.xobject});
        Region.show(layoutView);

      }
    };
  });
  return BrogueApplication.BrogueApp.BackShop.MainPage.SysManager.User.Controller;
});
