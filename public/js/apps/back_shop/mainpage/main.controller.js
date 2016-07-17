/**
 * Created by wk 2015年6月10日 09:20:38
 */
define(["app", "shopMainView","apps/back_shop/mainpage/leftregion/ul.controller",
"apps/back_shop/mainpage/rightregion/workspace/workspace.controller"], function(BrogueApplication, LoginView,UlController,WorkspaceController){
    BrogueApplication.module("BrogueApp.BackShop.Main", function(LoginController, BrogueApplication, Backbone, Marionette, $, _){
        LoginController.Controller={
            showMain:function(Region){
              this.xobject = new Marionette.Object();
              var mainView = new LoginView.Main();
              Region.show(mainView);
              this.xobject.MainRegion = mainView.rightRegion;
              BrogueApplication.rightRegion =  mainView.rightRegion;
              UlController.showLeftPanel(mainView.leftRegion,this.xobject);
              WorkspaceController.showWorkSpace(mainView.rightRegion);
              return mainView;
            }
        };
    });
    return BrogueApplication.BrogueApp.BackShop.Main.Controller;
});
