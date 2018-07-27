$(function(){
    // 第一步渲染页面
   
    // var arr = ["阿迪", "耐克", "李宁"];
    // localStorage.setItem("mhy_history", JSON.stringify(arr))
    render();
  //功能二：清空功能
  //思路：
  //1. 给清空按钮注册点击事件（委托）
  //2. 删除localStorage中 hcc_history这个key
  //3. 重新渲染
    $('.lt_history').on('click','.btn_empty',function(){
        mui.confirm("你确定要删除吗?", "温馨提示", ["取消", "确定"], function (e) {
            if(e.index == 1){
                localStorage.removeItem('mhy_history');
                render();
            }
        } )
    })
    // 删除功能
    $('.lt_history').on('tap','.btn_delete',function() {
        var that=this;
        mui.confirm("你确定要删除吗?", "温馨提示", ["取消", "确定"], function (e){
            if(e.index == 1) {
                var index = $(that).data('index');
                console.log(index);
                var history = getHistory();
                history.splice(index,1);
                localStorage.setItem('mhy_history',JSON.stringify(history));
                render();
            }
        })
    })
    // 添加历史记录功能
    $('.lt_search .btn_search').on('click',function() {
        var val = $('.lt_search .search_input').val();
        $('.lt_search .search_input').val('');
        if(val==''){
            mui.toast("请输入搜索的内容");
            return;
        }
        var history = getHistory();
        if(history.indexOf(val) != -1) {
            // 即存在当前输入项 将之前的相同项删除
            history.splice(history.indexOf(val) ,1)
        }  
        if(history.length>9) {
            history.pop();
        }
        history.unshift(val);
        
        localStorage.setItem('mhy_history',JSON.stringify(history));
        render();
         //把页面跳转到列表 将搜索框内的产数拼接在地址栏后面
        location.href = "searchList.html?key="+val;
    })
    
//    获取历史记录的函数
    function getHistory() {
        var result = localStorage.getItem('mhy_history');
        return JSON.parse(result) || []; 
    }
       
    function render() {
        var history = getHistory();
        // console.log(arr);
        $('.lt_history').html(template('tpl',{list: history}));
    }

})