define(["app", "json!apps/back_shop/data/marketquotient.json"], function (BrogueApplication, moduls) {
  BrogueApplication.module("Entities", function (Entities, BrogueApplication, Backbone, Marionette, $, _) {
    Entities.MarketQuotient = Backbone.Model.extend({
      initialize: function () {

      }
    });
    Entities.MarketQuotientList = Backbone.Collection.extend({
      model: Entities.MarketQuotient,
      initialize: function () {
      }
    });
    var marketquotientlist = function () {
      if (BrogueApplication.sysParams.dataDirection == "local") {
        Entities.marketquotientlist = new Entities.MarketQuotientList(moduls);
      } else if (BrogueApplication.sysParams.dataDirection == "service") {
        window.alert("尚未实现从服务端获取数据");
        return null;
      } else {
        window.alert("未知数据源");
        return null;
      }

    };
    var API = {
      getMarketQuotientList: function () {
        if (Entities.marketquotientlist === undefined) {
          marketquotientlist();
        }
        return Entities.marketquotientlist;
      }
    };
    BrogueApplication.reqres.setHandler("marketquotient:entities", function () {
      return API.getMarketQuotientList();
    });
  });
});
