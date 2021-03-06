/**
 * Created by wk 2015年6月10日 09:20:38
 */
define(["app", "apps/back_shop/mainpage/leftregion/nav.view"], function (BrogueApplication, View) {
    BrogueApplication.module("BrogueApp.BackShop.MainPage.Left", function (NavController, BrogueApplication, Backbone, Marionette, $, _) {
        NavController.Controller = {
            showLeftPanel: function (Region, xobject) {
                var that = this;
                that.xobject = xobject;
                require(["apps/back_shop/entity/modular.entities"], function () {
                    var fetchmodularList = BrogueApplication.request("back_modular:entities");

                    $.when(fetchmodularList).done(function (modularList) {
                        var view = new View.UlCollection({
                            collection: modularList,
                            xevent: xobject,
                            childViewOptions: {xevent: xobject, childViewOptions: {xevent: xobject}}
                        });
                        Region.show(view);
                    });



                });
                xobject.on("module:itemclick", function (model) {
                    var code = model.get("moduleMC");
                    switch (code) {
                        case "MC100003":
                            BrogueApplication.trigger("shopback:wholesale");
                            break;
                        case "MC100002":
                            BrogueApplication.trigger("shopback:salesmanagement");
                            break;
                        case "1002002":
                            BrogueApplication.trigger("shopback:goodlist");
                            break;
                        case "1003001":
                            BrogueApplication.trigger("shopback:supplysupplierlist");
                            break;
                        case "1004000":
                            BrogueApplication.trigger("shopback:filemanage");
                            break;
                        case "1004001":
                            BrogueApplication.trigger("shopback:album");
                            break;
                        case "1003002":
                            BrogueApplication.trigger("shopback:marketquotientlist");
                            break;
                        case "MC100008":
                            BrogueApplication.trigger("shopback:sysusermanager");
                            break;
                    }
                });
            }
        };
    });
    return BrogueApplication.BrogueApp.BackShop.MainPage.Left.Controller;
});
