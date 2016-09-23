/**
 * Created by wk on 2016/6/21.
 */
define(["app", "marionette", "tpl!apps/back_shop/mainpage/sysmanager/user/form/mainform.html", "bootstrap","bootstrapvalidator","backbone.syphon"],
    function (BrogueApplication, Marionette, formTpl) {
        BrogueApplication.module("BrogueApp.BackShop.MainPage.SysManager.UserMainForm", function (SalesPrice, BrogueApplication, Backbone, Marionette, $, _) {
            SalesPrice.Form = Marionette.ItemView.extend({
                template: formTpl,
                events: {
                    "click .btn-goodadd":"submitHanlder"
                },
                initialize: function () {
                    if (this.getOption("xevent")) {
                        this.xevent = this.getOption("xevent");
                    }
                },
                submitHanlder: function (e) {
                    e.preventDefault();
                    var data = Backbone.Syphon.serialize(this);
                    var opt = {
                        model:this.model,
                        data:data
                    };
                    if(this.xevent){
                        this.xevent.triggerMethod("customers:addsubmit",opt);
                    }
                },
                onShow: function () {
                    $('#CustomerForm')
                        .bootstrapValidator({
                            message: 'This value is not valid',
                            feedbackIcons: {
                                valid: 'glyphicon glyphicon-ok',
                                invalid: 'glyphicon glyphicon-remove',
                                validating: 'glyphicon glyphicon-refresh'
                            },
                            fields: {
                                name: {
                                    validators: {
                                        notEmpty: {
                                            message: '姓名不能为空'
                                        }
                                    }
                                }
                            }
                        });
                    $('#CustomerForm').submit();
                }
            });
        });
        return BrogueApplication.BrogueApp.BackShop.MainPage.SysManager.UserMainForm;
    });
