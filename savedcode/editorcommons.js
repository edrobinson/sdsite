/*
    This JS makes calls to the Flask crud route and handles the responses.
    In addition it contains a validation function that checks the form data
    for all required elements.
*/

var requiredFieldNames; 

//Handle the CRUD requests from the editor buttons
function processEdits(opcode, event) 
{
    event.stopPropagation();

    //Validate if making changes
    if (opcode == 'insert' || opcode == 'update')
    {
        const errs = formValidator()
        if (errs != '')
        {
            alert(errs)
            return
        }
    }

    if (opcode == 'delete' || opcode == 'update' && $('#id').val() == '')
        {
            alert('No Record ID available. Please load the record you want processed and try again.')
            return
        }
 
    //Setup and call the crud service
    $('#opcode').val(opcode)
    $('#table').val('blog')

    const form = document.getElementById('form1')
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
            data[key] = value;
    });

    try{
        fetch("/crud", {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-type": "application/json; charset=UTF-8" }
        })
        .then(response => {
            if(!response.ok){
                alert('An HTTP error ocurred. HTTP status: ' + response.status)
                return
            }
            return response.json()
        })
        .then(data =>{
           handleBlogResponse(data, opcode)
        })
    }catch (error){
       alert('Crud Call Failed: ' + error)
    }
} 
 
//The crud js returns the response structure from the crud route.
//This function evaluates it and responds appropriaety.
function handleBlogResponse(data, opcode)
{
    switch (opcode)
    {
        case 'insert':
        case 'delete':
        case 'update':
        case 'select':
            alert(data.msg)
            break
        case 'read':
            if (!data.ok)
            {
                alert(data.msg)
                return
            }
            
            //Fix the creation date
            dateString = data.created
            data.created = formatCreationDate(dateString)
            
            //Fill out the form
            for (const key in data) {
              if (data.hasOwnProperty(key)) {
                const value = data[key];
                $('#' + key).val(value)
              }
            }
            break
        case 'readall':
            if (data.ok) return data.values
            alert(data.msg)
            break
        default:
            alert('Unrecognized response:' + data.msg)
            break
    }
}

//Validate the user inputs
function formValidator()
{
    errs = ''
    const form = document.getElementById("form1");
    var formData = new FormData(form);
    
    for (const entry of formData.entries()) {
        key = entry[0]
        if (requiredFieldNames.includes(key))
        {
            if (entry[1] == '')
                errs += key + ' is required.' + "\n"
        }
    }
     return errs    
}
