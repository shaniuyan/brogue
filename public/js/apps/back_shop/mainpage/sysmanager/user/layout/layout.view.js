/**
 * Created by wk on 2016/6/21.
 */
define(["app", "marionette", "tpl!apps/back_shop/mainpage/sysmanager/user/layout/layout.html"],
    function (BrogueApplication, Marionette, layoutTpl) {
        BrogueApplication.module("BrogueApp.BackShop.MainPage.SysManager.UserLayout", function (View, BrogueApplication, Backbone, Marionette, $, _) {
            View.Layout = Marionette.LayoutView.extend({
                className: "container",
                template: layoutTpl,
                initialize: function () {
                    if (this.getOption("xevent")) {
                        this.xevent = this.getOption("xevent");
                    }
                },
                events:{
                    "click .btn_addCustomers":"addCustomers"
                },
                regions: {
                    UserListRegion: ".userListRegion"
                },
                addCustomers:function(e){
                    e.preventDefault();
                    if(this.xevent){
                        this.xevent.triggerMethod("customers:add");
                    }
                }
            });
        });
        return BrogueApplication.BrogueApp.BackShop.MainPage.SysManager.UserLayout;
    });
