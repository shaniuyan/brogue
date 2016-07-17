/**
 * Created by wk 2015年6月10日 09:20:38
 */
define(["app", "loginView"], function(BrogueApplication, LoginView){
    BrogueApplication.module("BrogueApp.BackShop.Login", function(LoginController, BrogueApplication, Backbone, Marionette, $, _){
        LoginController.Controller={
            showLogin:function(Region){
              var loginView = new LoginView.Login();
              Region.show(loginView);
            }
        };
    });
    return BrogueApplication.BrogueApp.BackShop.Login.Controller;
});
