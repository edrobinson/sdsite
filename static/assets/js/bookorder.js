/* Book order form js */
/*
    Book Order Form Javascript
    Doing a simple ajax call with Jquery post().
    
    
*/

function submitForm() {
  formdata = $('#form1').serialize();
 // alert(formdata); return;
  $.ajax({
    url: "order-server.php",
    type: "GET",
    data: formdata
    })
    .done(function(msg) {
      alert(msg);
    });
}

