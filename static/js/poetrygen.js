/*
    This script handles the conversion of poetey Word files
    into a centered html file
    
*/

function convertFile(event)
{
     event.stopPropagation();
    
     const url = '/convertpoem}';     
    try{
        fetch(url)
          .then(response => response.json())
          .then(data => {

              $('#book').html(data.content)
          })
    }
    catch(error){
        alert('Unable to process your request now. Please try again later.'  + error)
    }
}

