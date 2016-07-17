/**
 * Created by wk 2015年6月10日 09:20:38
 */
define(["app", "apps/back_shop/mainpage/rightregion/workspace/workspace.view"], function (BrogueApplication, WorkSpaceView) {
  BrogueApplication.module("BrogueApp.BackShop.MainPage.WorkSpace", function (WorkSpaceController, BrogueApplication, Backbone, Marionette, $, _) {
    WorkSpaceController.Controller = {
      showWorkSpace: function (Region) {
        var workSpaceView = new WorkSpaceView.WorkSpaceView();
        Region.show(workSpaceView);
      }
    };
  });
  return BrogueApplication.BrogueApp.BackShop.MainPage.WorkSpace.Controller;
});
