/*
 This script provides acess to the crud functions 
 in the utilities.py in the src folder.
 
 Access is through the /crud/opcode route in app.py
 
The function "callCrudFunction()" invokes the route

It also provides utility functions to do validation and form fills
*/

//The following global variables are filled out by the caller before calling doEdits()
var requiredFields = [] //Array - names of the required for create and update
var formName              //String - name of the of the form to process
var tableName             //String - target table name
var columns                 //String - the columns for read and update -  'a, b, c' or '*'
var conditions              //String - where phrase content
var opcode                  //String - desired crud operation here
var suppressResponse = false //Bool  Caller sets this to true if it wants to handle response

//The following globals are populated by the crud calls
var returnedResult      //The server response - allways filled out for use by callers
var currentId               //The id of the last record read.
var success                 //Boolean indication of the outcome

/*
    Call the flask route "/crud/opcode"
*/
function callCrudFunction(onsuccess, onfail)
{
   //Get the form k/v data
   const values = getRequestData()

   //Create the parameters for the crud functions server side.
   let payload = {
        'opcode': opcode,               //Crud operation code create, read, etc
        'table': tableName,             //Target table - caller
        'data': values,                     //Form values -  gotten here
        'columns': columns,           //Columns for read and update. Comma seperated list of field names or * - caller
        'conditions': conditions     //Where phrase string - i.e. "id=19, name='Joe Blow'" - caller
    }

    //Make the call to a Flask route.
    performCrudFetch(JSON.stringify(payload), onsuccess, onfail)
}


//Gemini's suggested async function with callbacks
//7/2/25 - Made dynamic route and added opcode to the data
async function performCrudFetch(payload, onSuccess, onError) { 
    const url = '/crud/operation'
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
        }

        const data = await response.json(); //data is the returned json. Not a promise due to the await
        returnedResult = data;
        if (suppressResponse)
            return

        if (onSuccess && typeof onSuccess === 'function') {
            onSuccess(data); // <--- Call success callback
        }

    } catch (error) {
        returnedResult = `Error: ${error.message}`; // Still setting this if you need a global reference

        if (onError && typeof onError === 'function') {
            onError(returnedResult); // <--- Call error callback
        }
    }
}
 
//Get all of the form's k/v pairs
function getRequestData()
{
    //Get the form data
    const form = document.getElementById(formName)
    const formData = new FormData(form);
 
    //Create a list of formfield key : value pairs
    var requestData = {};
    for (const [key, value] of formData.entries()) {
        requestData[key] = value;
    }    
    return requestData
}

//Check everything before attempting the server request
function validateEditRequest()
{
   response = ''
       //Validate the opcode
    const valid_opcodes = 'create read update delete' 
    if (-1 == valid_opcodes.indexOf(opcode))
    {
        response += opcode + ' is not a valid operation code. Please contact the developer.\n'
    }
    
    //Validate inputs if making changes
    if (opcode == 'create' || opcode == 'update')
    {
        const errs = validateFormValues()
        if (errs != '')
        {
            response +=`\nForm Validation failed. ${errs}\n`
        }
    }

    //Make sure an id is available in conditions for ops needing it
    const operationsNeedingId = ['read', 'update', 'delete']
    if (opcode in operationsNeedingId)
    {
        if (currentId == '')
        {
            response +=`No Record ID available. Please load the record you want processed and try again.\n`
        }
    }
    
    //Set the columns for reads
    if(opcode == 'read')
        columns = '*'
    
    if (response != '')
    {
        alert(response)
        return false
    }
    return true
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
   //If this is the PK, save it and return
   if (elementId == 'id')
    {
        currentId = value
        return
    }
 
    const element = document.getElementById(elementId);


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
            console.warn(`Could not set 'value' property for element with ID "${elementId}". Error:, {e}`);
        }
    } else {
        console.warn(`Element with ID "${elementId}" is not a recognized form element type and does not have a 'value' property to set.`);
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
