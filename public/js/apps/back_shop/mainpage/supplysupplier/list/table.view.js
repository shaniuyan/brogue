/**
 * Created by wk on 2015年6月10日 09:46:47
 */
define(["app",
    "tpl!apps/back_shop/mainpage/supplysupplier/list/table.html",
    "tpl!apps/back_shop/mainpage/supplysupplier/list/tr.html",
    "tpl!apps/back_shop/mainpage/supplysupplier/list/none.html"],
  function (BrogueApplication, tableTpl, trTpl, noneTpl) {
    BrogueApplication.module("BrogueApp.BackShop.MainPage.SupplySupplierView", function (View, BrogueApplication, Backbone, Marionette, $, _) {
      //子节点试图
      View.Tr = Marionette.ItemView.extend({
        template: trTpl,
        tagName: "div",
        className: "col-xs-12 col-sm-6 col-md-4 col-lg-3 show_grid mb-20",
        initialize: function () {
        }
      });

      var NoneView = Marionette.ItemView.extend({
        template: noneTpl,
        tagName: "div",
        className: "col-xs-12 col-sm-6 col-md-4 col-lg-3 show_grid mb-20"
      });

      View.Table = Marionette.CompositeView.extend({
        tagName: "div",
        className:"container",
        template: tableTpl,
        childView: View.Tr,
        emptyView: NoneView,
        childViewContainer: "div"
      });
    });
    return BrogueApplication.BrogueApp.BackShop.MainPage.SupplySupplierView;
  });
