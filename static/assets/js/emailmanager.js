  /*
        Email manager Form Javascript
        Doing a simple ajax call with Jquery post().
*/

  //The opcode from the just completed request
  var currentoperation = '';
  
  function toggleElement(element)
  {
    $('#'+element).toggle();
  }

  //Button click handler
  //Set the requested op code in 
  //the form and call the submit function.
  function handleRequest(opcode) {
      event.preventDefault();
      currentoperation = opcode; //Save for handling the response    
      $("#opcode").val(opcode);
      submitForm();
  }

  //Run an ajax call to the sever to handle the user request.
  function submitForm() {
      fdata = $('#form1').serialize();

      $.ajax({
              url:  'servers/emailmanager.php',
              type: "GET",
              data: fdata,
          })
          .done(function(msg) {
              alert('Received response');
              handle_result(msg);
          });

  }

  //Process the outcome of the request

  //Expected kind of result:
  //{"id":1,"page":"about","tag":"caption","tagval":"About Me"} = success
  //>...  message from server
  function handle_result(msg) {
      x = msg.trim();
      if (x == 'false') {
          alert('No record found...');
          return;
      }
      //Is it just a message to alert? (begins with ">" if so)
      if (msg.slice(0, 1) == '>') {
          alert(msg.slice(1));
          return;
      }

      msg = JSON.parse(msg);

      switch (currentoperation) {
          case 'msglist':
              if (msg == '') {
                  return
              } else {
                  $('#msglist').html(msg)
              }
              break
          case 'emaillist':
              $('#emaillist').html(msg)
              break
          case 'loadmsg':
              $('#msg').html(msg.template)
              break
          case 'loadhtmlmsg':
              $('#msg').html(msg.template)
              break
          default:
              alert('Unrecognized server response ' + currentoperation + '  ' + msg)
      }
  }
  
  function handleFailure(msg)
  {
    switch (typeof(msg)){
        case 'string':
            alert(msg);
            break;
        case 'object':
            msg = JSON.parse(msg);
            alert(msg);
            break;

        default:
            alert(msg);
    }
    
  }

  function formReset() {
      document.getElementById("form1").reset();
  }