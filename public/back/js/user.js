// 发送ajax 获取数据 渲染

$(function(){
  var currentPage = 1;
  var pageSize = 5;
  render();

  function render(){
    $.ajax({
      type: "get",
      url: "/user/queryUser",
      dataType: "json",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      success: function(res){
        var htmlStr = template('userTpl',res);
        $('.l_content tbody').html(htmlStr);
  
        // 分页
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion:3,
          currentPage: res.page,
          
          totalPages: Math.ceil(res.total/res.size),

          onPageClicked: function(a,b,c,page){
            currentPage = page;
            render();
          }
        })
      }
    })
  };

  // 修改状态 禁用启用
  $('.l_content tbody').on('click','button',function(){
    // 弹出模态框
    $('#updateModal').modal('show');
    // 获取当前id
    var id = $(this).parent().data('id');
    console.log(id);
    // success 表示当前为禁用状态 将来状态为启用状态 故为 1
    var isDelete = $(this).hasClass('btn-success') ? 1 : 0;

    $('#updateBtn').off('click').click(function(){
      // 发送ajax
      $.ajax({
        type: 'post',
        url: '/user/updateUser',
        dataType: 'json',
        data: {
          id : id,
          isDelete: isDelete
        },
        success: function(res){
          // 关闭模态框
          $('#updateModal').modal('hide');
          render();
        }
      })

    });


  });


});