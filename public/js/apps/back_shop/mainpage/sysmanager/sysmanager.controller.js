/**
 * Created by wk 2015年6月10日 09:20:38
 */
define(["app", "apps/back_shop/mainpage/sysmanager/layout/layout.view",
    "apps/back_shop/mainpage/sysmanager/user/layout/layout.view",
    "apps/back_shop/mainpage/sysmanager/user/list/table.view",
    "apps/back_shop/mainpage/sysmanager/user/form/mainform.view",
    "apps/back_shop/entity/customer.entities"], function (BrogueApplication, LayoutView,UserLayoutView,ListView,MainFrom) {
    BrogueApplication.module("BrogueApp.BackShop.MainPage.SysManager", function (NavController, BrogueApplication, Backbone, Marionette, $, _) {
        NavController.Controller = {
            showSysManager: function (Region, xobject) {
                var that = this;
                that.xobject = new Marionette.Object();
                var layoutView = new LayoutView.Layout({xevent: that.xobject});
                Region.show(layoutView);

                var userLayoutView = new UserLayoutView.Layout({xevent: that.xobject});

                layoutView.SysManagerRegion.show(userLayoutView);
                var fetchCustomers = BrogueApplication.request("customer:entities");
                $.when(fetchCustomers).done(function (customers) {
                    that.customerListView = new ListView.Table({collection:customers,xevent:xobject,childViewOptions: {xevent: xobject}});
                    userLayoutView.UserListRegion.show(that.customerListView);
                });

                that.xobject.on("customers:add",function(){
                    that.customerModel = new BrogueApplication.Entities.Customer;

                    that.mainFormView = new MainFrom.Form({xevent:that.xobject,model:that.customerModel});

                    BrogueApplication.dialogFormRegion.show(that.mainFormView, {
                        title: "添加职工信息",
                        height: 430,
                        width: 400
                    });
                });

                that.xobject.on("customers:addsubmit",function(opt){
                    that.customerModel.url = "/api/v1/manageuser/addcustomer.json";
                    var opts = {
                        success: function (model, resp, options) {
                            that.customerModel.set(resp.response_params);
                            that.customerListView.collection.add(that.customerModel);
                            that.mainFormView.trigger("dialog:close");
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
    return BrogueApplication.BrogueApp.BackShop.MainPage.SysManager.Controller;
});
