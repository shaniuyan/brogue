/**
 * Created by wk on 2016/6/21.
 */
define(["app", "marionette", "tpl!apps/back_shop/mainpage/salesmanagement/searchgood/layout/layout.html"],
    function (BrogueApplication, Marionette, workspaceTpl) {
        BrogueApplication.module("BrogueApp.BackShop.SalesManagement.LayoutView", function (GoodList, BrogueApplication, Backbone, Marionette, $, _) {
            GoodList.Layout = Marionette.LayoutView.extend({
                template: workspaceTpl,
                regions: {
                    goodListRegion: ".goodListRegion"
                },
                events: {
                    "click .btn_addgood": "addGood"
                },
                addGood: function (e) {
                    e.preventDefault();
                    window.alert("添加商铺信息");
                }
            });
        });
        return BrogueApplication.BrogueApp.BackShop.SalesManagement.LayoutView;
    });
