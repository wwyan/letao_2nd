// 发送ajax请求 获取数据

$(function(){
  var currentPage = 1;
  var pageSize = 5;

  render();

  function render(){
    $.ajax({
      type: 'get',
      url: '/category/queryTopCategoryPaging',
      dataType: 'json',
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      success: function(res){
        var htmlStr = template('firstTpl',res);
        $('.l_content tbody').html(htmlStr);
  
        // 分页
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: res.page,
          totalPages: Math.ceil(res.total / res.size),
  
          onPageClicked: function(a,b,c, page){
            currentPage = page;
            render();
          }
        })
  
      }
    })
  }

  // 点击添加按钮
  $('#addBtn').on('click',function(){
    // 弹出模态框
    $('#addModal').modal('show');

    // 表单验证
    $('#form').bootstrapValidator({
      feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
      },
      fileds: {
        categoryName: {
          validators: {
            notEmpty: {
              message: "分类名不能为空"
            }
          }
        }
      }
    });

    // 表单验证成功
    $('#form').on('success.form.bv',function(e){
      // 阻止默认提交
      e.preventDefault();
      $.ajax({
        type: 'post',
        url: '/category/addTopCategory',
        dataType: 'json',
        data: $('#form').serialize(),
        success: function(res){
          if(res.success){
            // 关闭模态框
            $('#addModal').modal('hide');
            render();
            // 重置表单
            $('#form').data('bootstrapValidator').resetForm(true);
          }
        }
      })
    })

  });

  

});