$(function() {
    $('.btn_login').on('click',function() {
        var username = $("[type='text']").val();
        var password = $("[type='password']").val();
        console.log(username,password);
        if(!username) {
            mui.toast('请输入用户名');
            return;
        }
        if(!password) {
            mui.toast('请输入密码');
            return;
        }
        $.ajax({
            type: 'post',
            url: '/user/login',
            data: {
                username: username,
                password: password
            },
            success: function(info) {
                if(info.success) {
                    var search = location.search;
                    if(search.indexOf('retUrl') != -1) {
                        location.href = search.replace('?retUrl=','');
                    }else {
                        location.href = 'user.html';
                    }
                }else if(info.error) {
                    mui.toast(info.message);
                }
            }


        })
    })














})