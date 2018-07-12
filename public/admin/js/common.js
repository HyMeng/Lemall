/* 
ajax有6个全局事件
  ajaxStart()
  ajaxSend()
  ajaxSuceess()
  ajaxError()
  ajaxComplete()
  ajaxStop()
*/
$(document).ajaxStart(function(){
    //开启进度条
    NProgress.start();
})
$(document).ajaxStop(function(){
    setTimeout(function() {
        // 关闭进度条
        NProgress.done();
    },500)
})

//二级菜单显示与隐藏效果
$(".subnav").prev().on("click", function (e) {
    $(this).next().slideToggle();
  });
//侧边栏隐藏
$('.icon_menu').on('click',function(){
    $('body').toggleClass('active');
    $('.le_aside').toggleClass('active');
    $('.header').toggleClass('active');
})
// 退出登录功能
$(".icon_logout").on('click',function() {
    $('#myModal').modal('show');
})
$('.btn_logout').on('click',function(){
    $.ajax({
        url: '/employee/employeeLogout',
        success: function(info) {
            // console.log(info);
            if(info.success){
                location.href = './login.html';
            }
        }
    })
})
