/**
 * Created by wk on 2016/6/21.
 */
define(["app", "marionette", "tpl!apps/back_shop/mainpage/rightregion/good/mainform/mainform.html", "bootstrap","bootstrapvalidator","backbone.syphon"],
    function (BrogueApplication, Marionette, formTpl) {
        BrogueApplication.module("BrogueApp.BackShop.MainPage.GoodMainView", function (SalesPrice, BrogueApplication, Backbone, Marionette, $, _) {
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
                        this.xevent.triggerMethod("good:add",opt);
                    }
                },
                onShow: function () {
                    $('#GoodForm')
                        .bootstrapValidator({
                            message: 'This value is not valid',
                            feedbackIcons: {
                                valid: 'glyphicon glyphicon-ok',
                                invalid: 'glyphicon glyphicon-remove',
                                validating: 'glyphicon glyphicon-refresh'
                            },
                            fields: {
                                goodName: {
                                    validators: {
                                        notEmpty: {
                                            message: '商品名称不能为空'
                                        }
                                    }
                                },
                                purchasePrice:{
                                    validators: {
                                        notEmpty: {
                                            message: '进价不能为空'
                                        },
                                        numeric:{
                                            message: '进价必须为数字'
                                        }
                                    }
                                },
                                tradePrice:{
                                    validators: {
                                        notEmpty: {
                                            message: '批发价不能为空'
                                        },
                                        numeric:{
                                            message: '批发价必须为数字'
                                        }
                                    }
                                },
                                price:{
                                    validators: {
                                        notEmpty: {
                                            message: '售价不能为空'
                                        },
                                        numeric:{
                                            message: '售价必须为数字'
                                        }
                                    }
                                },
                                wholenum:{
                                    validators: {
                                        notEmpty: {
                                            message: '整件数量不能为空'
                                        },
                                        numeric:{
                                            message: '整件数量必须为数字'
                                        }
                                    }
                                },
                                wholeUnit:{
                                    validators: {
                                        notEmpty: {
                                            message: '整件单位不能为空'
                                        }
                                    }
                                },
                                scatterednum:{
                                    validators: {
                                        notEmpty: {
                                            message: '零售数量不能为空'
                                        },
                                        numeric:{
                                            message: '零售数量必须为数字'
                                        }
                                    }
                                },
                                unit:{
                                    validators: {
                                        notEmpty: {
                                            message: '零售单位不能为空'
                                        }
                                    }
                                },
                                conversionunit:{
                                    validators: {
                                        notEmpty: {
                                            message: '换算单位不能为空'
                                        },
                                        numeric:{
                                            message: '换算单位必须为数字'
                                        }
                                    }
                                }
                            }
                        });
                    $('#GoodForm').submit();
                }
            });
        });
        return BrogueApplication.BrogueApp.BackShop.MainPage.GoodMainView;
    });
