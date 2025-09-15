/*
    This is the main site local js file 
*/





//Called by the form's buttons to request server service.
function handleRequest(opcode) {
  event.preventDefault();
  $("#opcode").val(opcode); //Fill in the requested operation

  //Add the tinymce if using it.
  if (usingtinymce) {
    $("#" + tinytarget).val(
      tinymce.activeEditor.getContent({ format: "html" })
    );
  }

  submitForm(); //Send the request
}

/*
        Call the server passing the form data which includes toe operation code
        
    */
function submitForm() {
  var formdata = JSON.stringify(jaxon.getFormValues("form1"));
  jaxon_dispatch("processForm", formdata);
}

function uploadForm() {
  JaxonUploads.saveFile();
}

function resetForm() {
  document.getElementById("form1").reset();
  bookFocuser();
}

//Reset the form, set the date and focus
function formReset() {
  document.getElementById("form1").reset(); //setTimeout(setDate(),1000)
  Focuser();
  return false;
}

//This function accepts a page key and displays the corresponding
//help html page from the assete/help folder.
//It is the destination of the help button in the editor button template.
//It could be invoked from any page if needed.
function callHelp(pagename) {
  switch (pagename) {
    case "text":
      window.location.assign("assets/help/PageTextEditorHelp.html");
      break;
    case "book":
      window.location.assign("assets/help/BooksEditorHelp.html");
      break;
    case "poem":
      window.location.assign("assets/help/PoetryEditor.html");
      break;
    case "blog":
      window.location.assign("assets/help/BlogEditorHelp.html");
      break;
    case "users":
      window.location.assign("assets/help/UsersEditorHelp.html");
      break;
    case "order":
      window.location.assign("assets/help/OrderEditorHelp.html");
      break;
    default:
      alert(pagename + " is not a valid help call parameter. Call Dad.");
  }
}

//Called by the form's buttons to request server service.
function handleRequest(opcode) {
  event.preventDefault();
  $("#opcode").val(opcode); //Fill in the requested operation

  //Add the tinymce if using it.
  if (usingtinymce) {
    $("#" + tinytarget).val(
      tinymce.activeEditor.getContent({ format: "html" })
    );
  }

  submitForm(); //Send the request
}

/*
        Call the server passing the form data which includes toe operation code
        
    */
function submitForm() {
  var formdata = JSON.stringify(jaxon.getFormValues("form1"));
  jaxon_dispatch("processForm", formdata);
}

function uploadForm() {
  JaxonUploads.saveFile();
}

function resetForm() {
  document.getElementById("form1").reset();
  bookFocuser();
}

//Reset the form, set the date and focus
function formReset() {
  document.getElementById("form1").reset(); //setTimeout(setDate(),1000)
  Focuser();
  return false;
}

//This function accepts a page key and displays the corresponding
//help html page from the assete/help folder.
//It is the destination of the help button in the editor button template.
//It could be invoked from any page if needed.
function callHelp(pagename) {
  switch (pagename) {
    case "text":
      window.location.assign("assets/help/PageTextEditorHelp.html");
      break;
    case "book":
      window.location.assign("assets/help/BooksEditorHelp.html");
      break;
    case "poem":
      window.location.assign("assets/help/PoetryEditor.html");
      break;
    case "blog":
      window.location.assign("assets/help/BlogEditorHelp.html");
      break;
    case "users":
      window.location.assign("assets/help/UsersEditorHelp.html");
      break;
    default:
      alert(pagename + " is not a valid help call parameter. Call Dad.");
  }
}

//Populate the lookup select and display it.
//This is the response to the lookup class call.
function lookupHandler(data) {
  $("#lupselect").empty(); //Clear the options out
  $("#lupselect").html(data); //Add the new ones
  $("#lupselect").show(); //Show the select
  document.getElementById("lupselect").focus(); //Focus on it
}

//This is the on change handler for the
//lookup select
function lookupRead(id) {
  //Super hack - put "lookup" in pagename
  //so read will do a crud read...
  $("#pagename").val("lookup");

  $("#lupselect").hide();
  $("#lastid").val(id);
  handleRequest("lookupread");
}

function showSdMenu() {
  var x = document.getElementById("menuDrop");
  if (x.className.indexOf("w3-show") == -1) {
    x.className += " w3-show";
  } else {
    x.className = x.className.replace(" w3-show", "");
  }
}

//Start the order process
function placeOrder(id) {
  let href = "orderform/" + id;
  window.location.assign(href);
}

//Populate the lookup select and display it.
//This is the response to the lookup class call.
function lookupHandler(data) {
  $("#lupselect").empty(); //Clear the options out
  $("#lupselect").html(data); //Add the new ones
  $("#lupselect").show(); //Show the select
  document.getElementById("lupselect").focus(); //Focus on it
}

//This is the on change handler for the
//lookup select
function lookupRead(id) {
  //Super hack - put "lookup" in pagename
  //so read will do a crud read...
  $("#pagename").val("lookup");

  $("#lupselect").hide();
  $("#lastid").val(id);
  handleRequest("lookupread");
}

function showSdMenu() {
  var x = document.getElementById("menuDrop");
  if (x.className.indexOf("w3-show") == -1) {
    x.className += " w3-show";
  } else {
    x.className = x.className.replace(" w3-show", "");
  }
}

//Start the order process
function placeOrder(id) {
  let href = "orderform/" + id;
  window.location.assign(href);
}
