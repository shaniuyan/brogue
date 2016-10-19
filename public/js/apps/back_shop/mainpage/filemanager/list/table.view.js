/**
 * Created by wk on 2015年6月10日 09:46:47
 */
define(["app",
        "tpl!apps/back_shop/mainpage/filemanager/list/table.html",
        "tpl!apps/back_shop/mainpage/filemanager/list/tr.html",
        "tpl!apps/back_shop/mainpage/filemanager/list/none.html"],
    function (BrogueApplication, tableTpl, trTpl, noneTpl) {
        BrogueApplication.module("BrogueApp.BackShop.MainPage.FileManagerListView", function (View, BrogueApplication, Backbone, Marionette, $, _) {
            //子节点试图
            View.Tr = Marionette.ItemView.extend({
                template: trTpl,
                tagName: "div",
                className: "col-md-2 text-center pointer",
                events: {
                    "click .dictionary": "pointer"
                },
                initialize: function () {
                    if (this.getOption("xevent")) {
                        this.xevent = this.getOption("xevent");
                    }
                },
                pointer: function (e) {
                    e.preventDefault();
                    if (this.xevent) {
                        this.xevent.triggerMethod("filemanager:look",this.model);
                    }
                }
            });

            var NoneView = Marionette.ItemView.extend({
                template: noneTpl,
                tagName: "div",
                className: "col-md-2"
            });

            View.Table = Marionette.CompositeView.extend({
                tagName: "div",
                className: "container",
                template: tableTpl,
                childView: View.Tr,
                emptyView: NoneView,
                childViewContainer: "div"
            });
        });
        return BrogueApplication.BrogueApp.BackShop.MainPage.FileManagerListView;
    });
