//Site JS functions
//Flag the current page in the nav bar
/*        $(document).ready(function() {
            // Example: Add 'active' class to nav-link matching current URL
            var currentPath = window.location.pathname.split('/').pop();
            $('.nav-link').each(function() {
                var linkPath = $(this).attr('href').split('/').pop();
                if (currentPath === linkPath) {
                    $(this).addClass('active');
                }
            });
        });
*/
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

function showId(id)
{
    const element = document.getElementById(id);
    element.scrollIntoView();
}

function toggleCover(event)
{
    event.stopPropagation()
    $('#altcover').toggle()

}