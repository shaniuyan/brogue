/**
 * Created by wk on 2016/6/21.
 */
define(["app", "marionette", "tpl!apps/back_shop/mainpage/rightregion/good/layout/layout.html"],
    function (BrogueApplication, Marionette, workspaceTpl) {
        BrogueApplication.module("BrogueApp.BackShop.MainPage.Good.LayoutView", function (GoodList, BrogueApplication, Backbone, Marionette, $, _) {
            GoodList.Layout = Marionette.LayoutView.extend({
                className: "container",
                template: workspaceTpl,
                initialize: function () {
                    if (this.getOption("xevent")) {
                        this.xevent = this.getOption("xevent");
                    }
                },
                regions: {
                    goodListRegion: ".goodListRegion"
                },
                events: {
                    "click .btn_addgood": "addGood"
                },
                addGood: function (e) {
                    e.preventDefault();
                    if(this.xevent){
                        this.xevent.triggerMethod("goodadd:form");
                    }
                }
            });
        });
        return BrogueApplication.BrogueApp.BackShop.MainPage.Good.LayoutView;
    });
