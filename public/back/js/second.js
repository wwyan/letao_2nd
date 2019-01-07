$(function(){
  
  // 发送ajax 获取数据 模板渲染
  var currentPage = 1;
  var pageSize = 5;

  render();
  
  function render(){
    $.ajax({
      type: 'get',
      url: '/category/querySecondCategoryPaging',
      dataType: 'json',
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      success: function(res){
        var htmlStr = template('secondTpl',res);
        $('.l_content tbody').html(htmlStr);
        // 设置分页
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage : res.page,
          totalPages: Math.ceil(res.total/res.size),
          onPageClicked: function(a,b,c,page){
            currentPage = page;
            render();
          }
        })
      }
    })
  };

  // 点击添加 显示模态框

  $('#addBtn').on('click',function(){
    $('#addSecondModal').modal('show');

    // 发送ajax 获取分类数据
    $.ajax({
      type: 'get',
      url: '/category/queryTopCategoryPaging',
      dataType: 'json',
      data: {
        page: 1,
        pageSize: 100
      },
      success: function(res){
        console.log(res);
        var htmlStr = template('dropdownTpl',res);
        $('.dropdown-menu').html(htmlStr);
      }
    })
  });

  // 给下拉菜单 里的a 注册事件
  $('.dropdown-menu').on('click','a',function(){
    // 获取选中的值
    var text = $(this).text();
    // 赋值给dropdownText
    $('#dropdownText').text(text);
    // 获取下拉分类 id
    var id = $(this).data('id');
    $('[name="categoryId"]').val(id);
    // 手动验证
    $('#form').data('bootstrapValidator').updateStatus('categoryId','VALID');
  });
  // 配置fileupload
  $('#fileupload').fileupload({
    dataType: 'json',
    done: function(e,data){
      var picUrl = data.result.picAddr;
      // 赋值给imgbox 的img
      $('#imgBox img').attr('src',picUrl);

      // 地址赋值给 隐藏域 用于提交
      $('[name="brandLogo"]').val(picUrl);

      // 手动验证
      $('#form').data('bootstrapValidator').updateStatus('brandLogo',"VALID");
    }
  })

  // 表单验证
  $('#form').bootstrapValidator({
      // 配置不校验的类型, 对 hidden 需要进行校验
      excluded: [],
  
      // 配置图标
      feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',    // 校验成功
        invalid: 'glyphicon glyphicon-remove',   // 校验失败
        validating: 'glyphicon glyphicon-refresh'  // 校验中
      },
  
      // 配置校验字段
      fields: {
        categoryId: {
          validators: {
            notEmpty: {
              message: "请选择一级分类"
            }
          }
        },
        brandName: {
          validators: {
            notEmpty: {
              message: "请输入二级分类名称"
            }
          }
        },
        brandLogo: {
          validators: {
            notEmpty: {
              message: "请上传图片"
            }
          }
        }
      }
  });
  // 验证成功事件
  $('#form').on('success.form.bv',function(e){
    // 阻止默认提交
    e.preventDefault();

    // 发送ajax发送数据
    $.ajax({
      type: 'post',
      url: '/category/addSecondCategory',
      dataType: 'json',
      data: $('#form').serialize(),
      success: function(res){
        // 关闭模态框 
        $('#addSecondModal').modal('hide');
        // 重新渲染
        currentPage = 1;
        render();
        // 重置表单
        $('#form').data('bootstrapValidator').resetForm(true);

      }
    })

  });

})

