
// 表单验证
$(function(){
  $('#form').bootstrapValidator({
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      username: {
        validators: {
          notEmpty: {
            message: "请输入用户名"
          },
           // 长度校验
          stringLength: {
            min: 2,
            max: 6,
            message: "用户名长度必须是 2-6 位"
          },
          // callback 专门用于配置回调的提示
          callback: {
            message: "用户名不存在"
          }
        }
      },
      password: {
        validators: {
          notEmpty: {
            message: "请输入密码"
          },
          stringLength: {
            min: 6,
            max: 12,
            message: "密码长度必须是 6-12 位"
          },
          callback: {
            message: "密码错误"
          }
        }
      }
    }

  });

  // 注册表单校验成功事件
  $('#form').on('success.form.bv',function(e){
    // 阻止默认提交
    e.preventDefault();

    // 发送ajax 验证登录
    $.ajax({
      type: 'post',
      url: '/employee/employeeLogin',
      dataType: 'json',
      data: $('#form').serialize(),
      success: function(res){
        // error 1000 用户名错误  1001 密码错误
        if(res.success){
          // 登陆成功 跳转index
          location.href = 'index.html';
          return;
        }

        if(res.error === 1000){
          $('#form').data('bootstrapValidator').updateStatus('username','INVALID','callback');
          return;
        }
        if(res.error === 1001){
          $('#form').data('bootstrapValidator').updateStatus('password','INVALID','callback');
          return;
        }
      }
    })
  });

  // 重置
  $('[type="reset"]').click(function(){
    // 此时内容以及别重置按钮重置了 只需重置样式
    $('#form').data('bootstrapValidator').resetForm();
  });

})