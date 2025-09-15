/*
    Contact Form Javascript
    Doing a simple ajax call with Jquery post().
    
    
*/

function submitForm() {
  fdata = $('#form1').serialize();

  $.ajax({
    url: "contact-server.php",
    type: "GET",
    data: fdata,
    })
    .done(function(msg) {
      alert(msg);
    });
}
