/**
 * Created by wk on 2016/6/21.
 */
define(["app", "marionette","tpl!apps/back_shop/login/login.tpl.html","bootstrap","bootstrapvalidator","backbone.syphon"],
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
        initialize: function () {
          if (this.getOption("xevent")) {
            this.xevent = this.getOption("xevent");
          }
        },
        login:function(e){
          e.preventDefault();

          var data = Backbone.Syphon.serialize(this);
          var opt = {
            data:data
          };
          if(this.xevent){
            this.xevent.triggerMethod("login:submit",opt);
          }

          //BrogueApplication.triggerMethod("shopback:home");
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
        },
        onShow:function(){
          $('#loginform')
              .bootstrapValidator({
                message: 'This value is not valid',
                feedbackIcons: {
                  valid: 'glyphicon glyphicon-ok',
                  invalid: 'glyphicon glyphicon-remove',
                  validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                  accountNumber: {
                    validators: {
                      notEmpty: {
                        message: '账号不能为空'
                      }
                    }
                  },
                  password: {
                    validators: {
                      notEmpty: {
                        message: '密码不能为空'
                      }
                    }
                  }
                }
              });

          $('#loginform').submit();
        }
      });
    });
    return BrogueApplication.BrogueApp.BackShop.LoginPage;
  });
