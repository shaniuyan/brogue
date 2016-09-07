/**
 * Created by wk on 2016/6/21.
 */
define(["app", "marionette", "tpl!apps/back_shop/mainpage/wholemanagement/salesform/mainform.html", "bootstrap","bootstrapvalidator","backbone.syphon"],
    function (BrogueApplication, Marionette, formTpl) {
        BrogueApplication.module("BrogueApp.BackShop.MainPage.WholeManagementMainForm", function (GoodList, BrogueApplication, Backbone, Marionette, $, _) {
            GoodList.Form = Marionette.ItemView.extend({
                template: formTpl,
                events: {
                    "click .btn-save":"submitHanlder"
                },
                initialize: function () {
                    if (this.getOption("xevent")) {
                        this.xevent = this.getOption("xevent");
                    }
                },
                submitHanlder: function (e) {
                    e.preventDefault();
                    var data = Backbone.Syphon.serialize(this);
                    data.goodId = this.model.get("goodId");
                    var opt = {
                        model:this.model,
                        data:data
                    };
                    if(this.xevent){
                        this.xevent.triggerMethod("salesmanagement:add",opt);
                    }
                },
                onShow: function () {
                    $('#SalesForm')
                        .bootstrapValidator({
                            message: 'This value is not valid',
                            feedbackIcons: {
                                valid: 'glyphicon glyphicon-ok',
                                invalid: 'glyphicon glyphicon-remove',
                                validating: 'glyphicon glyphicon-refresh'
                            },
                            fields: {
                                tradePrice: {
                                    validators: {
                                        notEmpty: {
                                            message: '批发价不能为空'
                                        },
                                        numeric:{
                                            message: '批发价必须为数字'
                                        }
                                    }
                                },
                                price: {
                                    validators: {
                                        notEmpty: {
                                            message: '售价不能为空'
                                        },
                                        numeric:{
                                            message: '售价必须为数字'
                                        }
                                    }
                                },
                                wholenum: {
                                    validators: {
                                        notEmpty: {
                                            message: '整件数量不能为空'
                                        },
                                        numeric:{
                                            message: '整件数量必须为数字'
                                        }
                                    }
                                },
                                scatterednum: {
                                    validators: {
                                        notEmpty: {
                                            message: '零售数量不能为空'
                                        },
                                        numeric:{
                                            message: '整件数量必须为数字'
                                        }
                                    }
                                }
                            }
                        });
                    $('#SalesForm').submit();
                }
            });
        });
        return BrogueApplication.BrogueApp.BackShop.MainPage.WholeManagementMainForm;
    });
