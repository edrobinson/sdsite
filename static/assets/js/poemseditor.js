  /*
      Page Editor Form Javascript
      Doing a simple ajax call with Jquery post().
      
      
  */
  
  //Read the config when the select changes
  function readOption()
  {
    var seloption = $('#optlist').find(":selected").text();
    if (seloption == '')
    {
        alert('No option selected.');
        return;
    }

    //Get the optoin name from the select string
    //Format option:description
    pos = seloption.indexOf(':');
    seloption = seloption.substring(0,pos);
      
    $('#opt').val(seloption);
    handleRequest('read');
  }

  //Button click handler
  //Set the requested op code in 
  //the form and call the submit function.
  function handleRequest(opcode) {
    event.preventDefault();
    $("#opcode").val(opcode);
    submitForm();
  }

  //Run an ajax call to the sever to handle the user request.
  function submitForm() {
    fdata = $('#form1').serialize();

    $.ajax({
      url: "poems-editor.php",
      type: "GET",
      data: fdata,
      })
      .done(function(msg) {
        handle_result(msg);
      });
  }

  //Process the outcome of the request

  //Expected kind of result:
  //{"id":1,"page":"about","tag":"caption","tagval":"About Me"} = success
  //>...  message from server format
  function handle_result(msg)
  {
    //alert(msg);return;
    x = msg.trim();
    if (x == 'false')
    {
      alert('No record found...')
      return;
    }
    //Is it just a message to alert? (begins with ">" if so)
    if(msg.slice(0,1) == '>')
    {
      alert(msg.slice(1));
      return;
    }
    
    //Populate the form 
    result = JSON.parse(msg);
    for(var property of Object.getOwnPropertyNames(result))
    {
       var fld = '#'+property; //input id
      
      var vlu = result[property]; //input value
      
      $(fld).val(vlu); //fill qith JQ
    }
  }
  
  function formReset() {
  document.getElementById("form1").reset();
}

    
    
    

