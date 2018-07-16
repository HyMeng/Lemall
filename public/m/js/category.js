$(function () {
    render();
    function render(){
        $.ajax({
            type: 'get',
            url: '/category/queryTopCategory',
            success: function(info) {
                console.log(info);
                $('.category_lt').html(template('tpl',info));
                renderRight(info.rows[0].id);
            }
        })
    }

    // 遍历左侧分类列表注册点击事件
    $('.category_lt').on('click','li',function(){
        var id = $(this).data('id');
        console.log($(this).addClass('active').siblings().removeClass('active'));
        renderRight(id);
    })
    // 渲染右侧商品分类列表
    function renderRight(id) {
        $.ajax({
            type: 'get',
            url: '/category/querySecondCategory',
            data: {
                id: id
            },
            success: function(info) {
                console.log(info);
                $('.category_rt').html(template('tpl2',info));
            }
        })
    }
})