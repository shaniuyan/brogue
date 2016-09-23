/**
 * Created by wk on 2016/6/21.
 */
define(["app", "marionette", "tpl!apps/back_shop/mainpage/resources/layout/layout.html"],
    function (BrogueApplication, Marionette, layoutTpl) {
        BrogueApplication.module("BrogueApp.BackShop.MainPage.ResourcesLayout", function (View, BrogueApplication, Backbone, Marionette, $, _) {
            View.Layout = Marionette.LayoutView.extend({
                className: "container",
                template: layoutTpl,
                initialize: function () {
                    if (this.getOption("xevent")) {
                        this.xevent = this.getOption("xevent");
                    }
                },
                regions: {
                    imageRegion: ".imageRegion"
                }
            });
        });
        return BrogueApplication.BrogueApp.BackShop.MainPage.ResourcesLayout;
    });
