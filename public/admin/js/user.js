$(function() {
    // 加载页面就重新渲染页面
    var page=1;
    var pageSize=5;

    render();
    function render() {
        $.ajax({
            type: 'get',
            url: '/user/queryUser',
            data: {
                page: page,
                pageSize: pageSize
            },
            success: function(info) {
                console.log(info);
                var html = template('tpl',info);
                $('tbody').html(html);
                    // 设置分页
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion:3,//默认是2，如果是bootstrap3版本，这个参数必填
                    currentPage: page,//当前页
                    totalPages: Math.ceil(info.total / pageSize),//总页数
                    size:"small",//设置控件的大小，mini, small, normal,large
                    onPageClicked:function(event, originalEvent, type,p){
                    //为按钮绑定点击事件 page:当前点击的按钮值
                        page = p;
                        render();
                    }
                });
            }
        })
    }
    // 点击禁用或开启功能
    $('tbody').on('click','.btn',function(){
        $('#userModal').modal('show');
        var id = $(this).parent().data('id');
        console.log(id);
        var isDelete = $(this).hasClass('btn-success') ? 0:1;
        $('.btn_confirm').off().on('click',function(){
            $.ajax({
                type: 'post',
                url: '/user/updateUser',
                data: {
                    id: id,
                    isDelete: isDelete
                },
                success: function(info) {
                    console.log(info);
                    if(info.success){
                        $('#userModal').modal('hide');
                        render();
                    }
                }
            })
        })
    })
    
})