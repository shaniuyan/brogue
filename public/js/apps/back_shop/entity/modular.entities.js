define(["app", "json!apps/back_shop/data/moduls.json"], function (BrogueApplication, moduls) {
  BrogueApplication.module("Entities", function (Entities, BrogueApplication, Backbone, Marionette, $, _) {
    Entities.Modular = Backbone.Model.extend({
      initialize: function () {
        var childModuls = this.get("childModuls");
        if (childModuls) {
          this.childModuls = new Entities.ModularList(childModuls);
          this.unset("childModuls");
        }
      }
    });
    Entities.ModularList = Backbone.Collection.extend({
      model: Entities.Modular,
      initialize: function () {
      }
    });
    var modularList = function () {
      if (BrogueApplication.sysParams.dataDirection == "local") {
        Entities.modularList = new Entities.ModularList(moduls);
      } else if (BrogueApplication.sysParams.dataDirection == "service") {
        window.alert("尚未实现从服务端获取数据");
        return null;
      } else {
        window.alert("未知数据源");
        return null;
      }

    };
    var API = {
      getModularList: function () {
        if (Entities.modularList === undefined) {
          modularList();
        }
        return Entities.modularList;
      }
    };
    BrogueApplication.reqres.setHandler("back_modular:entities", function () {
      return API.getModularList();
    });
  });
});
