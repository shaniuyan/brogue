/**
 * Created by wk 2015年6月10日 09:20:38
 */
define(["app","apps/back_shop/mainpage/wholesale/layout/layout.view"], function (BrogueApplication,LayoutView) {
  BrogueApplication.module("BrogueApp.BackShop.MainPage.Wholesale", function (NavController, BrogueApplication, Backbone, Marionette, $, _) {
    NavController.Controller = {
      showWholesalePage: function (Region, xobject) {
        var that = this;
        that.xobject = new Marionette.Object();
        var layoutView = new LayoutView.Wholesale({xevent:that.xobject});
        Region.show(layoutView);

        that.xobject.on("wholesale:add",function(opt){

          require(["apps/back_shop/mainpage/wholesale/mainform/mainform.view"],function(FormView){
            var form = new FormView.Form({xevent:that.xobject,});
            BrogueApplication.dialogRegion.show(form,{dialogopts:{title:"添加批发单",width:600}});
          });
        });
      }
    };
  });
  return BrogueApplication.BrogueApp.BackShop.MainPage.Wholesale.Controller;
});
