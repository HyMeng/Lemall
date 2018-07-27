$(function() {
    var id = getSearch().id;

    $.ajax({
        type: 'get',
        url: '/product/queryProductDetail',
        data: {
            id: id
        },
        success: function(info) {
            console.log(info);
            $('.mui-scroll').html(template('tpl',info));
            //重新初始化页面中轮播图
            mui(".mui-slider").slider({
                interval: 2000
            });
              // 点击模态框里的span高亮,并且使数字框里的值可以选
            $('.lt_size span').on('click', function () {
                $(this).addClass('active').siblings().removeClass('active');
            })
            mui('.mui-numbox').numbox();
        }
    })
     //功能二：加入购物车的功能
    //1. 给加入购物车的按钮注册点击事件
    //2. 发送ajax请求， productId   num  size
    $('.btn_addcart').on('click',function() {
        // console.log('ahha');
        var size = $('.lt_size span.active').text();
        var num = $('.mui-numbox-input').val();
        if(!size) {
            mui.toast("请选择尺码");
            return;
        }
        $.ajax({
            type: 'post',
            url: '/cart/addCart',
            data: {
                productId: id,
                size: size,
                num: num
            },
            success: function(info) {
                console.log(info);
                if(info.error) {
                    mui.confirm('亲,您还未登录,是否进行登录','温馨提示',['确定','取消'],function(e) {
                        if(e.index===0) {
                            location.href = 'login.html?retUrl='+location.href;
                        }
                    })
                }
                else{
                    mui.confirm('亲,您已加入购物车','温馨提示',['继续浏览','前往购物车'],function(e) {
                        if(e.index===1) {
                            location.href = 'cart.html';
                        }
                    })
                }
            }
        })
    })
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    // 封装一个获取地址栏产数的函数
     function getSearch() {
        var search = location.search;
        search = decodeURI(search);
        search = search.slice(1);
        var arr = search.split('&');
        var obj = {};
        arr.forEach(function (item, index) {
            var k = item.split('=')[0];
            var v = item.split('=')[1];
            obj[k] = v;
        })
        return obj;
    }

})