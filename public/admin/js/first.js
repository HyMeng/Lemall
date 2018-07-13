$(function () {
    // 加载页面就重新渲染页面
    var page = 1;
    var pageSize = 4;
    render();
    // 添加分类功能
    $('.btn-add').on('click', function () {
        $('#addModal').modal('show');
    })
    //使用表单校验插件
    $('form').bootstrapValidator({
        //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
        // excluded: [':disabled', ':hidden', ':not(:visible)'],

        //2. 指定校验时的图标显示，默认是bootstrap风格
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok-circle',
            invalid: 'glyphicon glyphicon-remove-circle',
            validating: 'glyphicon glyphicon-refresh'
        },

        //3. 指定校验字段
        fields: {
            //校验用户名，对应name表单的name属性
            categoryName: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '分类名称不能为空'
                    },
                    //长度校验
                    stringLength: {
                        min: 1,
                        max: 10,
                        message: '分类名长度必须在1到10之间'
                    }
                }
            }
        }

    });
    $("form").on('success.form.bv', function (e) {
        e.preventDefault();
        //使用ajax提交逻辑
        $.ajax({
            type: 'post',
            url: '/category/addTopCategory',
            data: $('form').serialize(),
            success: function(info) {
                console.log(info);
                if(info.success) {
                    page = 1;
                    $('#addModal').modal('hide');
                    render();
                    $("form").data("bootstrapValidator").resetForm(true);
                }
            }
        })
    });
    function render() {
        $.ajax({
            type: 'get',
            url: '/category/queryTopCategoryPaging',
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
                    totalPages: Math.ceil(info.total / pageSize), //总页数
                    size: "small", //设置控件的大小，mini, small, normal,large
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