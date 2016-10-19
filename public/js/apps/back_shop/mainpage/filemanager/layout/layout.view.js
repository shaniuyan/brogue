/**
 * Created by wk on 2016/6/21.
 */
define(["app", "marionette", "tpl!apps/back_shop/mainpage/filemanager/layout/layout.html"],
    function (BrogueApplication, Marionette, layoutTpl) {
        BrogueApplication.module("BrogueApp.BackShop.MainPage.FileManagerLayout", function (View, BrogueApplication, Backbone, Marionette, $, _) {
            View.Layout = Marionette.LayoutView.extend({
                className: "container",
                template: layoutTpl,
                initialize: function () {
                    if (this.getOption("xevent")) {
                        this.xevent = this.getOption("xevent");
                    }
                },
                regions: {
                    fileRegion: ".fileRegion"
                }
            });
        });
        return BrogueApplication.BrogueApp.BackShop.MainPage.FileManagerLayout;
    });
