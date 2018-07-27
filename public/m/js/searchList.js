$(function () {

    var page = 1;
    var pageSize = 4;
    var key = getSearch().key;
    //2. 把key放到搜索栏里面
    $(".lt_search input").val(key);
    //3. 发送ajax请求
    // 首次进入页面渲染商品
    // render();


    //处理第四个参数的问题
    //1. 先把需要发送参数放到一个对象
    //2. 确定是否需要发送第四个参数
    //3. 确定发送的type  发送value
    function render(callback) {
        var obj = {
            page: page,
            pageSize: pageSize,
            proName: key
        };
        // 开始处理第三个参数
        var $checkedLi = $('.lt_sort li.active');
        if ($checkedLi.length === 1) {
            var type = $checkedLi.data('type');
            var value = $checkedLi.find('.fa').hasClass('fa-angle-down') ? 1 : 2;
            obj[type] = value;
        }
        $.ajax({
            type: 'get',
            url: '/product/queryProduct',
            data: obj,
            success: function (info) {
                console.log(info);
                callback(info);
                // $('.lt_goods').html(template('tpl', info));
            }
        })


    }
    // 搜索功能
    $('.lt_search button').on('click',function(){
        var val = $('.search_input').val();
        location.href = 'searchList.html?key=' + val;
    })
    // 三、排序功能
    // 使用了mui动态渲染后,click失效,要用tap来完成
    $('.lt_sort li[data-type]').on('tap', function () {
        if ($(this).hasClass('active')) {
            $(this).find('.fa').toggleClass('fa-angle-down').toggleClass('fa-angle-up');
        } else {
            $(this).addClass('active').siblings().removeClass('active');
            $(".lt_sort .fa").removeClass('fa-angle-up').addClass('fa-angle-down');
        }
         //只需要使用代码 执行一次下拉刷新即可
        mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading();
    })

    // 下拉刷新功能
    mui.init({
        pullRefresh : {
          container:".mui-scroll-wrapper",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
          down : {
            height:50,//可选,默认50.触发下拉刷新拖动距离,
            auto: true,//可选,默认false.首次加载自动下拉刷新一次
            contentdown : "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
            contentover : "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
            contentrefresh : "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
            callback : function() {
                page=1;
               setTimeout(function(){
                render(function(info){
                    $('.lt_goods').html(template('tpl', info))
                });
                mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh(true);
                //重置上拉加载功能，保证上拉加载功能在下拉刷新之后能继续的使用
               mui('.mui-scroll-wrapper').pullRefresh().refresh(true);
               },1000);
            

            }
          },
          up: {
            auto: false,
            callback : function() {
                page++;
                render(function(info){
                    console.log(info);
                    $('.lt_goods').append(template('tpl', info))
                    // 结束下拉刷新
                    mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh(info.data.length === 0);

                });
              
            
               
            }
          }
        }
      });
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