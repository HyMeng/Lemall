$(function() {
    $.ajax({
        url: '/user/queryUserMessage',
        success: function(info){
            console.log(info);
            if(info.error) {
                location.href = 'login.html';
            }else {
                $('.userinfo').html(template('tpl',info));
            }
        }
    })

    // 退出功能
    $('.btn_logout').on('click',function() {
        $.ajax({
            url: '/user/logout',
            success: function(info) {
                if(info.success) {
                    location.href = 'login.html';
                }
            }
        })
    })
})