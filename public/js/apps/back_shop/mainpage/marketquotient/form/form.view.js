/**
 * Created by wk on 2016/6/21.
 */
define(["app", "marionette", "tpl!apps/back_shop/mainpage/marketquotient/form/form.html","backbone.syphon"],
    function (BrogueApplication, Marionette, formTpl) {
        BrogueApplication.module("BrogueApp.BackShop.MainPage.MarketQuotientForm", function (GoodList, BrogueApplication, Backbone, Marionette, $, _) {
            GoodList.Form = Marionette.ItemView.extend({
                template: formTpl,
                events:{
                    "click .btn-save":"submitHanlder"
                },
                initialize: function () {
                    if (this.getOption("xevent")) {
                        this.xevent = this.getOption("xevent");
                    }
                },
                submitHanlder:function(e){
                    e.preventDefault();
                    var data = Backbone.Syphon.serialize(this);
                    var opt = {
                        model:this.model,
                        data:data
                    };
                    if(this.xevent){
                        this.xevent.triggerMethod("marketquotient:add",opt);
                    }
                },
                onShow: function () {

                }
            });
        });
        return BrogueApplication.BrogueApp.BackShop.MainPage.MarketQuotientForm;
    });
