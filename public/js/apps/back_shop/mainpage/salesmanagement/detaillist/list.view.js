/**
 * Created by wk on 2015年6月10日 09:46:47
 */
define(["app",
        "tpl!apps/back_shop/mainpage/salesmanagement/detaillist/table.html",
        "tpl!apps/back_shop/mainpage/salesmanagement/detaillist/td.html",
        "tpl!apps/back_shop/mainpage/salesmanagement/detaillist/none.html"],
    function (BrogueApplication, tableTpl, tdTpl, noneTpl) {
        BrogueApplication.module("BrogueApp.BackShop.SalesManagement.DetailListView", function (View, BrogueApplication, Backbone, Marionette, $, _) {
            //子节点试图
            View.Tr = Marionette.ItemView.extend({
                template: tdTpl,
                tagName: "tr",
                className: "unread checked",
                events:{
                    "click .btn-delsales":"delsales"
                },
                initialize: function () {
                    if (this.getOption("xevent")) {
                        this.xevent = this.getOption("xevent");
                    }
                },
                onRender: function () {
                },
                delsales:function(e){
                    e.preventDefault();
                    if(this.xevent){
                        this.xevent.triggerMethod("sales:delsales",this.model);
                    }
                }
            });
            var NoneView = Marionette.ItemView.extend({
                template: noneTpl,
                tagName: "div",
                className: "sidebar-nav"
            });

            View.Table = Marionette.CompositeView.extend({
                tagName: "table",
                className: "table table-hover",
                template: tableTpl,
                childView: View.Tr,
                childViewContainer: "tbody",
                emptyView: NoneView,
                initialize: function () {
                },
                appendHtml: function (cv, iv) {
                }
            });

        });
        return BrogueApplication.BrogueApp.BackShop.SalesManagement.DetailListView;
    });
