$(function () {
    // 加载页面就重新渲染页面
    var page = 1;
    var pageSize = 4;
    render();
    // 添加分类功能
    $('.btn-add').on('click', function () {
        $('#addModal').modal('show');
        //2.2 发送ajax请求，获取到一级分类的数据
        $.ajax({
            type: 'get',
            url: '/category/queryTopCategoryPaging',
            data: {
                page: 1,
                pageSize: 100
            },
            success: function(info) {
                console.log(info);
                $('.dropdown-menu').html(template('tpl2',info));
         
            }
        })
    })
    // 下拉框功能
    $('.dropdown-menu').on('click','a',function(){
        var id = $(this).data('id');
        $('.dropdown-text').text($(this).text());
        $("[name='categoryId']").val(id);
        //3.3 修改categoryId的校验状态，通过
        $("form").data("bootstrapValidator").updateStatus("categoryId", "VALID");
    })
    // 图片上传功能logo_img
    $("#fileupload").fileupload({
        dataType:"json",
        //e：事件对象
        //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
        done:function (e, data) {
            console.log(data);
            // 显示图片
            $('.logo_img').attr('src',data.result.picAddr);
            // 将图片路径赋值给input:file传递给后台
            $("[name='brandLogo']").val(data.result.picAddr);
             //3. 让brandLogo校验通过
            $('form').data('bootstrapValidator').updateStatus('brandLogo','VALID');
        }
    });
    // 校验form表单
    $('form').bootstrapValidator({
        //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
        excluded: [],
      
        //2. 指定校验时的图标显示，默认是bootstrap风格
        feedbackIcons: {
          valid: 'glyphicon glyphicon-ok',
          invalid: 'glyphicon glyphicon-remove',
          validating: 'glyphicon glyphicon-refresh'
        },
      
        //3. 指定校验字段
        fields: {
          //校验用户名，对应name表单的name属性
          brandName: {
            validators: {
              //不能为空
              notEmpty: {
                message: '请选择一级分类'
              }
            }
          },
          categoryId: {
            validators: {
              //不能为空
              notEmpty: {
                message: '请输入二级分类的名称'
              }
            }
          },
          brandLogo: {
            validators: {
              //不能为空
              notEmpty: {
                message: '请上传品牌图片'
              }
            }
          },
          
        }
      
      });
    //   表单校验成功后
    $('form').on("success.form.bv",function(e){
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/category/addSecondCategory',
            data: $('form').serialize(),
            success: function(info) {
                console.log(info);
                page = 1;
                render();
                $('#addModal').modal('hide');
                $('form').data('bootstrapValidator').resetForm(true);
                $('.dropdown-text').text('请选择一级分类');
                $('.logo_img').attr('src','./images/none.png');
            }
        })

    })
    function render() {
        $.ajax({
            type: 'get',
            url: '/category/querySecondCategoryPaging',
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