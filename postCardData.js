function post_address(id, money, success){
  $.ajax({
      url: 'post-address.php',
      type:'POST',
      dataType: 'json',
      data : {id : id, money : money },
      success: success,
      error: function(XMLHttpRequest, textStatus, errorThrown) {
                   alert("error");
     }
    });
}
