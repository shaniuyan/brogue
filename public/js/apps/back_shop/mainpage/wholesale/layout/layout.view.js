/**
 * Created by wk on 2016/6/21.
 */
define(["app", "marionette", "tpl!apps/back_shop/mainpage/wholesale/layout/layout.html"],
    function (BrogueApplication, Marionette, layoutTpl) {
        BrogueApplication.module("BrogueApp.BackShop.MainPage.WholesaleLayout", function (View, BrogueApplication, Backbone, Marionette, $, _) {
            View.Wholesale = Marionette.LayoutView.extend({
                template: layoutTpl,
                regions: {},
                events: {
                    "click .btn_addWholesaleList": "addWholesaleList"
                },
                initialize: function () {
                    if (this.getOption("xevent")) {
                        this.xevent = this.getOption("xevent");
                    }
                },
                addWholesaleList: function (e) {
                    e.preventDefault();
                    var opt = {
                        model:this.model
                    };
                    this.xevent.triggerMethod("wholesale:add",opt);
                }
            });
        });
        return BrogueApplication.BrogueApp.BackShop.MainPage.WholesaleLayout;
    });
