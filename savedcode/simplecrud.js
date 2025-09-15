/*
    This is a mod of crud.js that handles to the PyMySimpleSQLCRUD class.
    This main difference here is that we don't embed the parameters in the
    editor forms. Instead we pass a simple JSON that the class interprets.
*/

var requiredFields = [] //Callers fill this array with the fields required to create or update a record.
var formName              //Callers fill this with the name of the of the form to process
var tableName             //Callers fill this with the target table name
var opcode                  //Callers enter the desired crud operation here
var conditions = {}      //Caller sets the where conditions as a string
var suppressResponse = false //Caller sets this to true if it wants to handle response

var returnedResult = ''     //The server response for use by callers
var lastRecordId = ''        //The record id from the last read.

const controller = new AbortController();
const signal = controller.signal;

//This function handles preprocessing
//then calls for the crud task provided.
//Generlly used only by the editor pages.
function doEdits(task, event)
{
    event.stopPropagation();    
    opcode = task
    if (!validateEditRequest()){
        return
    }
    processEdits(event)
}


//Called by the onclick of the editor buttons or 
//by a direct call for a crud service from a JS script.
//Calls: performCrudOperation(tableName, operation, data = null, conditions = null) 
async function processEdits(event, signal) 
{
    
    //Get the form data and create a set of k/v pairs to pass in
    const form = document.getElementById(formName)
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
            data[key] = value;
    });
 
    //Make the call
    try{
       const result = await performCrudOperation(
            tableName,
            opcode,
            data,
            conditions
        );
        returnedResult = result
        console.log(`Crud Result: ${result}`);
    } catch (error) {
        op = capitalizeWord(opcode)
        msg = `${op} Error: ${error}`
        console.log(msg)
        alert(msg)
        return
    }

}

//Check everything befor attempting the server request
function validateEditRequest()
{
       //Validate the opcode
    const valid_opcodes = 'create read readall update delete' 
    if (-1 == valid_opcodes.indexOf(opcode))
    {
        alert(opcode + ' is not a valid operation code. Please contact the developer.')
        return false
    }
    
    //Validate inputs if making changes
    if (opcode == 'create' || opcode == 'update')
    {
        const errs = validateFormValues()
        if (errs != '')
        {
            alert(errs)
            return false
        }
    }

    //Make sure an id is available 
    const operationsNeedingId = ['read', 'update', 'delete']
    if (opcode in operationsNeedingId)
    {
        if (lastRecordId == '')
        {
            alert('No Record ID available. Please load the record you want processed and try again.')
            return false
        }
        conditions['id'] = lastRecordId
        alert(lastRecordId)
    }
    return true
} 
 
//This function interprets the response and provides
//appropriate feedback to the user.
function handleCrudResponse(data, opcode)
{
    data = JSON.parse(data)
    returnedResult = data //Save the response for the callers to use
    console.log(returnedResult)
    if (suppressResponse) //Caller wanting to handle the response
    {
        suppressResponse = false
        return
    }
    
    
    message = data['message']
    
    //If unsucessful, just alert the message and go back.
    if (data['success'] == false)
    {
        alert('Failed : ' + message)
        return
    }
    
    switch (opcode)
    {
        case 'delete':
        case 'update':
            alert(message)
            break
        case 'read':
            fields = data['data']
            populateTheFormFields(fields)
            break
        case 'readall': 
            return data.data
            break
        case 'create':
            $('#id').val(data.id) 
            alert(message)
            break
        default:
            alert('Unrecognized response:' + message)
            break
    }
}

//Validate the user inputs for create and update calls
function validateFormValues()
{
    errs = ''
    const form = document.getElementById(formName);
    var formData = new FormData(form);
    
    for (const entry of formData.entries()) {
        key = entry[0]
        if (!requiredFields.includes(key)) continue

        if (entry[1] == '')
            errs += key + ' is required.' + "\n"
    }
     return errs    
}

//Using the data from from a read request,
//populate the form as appropriate for the
//input types.
function populateTheFormFields(data)
{
    Object.entries(data).forEach(([key, value]) => {
        populateFormElement(key, value)
    }); 
} 

/**
 * Populates a form element with a given value based on its type.
 * Generated for me by Gemini . . . Ed 6/2/25
 *
 * @param {string} elementId The ID of the form element.
 * @param {*} value The value to set for the element.
  */
function populateFormElement(elementId, value) {
    const element = document.getElementById(elementId);

    if (!element) {
        console.warn(`Element with ID "${elementId}" not found.`);
        return;
    }

    // Handle common HTML input elements
    if (element instanceof HTMLInputElement) {
        switch (element.type) {
            case 'text':
            case 'password':
            case 'email':
            case 'number':
            case 'tel':
            case 'url':
            case 'search':
            case 'time':
            case 'date':
            case 'datetime-local':
            case 'week':
            case 'month':
            case 'range':
            case 'color':
            case 'hidden':
                element.value = value;
                break;
            case 'checkbox':
                // For checkboxes, value can be a boolean or match the element's value attribute
                if (typeof value === 'boolean') {
                    element.checked = value;
                } else {
                    element.checked = (element.value === String(value));
                }
                break;
            case 'radio':
                // For radio buttons, set checked if the value matches the element's value attribute
                element.checked = (element.value === String(value));
                break;
            case 'file':
                // File inputs cannot be set programmatically for security reasons.
                console.warn(`Cannot programmatically set value for file input with ID "${elementId}". Security restriction.`);
                break;
            case 'submit':
            case 'reset':
            case 'button':
            case 'image': // Image inputs often behave like submit buttons
                // These types are typically not 'populated' with a value in the same way.
                // Their value attribute is usually their display text.
                // If you need to change their display text, you'd set element.value = value.
                // For now, we'll just ignore for "population".
                break;
            default:
                console.warn(`Unhandled input type "${element.type}" for element with ID "${elementId}". Setting value directly as a fallback.`);
                element.value = value;
                break;
        }
    }
    // Handle textarea elements
    else if (element instanceof HTMLTextAreaElement) {
        element.value = value;
    }
    // Handle select elements
    else if (element instanceof HTMLSelectElement) {
        // For single-select dropdowns
        if (!element.multiple) {
            element.value = value; // This should select the option if it exists
        }
        // For multi-select dropdowns
        else {
            const valuesToSelect = Array.isArray(value) ? value.map(String) : [String(value)]; // Ensure array of strings

            Array.from(element.options).forEach(option => {
                option.selected = valuesToSelect.includes(option.value);
            });
        }
    }
    // Handle other potentially 'settable' elements (e.g., custom elements with a value property)
    // This is a fallback and might not work for all custom elements.
    else if ('value' in element) {
        try {
            element.value = value;
        } catch (e) {
            console.warn(`Could not set 'value' property for element with ID "${elementId}". Error:`, e);
        }
    } else {
        console.warn(`Element with ID "${elementId}" is not a recognized form element type and does not have a 'value' property to set.`);
    }
}

function capitalizeWord(word) {
  if (typeof word !== 'string' || word.length === 0) {
    return word; // Handle non-string or empty input
  }
  return word.charAt(0).toUpperCase() + word.slice(1);
}