// 进度条

$(document).ajaxStart(function(){
  NProgress.start();

})

$(document).ajaxStop(function(){
  setTimeout(function(){
    NProgress.done();
  })

},500);

$(function(){
  // 二级菜单
  $('.nav .category').click(function(){
    $(this).next().stop().slideToggle();
  });

  // topbar 菜单按钮 左侧侧边栏隐藏
  $('.l_topbar .icon_menu').click(function(){
    $('.l_aside').toggleClass('hidemenu');
    $('.l_topbar').toggleClass('hidemenu');
    $('.l_main').toggleClass('hidemenu');
  });

  // 点击icon_logout 展示模态框
  $('.icon_logout').click(function(){
    $('#logoutModal').modal('show');

  });

  // 点击模态框 确定 发送ajax 退出
  $('#logoutBtn').click(function(){
    $.ajax({
      type: "get",
      url: '/employee/employeeLogout',
      dataType: 'json',
      success: function(res){
        if(res.success){
          location.href = "login.html"
        }
      }
    })

  })

});