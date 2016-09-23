/**
 * Created by wk on 2015年6月10日 09:46:47
 */
define(["app",
    "tpl!apps/back_shop/mainpage/marketquotient/list/table.html",
    "tpl!apps/back_shop/mainpage/marketquotient/list/tr.html",
    "tpl!apps/back_shop/mainpage/marketquotient/list/none.html"],
  function (BrogueApplication, tableTpl, trTpl, noneTpl) {
    BrogueApplication.module("BrogueApp.BackShop.MainPage.MarketQuotientView", function (View, BrogueApplication, Backbone, Marionette, $, _) {
      //子节点试图
      View.Tr = Marionette.ItemView.extend({
        template: trTpl,
        tagName: "tr",
        className: "unread checked",
        initialize: function () {
        }
      });

      var NoneView = Marionette.ItemView.extend({
        template: noneTpl,
        tagName: "tr",
        className: "unread checked"
      });

      View.Table = Marionette.CompositeView.extend({
        tagName: "table",
        className:"table table-hover",
        template: tableTpl,
        childView: View.Tr,
        emptyView: NoneView,
        childViewContainer: "tbody"
      });
    });
    return BrogueApplication.BrogueApp.BackShop.MainPage.MarketQuotientView;
  });
