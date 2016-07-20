/**
 * Created by wk on 2016/6/21.
 */
define(["app", "marionette", "tpl!apps/back_shop/mainpage/marketquotient/layout/layout.html"],
    function (BrogueApplication, Marionette, layoutTpl) {
        BrogueApplication.module("BrogueApp.BackShop.MainPage.MarketQuotientLayout", function (View, BrogueApplication, Backbone, Marionette, $, _) {
            View.Layout = Marionette.LayoutView.extend({
                className: "container",
                template: layoutTpl,
                initialize: function () {
                    if (this.getOption("xevent")) {
                        this.xevent = this.getOption("xevent");
                    }
                },
                regions: {
                    marketQuotientListRegion: ".marketQuotientListRegion"
                },
                events:{
                    "click .btn_addMarketQuotient":"addMarketQuotient"
                },
                addMarketQuotient:function(e){
                    e.preventDefault();
                    if(this.xevent){
                        this.xevent.triggerMethod("market:addMarketQuotient");
                    }
                }
            });
        });
        return BrogueApplication.BrogueApp.BackShop.MainPage.MarketQuotientLayout;
    });
