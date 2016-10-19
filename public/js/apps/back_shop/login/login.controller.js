/**
 * Created by wk 2015年6月10日 09:20:38
 */
define(["app", "loginView","apps/back_shop/entity/customer.entities"], function (BrogueApplication, LoginView) {
    BrogueApplication.module("BrogueApp.BackShop.Login", function (LoginController, BrogueApplication, Backbone, Marionette, $, _) {
        LoginController.Controller = {

            showLogin: function (Region) {
                var that = this;
                that.xobject = new Marionette.Object();
                that.customerModel = new BrogueApplication.Entities.Customer;
                var loginView = new LoginView.Login({xevent: that.xobject});
                Region.show(loginView);

                that.xobject.on("login:submit",function(opt){
                    that.customerModel.url = "/api/v1/auth/login.json";
                    var opts = {
                        success: function (model, resp, options) {
                            if(resp.error_code == 0){

                            }else{
                                window.alert(JSON.stringify(resp.error_msg));
                            }
                        },
                        error: function () {
                            console.log("server conn fail || request url address error!");
                        }
                    }
                    var save = that.customerModel.save(opt.data, opts);
                    if (!save) {
                        //formView.triggerMethod("form:data:invalid", newDoctorClass.validationError);
                    }
                });
            }
        };
    });
    return BrogueApplication.BrogueApp.BackShop.Login.Controller;
});
