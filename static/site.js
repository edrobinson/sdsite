//Site JS functions
//Flag the current page in the side menu.
$( document ).ready(function() {
    var path = window.location.pathname;
    var page = path.split("/").pop(); //Get the page name from the location
    if (page == '') page='home'
    var pid = page + 'page' //Page id i.e. homepage
   
    $('#' + pid).addClass('currentpg') //Color it and hange it's font
    
})

//Send the contact form to the backend for storage
function processContact(event)
{
    event.stopPropagation();
    const form = document.getElementById("form1");
    $('#opcode').val('insert')
    $('#table').val('contacts')
    var formData = new FormData(form);
    var msg = ''
    errs = validateContact(formData)
    if (errs != '')
    {
        alert(errs)
        return
    }
     
     fetch('/crud', { 
        method: 'POST', 
        body: formData
      })
    .then(response =>{
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
    })
    .then(data => {
        data = JSON.parse(data)
        if(data.id > 0) 
            alert('Thank you for contacting me. I will respond soon.')
         else if (data.id < 0)
            alert('Message:' +data.msg)
        else if (data.id == 0)
            alert('Failed to save your message. Please try again later') 
      })
      .catch(error => {
        alert('Unable to process your request now. Please try again later.'  + error)
       });
} 

function validateContact(formData)
{
    const requireds = ['name', 'email', 'subject', 'message']
    errs = ''
    for (const entry of formData.entries()) {
        key = entry[0]
        if (!requireds.includes(key)) continue

        if (entry[1] == '')
            errs += key + ' is required.' + "\n"
   
    }
     return errs    
}  

  
  function updateScreen(data)
  {
    if (data == 'ERROR')
    {
        alert('Unable to locate that record . . .')
        return
    }
    
    fields = data.data
    $('#id').val(fields[0])
    $('#path').val(fields[1])
    $('#name').val(fields[2])
    $('#description').val(fields[3])
  }
  
  function callHelp()
  {
      window.location.href = "/imagehelp";
  }

  function formReset() {
  document.getElementById("form1").reset();
  const textarea = document.getElementById('content');
  textarea.value = '';
}

//Show or hide the menu
function hamburgerToggler(event)
{
    $('#sidemenu').toggle()
}

