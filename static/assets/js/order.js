/*
    Contact Form Javascript
    Doing a simple ajax call with Jquery post().
    
    
*/

function submitForm() {
  fdata = $('#form1').serialize();
alert(fdata); return;
  $.ajax({
    url: "order-server.php",
    type: "POST",
    data: fdata,
    })
    .done(function(msg) {
      alert(msg);
    });
}
