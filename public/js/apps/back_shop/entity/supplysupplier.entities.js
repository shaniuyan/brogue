define(["app", "json!apps/back_shop/data/supplysupplier.json"], function (BrogueApplication, moduls) {
  BrogueApplication.module("Entities", function (Entities, BrogueApplication, Backbone, Marionette, $, _) {
    Entities.SupplySupplier = Backbone.Model.extend({
      initialize: function () {

      }
    });
    Entities.SupplySupplierList = Backbone.Collection.extend({
      model: Entities.SupplySupplier,
      initialize: function () {
      }
    });
    var supplysupplierlist = function () {
      if (BrogueApplication.sysParams.dataDirection == "local") {
        Entities.supplysupplierlist = new Entities.SupplySupplierList(moduls);
      } else if (BrogueApplication.sysParams.dataDirection == "service") {
        window.alert("尚未实现从服务端获取数据");
        return null;
      } else {
        window.alert("未知数据源");
        return null;
      }

    };
    var API = {
      getSupplySupplierList: function () {
        if (Entities.supplysupplierlist === undefined) {
          supplysupplierlist();
        }
        return Entities.supplysupplierlist;
      }
    };
    BrogueApplication.reqres.setHandler("supplysupplier:entities", function () {
      return API.getSupplySupplierList();
    });
  });
});
