/**
 * Created by wk on 2016/6/21.
 */
define(["app", "marionette", "tpl!apps/back_shop/mainpage/wholemanagement/searchgoodlist/goodlist.html"],
  function (BrogueApplication, Marionette, goodListTpl) {
    BrogueApplication.module("BrogueApp.BackShop.MainPage.WholeSearchGoodList", function (GoodList, BrogueApplication, Backbone, Marionette, $, _) {
      GoodList.View = Marionette.ItemView.extend({
        template: goodListTpl
      });
    });
    return BrogueApplication.BrogueApp.BackShop.MainPage.WholeSearchGoodList;
  });
