/**
 * Created by wk on 2016/6/28.
 */
define(["app", "marionette", "tpl!apps/back_shop/mainpage/wholemanagementlist/layout/layout.html"],
    function (BrogueApplication, Marionette, layoutTpl) {
        BrogueApplication.module("BrogueApp.BackShop.MainPage.WholeManagementListLayout", function (View, BrogueApplication, Backbone, Marionette, $, _) {
            View.SalesManagementListLayout = Marionette.LayoutView.extend({
                template: layoutTpl,
                events: {
                    "click .settlement": "settlement"
                },
                regions: {
                    settlementRegion: ".settlementRegion"
                },
                initialize: function () {
                    if (this.getOption("xevent")) {
                        this.xevent = this.getOption("xevent");
                    }
                },
                settlement: function (e) {
                    e.preventDefault();
                    $(e.target).addClass("btn-default");
                    $(".settlement").removeClass("btn-success");
                    $(e.target).addClass("btn-success");
                    if (this.xevent) {
                        var status = $(e.target).attr("status");
                        this.xevent.param = {paystatus: status};
                        this.xevent.triggerMethod("salesmanagement:list")
                    }
                }
            });
        });
        return BrogueApplication.BrogueApp.BackShop.MainPage.WholeManagementListLayout;
    });
