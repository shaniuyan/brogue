/**
 * Created by wk on 2016/6/21.
 */
define(["app", "marionette", "tpl!apps/back_shop/mainpage/wholesale/mainform/mainform.html", "backbone.syphon", "bootstrap"],
    function (BrogueApplication, Marionette, formTpl) {
        BrogueApplication.module("BrogueApp.BackShop.MainPage.WholesaleMainForm", function (GoodList, BrogueApplication, Backbone, Marionette, $, _) {
            GoodList.Form = Marionette.ItemView.extend({
                template: formTpl,
                events: {},
                initialize: function () {
                    if (this.getOption("xevent")) {
                        this.xevent = this.getOption("xevent");
                    }
                },
                submitHanlder: function (e) {

                },
                onShow: function () {
                    $("[data-toggle='popover']").popover();
                }
            });
        });
        return BrogueApplication.BrogueApp.BackShop.MainPage.WholesaleMainForm;
    });
