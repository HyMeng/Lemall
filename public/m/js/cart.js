$(function () {
    // 下拉刷新功能
    mui.init({
        pullRefresh: {
            container: ".mui-scroll-wrapper", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            down: {
                height: 50, //可选,默认50.触发下拉刷新拖动距离,
                auto: true, //可选,默认false.首次加载自动下拉刷新一次
                contentdown: "下拉可以刷新", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
                contentover: "释放立即刷新", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
                contentrefresh: "正在刷新...", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
                callback: function () {
                    setTimeout(function () {
                        render();
                        mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh(true);
                        $('.total').text('0.00');
                    }, 1000);
                }

            }
        }
    });
    // 点击删除功能
    $('#OA_task_2').on('tap', '.btn_delete', function () {
        var id = $(this).data('id');
        mui.confirm("你是否要删除这件商品", "温馨提示", ["否", "是"], function (e) {
            if (e.index == 1) {
                $.ajax({
                    url: '/cart/deleteCart',
                    data: {
                        id: id
                    },
                    success: function (info) {
                        if (info.success) {
                            //只需要使用代码 执行一次下拉刷新即可
                            mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading();
                        }
                    }
                })
            }

        })

    })
    // 点击编辑功能
    $('#OA_task_2').on('tap', '.btn_edit', function () {
        var data = this.dataset;
        var html = template('tpl_model', data);
        // 将html字符串中的换行符换成空字符串
        html = html.replace(/\n/g, '');
      
        mui.confirm(html, "编辑商品", ["确定", "取消"], function (e) {
            if (e.index == 0) {
                  //获取到id，size num 发送ajax请求
                var id = data.id;
                var size = $(".prosize span.active").text();
                var num = $(".mui-numbox-input").val();
                $.ajax({
                    type: 'post',
                    url: '/cart/updateCart',
                    data: {
                        id: id,
                        size: size,
                        num: num
                    },
                    success: function (info) {
                        console.log(info);
                        if (info.success) {
                            //只需要使用代码 执行一次下拉刷新即可
                            mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading();

                        }
                    }
                })
            }
        })

         // 点击模态框里的span高亮,并且使数字框里的值可以选
         $('.prosize span').on('click', function () {
            $(this).addClass('active').siblings().removeClass('active');
        })
         mui('.mui-numbox').numbox();
    })

    // 计算总金额
    $('.btn_order').on('click',function() {
        // console.log('haha');
        var total = 0;
        $('.ck:checked').each(function(i,ele){
            total += $(this).data('price') * $(this).data('num');
        })
        $('.total').text(total.toFixed(2));
    })
    function render() {
        $.ajax({
            type: 'get',
            url: '/cart/queryCart',
            success: function (info) {
                console.log(info);
                $('#OA_task_2').html(template('tpl', {
                    list: info
                }))
            }
        })
    }

})