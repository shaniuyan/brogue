/**
 * Created by wk 2015年6月10日 09:20:38
 */
define(["app","apps/back_shop/mainpage/marketquotient/layout/layout.view" ,
                "apps/back_shop/mainpage/marketquotient/list/table.view"], function (BrogueApplication,LayoutView, View) {
  BrogueApplication.module("BrogueApp.BackShop.MainPage.MarketQuotient", function (NavController, BrogueApplication, Backbone, Marionette, $, _) {
    NavController.Controller = {
      showMarketQuotientList: function (Region, xobject) {
        var that = this;
        that.xobject = new Marionette.Object();

        var layoutView = new LayoutView.Layout({xevent:that.xobject});
        Region.show(layoutView);

        require(["apps/back_shop/entity/marketquotient.entities"], function () {
          var fetchMarketQuotient = BrogueApplication.request("marketquotient:entities");

          $.when(fetchMarketQuotient).done(function (marketQuotients) {
            var view = new View.Table({
              collection: marketQuotients,
              xevent: xobject
            });
            layoutView.marketQuotientListRegion.show(view);
          });

          that.xobject.on("market:addMarketQuotient",function(){
            require(["apps/back_shop/mainpage/marketquotient/form/form.view"],function(FormView){
              var form = new FormView.Form();
              BrogueApplication.dialogRegion.show(form,{dialogopts:{title:"添加服务商",width:700}});
            });
          });
        });
      }
    };
  });
  return BrogueApplication.BrogueApp.BackShop.MainPage.MarketQuotient.Controller;
});
