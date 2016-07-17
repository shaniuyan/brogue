/**
 * Created by wk on 2016/6/21.
 */
define(["app", "marionette", "tpl!apps/back_shop/mainpage/rightregion/workspace/workspace.html"],
  function (BrogueApplication, Marionette, workspaceTpl) {
    BrogueApplication.module("BrogueApp.BackShop.MainPage.WorkSpaceView", function (View, BrogueApplication, Backbone, Marionette, $, _) {
      View.WorkSpaceView = Marionette.ItemView.extend({
        className:"container",
        template: workspaceTpl
      });
    });
    return BrogueApplication.BrogueApp.BackShop.MainPage.WorkSpaceView;
  });
