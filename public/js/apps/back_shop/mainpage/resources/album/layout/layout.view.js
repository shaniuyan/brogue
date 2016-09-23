/**
 * Created by wk on 2016/6/28.
 */
define(["app", "marionette", "tpl!apps/back_shop/mainpage/resources/album/layout/layout.html"],
  function (BrogueApplication, Marionette, layoutTpl) {
    BrogueApplication.module("BrogueApp.BackShop.MainPage.Resources.Album.LayoutView", function (View, BrogueApplication, Backbone, Marionette, $, _) {
      View.AlbumLayout = Marionette.LayoutView.extend({
        template: layoutTpl,
        initialize: function () {
          if (this.getOption("xevent")) {
            this.xevent = this.getOption("xevent");
          }
        }
      });
    });
    return BrogueApplication.BrogueApp.BackShop.MainPage.Resources.Album.LayoutView;
  });
