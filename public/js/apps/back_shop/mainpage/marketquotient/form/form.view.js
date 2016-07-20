/**
 * Created by wk on 2016/6/21.
 */
define(["app", "marionette", "tpl!apps/back_shop/mainpage/marketquotient/form/form.html"],
  function (BrogueApplication, Marionette, formTpl) {
    BrogueApplication.module("BrogueApp.BackShop.MainPage.MarketQuotientForm", function (GoodList, BrogueApplication, Backbone, Marionette, $, _) {
      GoodList.Form = Marionette.ItemView.extend({
        template: formTpl
      });
    });
    return BrogueApplication.BrogueApp.BackShop.MainPage.MarketQuotientForm;
  });
