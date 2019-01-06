// 发送ajax请求 判断是否登录
$.ajax({
  type: "get",
  url: "/employee/checkRootLogin",
  dataType: "json",
  success: function(res){
    if(res.success){
      return
    }
    if(res.error === 400){
      localtion.href = "login.html"
    }
  }
})