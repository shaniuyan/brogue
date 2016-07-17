/**
 * Created by wk on 2016/6/21.
 */
define(["app", "marionette","tpl!apps/back_shop/login/login.tpl.html"],
  function (BrogueApplication, Marionette, layoutTpl) {
    BrogueApplication.module("BrogueApp.BackShop.LoginPage", function (View, BrogueApplication, Backbone, Marionette, $, _) {
      View.Login = Marionette.LayoutView.extend({
        className:"box mt-300",
        template: layoutTpl,
        regions: {},
        events:{
          "click .btn_login":"login",
          "click .btn_retrievePassword":"retrievePassword",
          "click .btn_register":"register"
        },
        login:function(e){
          e.preventDefault();
          BrogueApplication.triggerMethod("shopback:home");
          //window.alert("登录");
        },
        retrievePassword:function(e){
          e.preventDefault();
          window.alert("找回密码");
        },
        retrievePassword:function(e){
          e.preventDefault();
          window.alert("找回密码");
        },
        register:function(e){
          e.preventDefault();
          window.alert("注册");
        }
      });
    });
    return BrogueApplication.BrogueApp.BackShop.LoginPage;
  });
