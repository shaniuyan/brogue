/**
 * Created by wk on 2016/6/21.
 */
define(["app", "marionette", "tpl!apps/back_shop/mainpage/salesmanagement/searchgood/layout/layout.html"],
    function (BrogueApplication, Marionette, workspaceTpl) {
        BrogueApplication.module("BrogueApp.BackShop.SalesManagement.LayoutView", function (GoodList, BrogueApplication, Backbone, Marionette, $, _) {
            GoodList.Layout = Marionette.LayoutView.extend({
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
                    "click .btn_addgood": "addGood",
                    "click .btn-paymentoperation":"paymentoperation"
                },
                addGood: function (e) {
                    e.preventDefault();
                    window.alert("添加商铺信息");
                },
                paymentoperation:function(e){
                    e.preventDefault();
                    var opt = {};
                    if(this.xevent){
                        this.xevent.triggerMethod("salesmanagement:clear",opt);
                    }
                }
            });
        });
        return BrogueApplication.BrogueApp.BackShop.SalesManagement.LayoutView;
    });
