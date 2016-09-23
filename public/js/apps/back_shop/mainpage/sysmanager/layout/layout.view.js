/**
 * Created by wk on 2016/6/21.
 */
define(["app", "marionette", "tpl!apps/back_shop/mainpage/sysmanager/layout/layout.html"],
    function (BrogueApplication, Marionette, layoutTpl) {
        BrogueApplication.module("BrogueApp.BackShop.MainPage.SysManagerLayout", function (View, BrogueApplication, Backbone, Marionette, $, _) {
            View.Layout = Marionette.LayoutView.extend({
                className: "container p-0",
                template: layoutTpl,
                initialize: function () {
                    if (this.getOption("xevent")) {
                        this.xevent = this.getOption("xevent");
                    }
                },
                regions: {
                    SysManagerRegion: ".sysManagerRegion"
                }
            });
        });
        return BrogueApplication.BrogueApp.BackShop.MainPage.SysManagerLayout;
    });
