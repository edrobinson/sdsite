/*
    JS CRUD utilities
    
    This script is included in the base template.
    It provides a function that invokes the flask crud route
    which calls the crud py class
    
    
    The crud class returns this structure which is returned to the caller:

        crudresponse = {
           "ok" : "",           If true, success
           "msg" :  "",       Message returned 
            "id" : "",          PK returned from insert
            "values" : ""    DB record for reads
         }
*/

/*
    callCrud() does a fetch to the crud route passing the page's form.
    It returns the crud response detailed above.
    Parameters:
        table is name of the table to use
        opcode is the requested crud operation
        
    All of the pages have a form named "form1" which was geneated by the formgen utility.
    The forms contain 3 hidden inputs - id, table and opcode. Table and opcode are inputs to the
    crud service. id is populated by the callers read handler and is available to the read, update and delete services.
*/

var crudresult;

function callCrud(table, opcode)
{
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
                alert('An HTTP error ocurred: ' + response.status)
                return
            }
            return response.json()
        })
        .then(data =>{
           alert(data) 
           handleBlogResponse(data, opcode)
        })
    }catch (error){
       alert('Crud Call Failed: ' + error)
    }
} 

//The crud js returns the response structure from the crud route.
//This function evaluates it and responds appropriaety.
function xhandleBlogResponse(data, opcode)
{
    switch (opcode)
    {
        case 'insert':
            alert(data['msg'])
            break
        case 'delete':
            alert(data['msg'])
            break
        case 'read':
            if (data['ok'])
            {
                updateScreen(data)
                
            }else{
                alert(data['msg'])
            }
            break
        case 'readall':
            if (data['ok']) return data['values']
            alert(data['msg'])
            break
        case 'update':
            alert(data['msg'])
            break
        case 'select':
            alert(data['msg'])
            break
        default:
            alert('Unrecognized response:' + data['msg'])
            break
    }
}
   
