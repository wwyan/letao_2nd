$(function(){

  // 发送ajax 获取数据 渲染

  var currentPage = 1;
  var pageSize = 2;
  var picArr = [];

  render();

  function render(){
    $.ajax({
      type: 'get',
      url: '/product/queryProductDetailList',
      dataType: 'json',
      data: {
        page: currentPage,
        pageSize: pageSize,
      },
      success: function(res){
        var htmlStr = template('proTpl',res);
        $('.l_content tbody').html(htmlStr);

        // 分页
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion: 3,
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

  // 点击添加按钮 显示模态框

  $('#addProBtn').on('click',function(){
    $('#addProModal').modal('show');

    // 发送ajax 获取分类数据
    $.ajax({
      type: 'get',
      url: '/category/querySecondCategoryPaging',
      data: {
        page: 1,
        pageSize: 100
      },
      dataType: 'json',
      success: function(res){
        var htmlStr = template("dropdownTpl", res);
        $('.dropdown-menu').html( htmlStr );
        // 分页
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: res.page,
          totalPages: Math.ceil( res.total / res.size ),
          onPageClicked: function(a,b,c,page){
            currentPage= page,
            render();
          }
        })
      }

    });
  });

  // 给下拉框的 a 注册点击事件
  $('.dropdown-menu').on('click','a',function(){
    // 获取当前内容
    var txt = $(this).text();
    // 赋值给dropdownText
    $('#dropdownText').text(txt);

    // 获取id
    var id = $(this).data('id');
    // 赋值
    $('#dropdownText').val(id);
    
    // 手动 验证
    $('#form').data('bootstrapValidator').updateStatus('brandId',"VALID");

  });

  // 文件上传
  $('#fileupload').fileupload({
    dataType: 'json',
    done: function(e,data){
      // 获取图片地址 后面添加的添加到最前面
      var picObj = data.result;

      picArr.unshift(picObj);

      // 图片地址
      var picUrl = picObj.picAddr;

      // 赋值给img 
      
      $('#imgBox').prepend('<img src="'+ picUrl +'" style="width:100px" alt="">');

      // 规定 需要上传3张图片
      if(picArr.length > 3){
        // 删除最后一张
        picArr.pop();
        
        $('#imgBox img:last-of-type').remove();

      }
      if(picArr.length === 3){
        // 手动验证
        $('#form').data('bootstrapValidator').updateStatus('picStatus','VALID');
      }
    }

  });


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
      brandId: {
        validators: {
          notEmpty: {
            message: "请选择二级分类"
          }
        }
      },
      proName: {
        validators: {
          notEmpty: {
            message: "请输入商品名称"
          }
        }
      },
      proDesc: {
        validators: {
          notEmpty: {
            message: "请输入商品描述"
          }
        }
      },
      num: {
        validators: {
          notEmpty: {
            message: "请输入商品库存"
          },
          // 商品库存格式, 必须是非零开头的数字
          // 需要添加正则校验
          // 正则校验
          // 1,  11,  111,  1111, .....
          /*
          *   \d 表示数字 0-9
          *   +     表示出现1次或多次
          *   ?     表示出现0次或1次
          *   *     表示出现0次或多次
          *   {n}   表示出现 n 次
          *   {n,m} 表示出现 n 到 m 次
          * */
          regexp: {
            regexp: /^[1-9]\d*$/,
            message: '商品库存格式, 必须是非零开头的数字'
          }
        }
      },
      size: {
        validators: {
          notEmpty: {
            message: "请输入商品尺码"
          },
          // 要求: 必须是 xx-xx 的格式, xx为两位的数字
          regexp: {
            regexp: /^\d{2}-\d{2}$/,
            message: '必须是 xx-xx 的格式, xx为两位的数字, 例如: 36-44'
          }
        }
      },
      oldPrice: {
        validators: {
          notEmpty: {
            message: "请输入商品原价"
          }
        }
      },
      price: {
        validators: {
          notEmpty: {
            message: "请输入商品现价"
          }
        }
      },
      picStatus: {
        validators: {
          notEmpty: {
            message: "请上传三张图片"
          }
        }
      }
    }
  });

  // 验证成功
  $('#form').on('success.form.bv',function(e){

    var prams = $('#form').serialize();
    prams += "&picArr=" + JSON.stringify(picArr);

    // 阻止默认提交
    e.preventDefault();
    // 发送ajax
    $.ajax({
      type: 'post',
      url: '/product/addProduct',
      dataType: 'json',
      data: prams,
      success: function(res){
        if(res.success){
          // 关闭模态框
          $('#addProModal').modal('hide');
          // 重新渲染
          currentPage = 1;
          render();

          // 重置表单
          $('#form').data('bootstrapValidator').resetForm(true);
          // 重置下拉框
          $('#dropdownText').text('请选择二级分类')

          // 重置图片
          $('#imgBox img').remove();

        }

      }
    })


  })


});