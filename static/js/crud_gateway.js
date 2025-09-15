/*
    This module is imported into the table editors.
    The doEdit function is the gateway to all of the
    crud functionallity server side using Flask routes
*/

//Sets off the server crud calls
export function doEdits(op, event)
{
    event.preventDefault();
    opcode = op
    if (!validateEditRequest()) return
    callCrudFunction(crudSuccess, crudFailed)
    
}

//Error handler for crud calls
export function crudFailed ()
{
    alert('Crud Call Failed: ' + returnedResult)
}

//Success handler for the crud service calls
//The result is left in the returnedResult variable in crud.js
export function crudSuccess()
{
    //Error message?
    if (typeof returnedResult == 'string' && returnedResult.includes('Error:'))
    {
        const opcodeCap = opcode.charAt(0).toUpperCase() + opcode.slice(1); //ucfirst the opcode
        alert(opcodeCap  +': ' + returnedResult)
        return
    }

    //Success Handlers
    switch (opcode)
    {
        case 'create':
            alert('Record created.')
            currentId = returnedResult
            conditions = 'id=' + currentId //Preset for read, update and delete
            break
        case 'read':
            populateTheFormFields(returnedResult)
            break
        case 'update':
            alert('Record updated.')
            break
        case 'delete':
            alert('Record deleted.')
            break
        default:
            alert(`${opcode} is not a valid operation code.`)
            break
    }
    
}
