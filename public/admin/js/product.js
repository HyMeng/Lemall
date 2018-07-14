$(function () {
    // 加载页面就重新渲染页面
    var page = 1;
    var pageSize = 5;
    var imgs = [];
    render();
    // 添加分类功能
    $('.btn-add').on('click', function () {
        $('#addModal').modal('show');
        // 2.2 发送ajax请求，获取到一级分类的数据
        $.ajax({
            type: 'get',
            url: '/category/querySecondCategoryPaging',
            data: {
                page: 1,
                pageSize: 100
            },
            success: function (info) {
                console.log(info);
                $('.dropdown-menu').html(template('tpl2', info));
            }
        })
    })
    // 二级分类dropDown功能
    $('.dropdown-menu').on('click', 'a', function () {
        $('.dropdown-text').text($(this).text());
        var id = $(this).data('id');
        $("[name='brandId']").val(id);
        // 手动更改brandId校验反馈状态
        $('form').data('bootstrapValidator').updateStatus('brandId', 'VALID');
    })
    // 图片上传功能img_box
    $('#fileupload').fileupload({
        done: function (e, data) {
            if (imgs.length === 3) {
                return;
            }
            console.log(data.result);
            var src = data.result.picAddr;
            imgs.push(data.result);
            $('.img_box').append('<img class="logo_img" src=' + src + ' width="100px" height="100px" alt="">');
            if (imgs.length === 3) {
                $('form').data('bootstrapValidator').updateStatus('brandLogo', 'VALID');
                // 校验成功后要手动清空图片
            } else {
                // 否则图片校验不通过
                $('form').data('bootstrapValidator').updateStatus('brandLogo', 'INVALID');
            }
        }
    })
    // 表单校验
    $('form').bootstrapValidator({
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok-sign',
            invalid: 'glyphicon glyphicon-exclamation-sign',
            validating: 'glyphicon glyphicon-repeat'
        },
        excluded: [],
        fields: {
            brandId: {
                validators: {
                    notEmpty: {
                        message: '请选择二级分类'
                    }

                }
            },
            proName: {
                validators: {
                    notEmpty: {
                        message: '请输入商品的名称'
                    }

                }
            },
            proDesc: {
                validators: {
                    notEmpty: {
                        message: '请输入商品的描述'
                    }

                }
            },
            num: {
                validators: {
                    notEmpty: {
                        message: '请输入商品的库存'
                    },
                    //添加正则校验  数量 大于0，  99999  1-5  [1-9]4位  1  111
                    regexp: {
                        regexp: /^[1-9]\d{0,4}$/,
                        message: '请输入正确的库存(1-99999)'
                    }

                }
            },
            size: {
                validators: {
                    notEmpty: {
                        message: '请输入商品的尺码'
                    },
                    //添加正则校验  数量 大于0，  99999  1-5  [1-9]4位  1  111
                    regexp: {
                        regexp: /^\d{2}-\d{2}$/,
                        message: '请输入正确的尺码(xx-xx)'
                    }

                }
            },
            oldPrice: {
                validators: {
                  notEmpty: {
                    message: '请输入商品的原价'
                  }
                }
              },
              price: {
                validators: {
                  notEmpty: {
                    message: '请输入商品的价格'
                  }
                }
              },
              brandLogo: {
                  validators: {
                      notEmpty: {
                          message: '请上传三张商品图片'
                      }
                  }
              }
        }
    })
    // 注册表单校验成功事件
    $('form').on('success.form.bv',function(e) {
        e.preventDefault();
        var param = $('form').serialize();
        param += "&picName1=" +imgs[0].picName + "&picAddr1=" + imgs[0].picAddr;
        param += "&picName2=" +imgs[1].picName + "&picAddr2=" + imgs[1].picAddr;
        param += "&picName3=" +imgs[2].picName + "&picAddr3=" + imgs[2].picAddr;
        $.ajax({
            type: 'post',
            url: '/product/addProduct',
            data: param,
            success: function(info) {
                console.log(info);
                if(info.success){
                    page=1;
                    render();
                    $("#addModal").modal('hide');
                    // 重置表单
                    $('form').data('bootstrapValidator').resetForm(true);
                    // 手动更改下拉框和图片的内容
                    $('.dropdown-text').text('请选择二级分类');
                    $('.img_box').empty();
                }
            }
        })
    })
    function render() {
        $.ajax({
            type: 'get',
            url: '/product/queryProductDetailList',
            data: {
                page: page,
                pageSize: pageSize
            },
            success: function (info) {
                console.log(info);
                var html = template('tpl', info);
                $('tbody').html(html);
                // 设置分页
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion: 3, //默认是2，如果是bootstrap3版本，这个参数必填
                    currentPage: page, //当前页
                    totalPages: Math.ceil(info.total / info.size), //总页数
                    size: "small", //设置控件的大小，mini, small, normal,large
                    itemTexts: function (type, page, current) {
                        switch (type) {
                            case 'first':
                                return '首页';
                            case 'page':
                                return page;
                            case 'prev':
                                return '上一页';
                            case 'next':
                                return '下一页';
                            case 'last':
                                return '尾页';

                        }
                    },
                    tooltipTitles: function (type, page, current) {
                        switch (type) {
                            case 'first':
                                return '首页';
                            case 'page':
                                return page;
                            case 'prev':
                                return '上一页';
                            case 'next':
                                return '下一页';
                            case 'last':
                                return '尾页';

                        }
                    },
                    useBootstrapTooltip: true,
                    onPageClicked: function (event, originalEvent, type, p) {
                        //为按钮绑定点击事件 page:当前点击的按钮值
                        page = p;
                        render();
                    }
                });
            }
        })
    }

})