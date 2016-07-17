/**
 * Created by wk on 2016/6/21.
 */
define(["app", "marionette", "tpl!apps/back_shop/mainpage/layout/layout.html"],
  function (BrogueApplication, Marionette, layoutTpl) {
    BrogueApplication.module("BrogueApp.BackShop.MainPage", function (View, BrogueApplication, Backbone, Marionette, $, _) {
      View.Main = Marionette.LayoutView.extend({
        template: layoutTpl,
        regions: {
          leftRegion: ".leftRegion",
          rightRegion: ".rightRegion"
        }
      });
    });
    return BrogueApplication.BrogueApp.BackShop.MainPage;
  });
