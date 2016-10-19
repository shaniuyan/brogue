/**
 * Created by wk on 2016/6/21.
 */
define(["app", "marionette", "tpl!apps/back_shop/mainpage/sysmanager/user/form/mainform.html", "bootstrap","bootstrapvalidator","backbone.syphon"],
    function (BrogueApplication, Marionette, formTpl) {
        BrogueApplication.module("BrogueApp.BackShop.MainPage.SysManager.UserMainForm", function (SalesPrice, BrogueApplication, Backbone, Marionette, $, _) {
            SalesPrice.Form = Marionette.ItemView.extend({
                template: formTpl,
                events: {
                    "click .btn-goodadd":"submitHanlder",
                    "click .sex":"choiceSex"
                },
                initialize: function () {
                    if (this.getOption("xevent")) {
                        this.xevent = this.getOption("xevent");
                    }
                },
                submitHanlder: function (e) {
                    e.preventDefault();
                    var data = Backbone.Syphon.serialize(this);
                    data.sex = this.model.get("sex");
                    var opt = {
                        model:this.model,
                        data:data
                    };
                    if(this.xevent){
                        this.xevent.triggerMethod("customers:addsubmit",opt);
                    }
                },
                onShow: function () {
                    var sex = 0;
                    if(this.model.get("sex")){
                        sex = 1;
                    }
                    this.model.set("sex",sex);
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
                                },
                                nickname: {
                                    validators: {
                                        notEmpty: {
                                            message: '昵称不能为空'
                                        }
                                    }
                                },
                                phone: {
                                    validators: {
                                        notEmpty: {
                                            message: '手机号不能为空'
                                        }
                                    }
                                },
                                telephone: {
                                    validators: {
                                        notEmpty: {
                                            message: '固定电话不能为空'
                                        }
                                    }
                                },
                                idNumber: {
                                    validators: {
                                        notEmpty: {
                                            message: '身份证号不能为空'
                                        }
                                    }
                                }
                            }
                        });
                    $('#CustomerForm').submit();
                },
                choiceSex:function(e){
                    this.model.set("sex",$(e.target).val());
                }
            });
        });
        return BrogueApplication.BrogueApp.BackShop.MainPage.SysManager.UserMainForm;
    });
