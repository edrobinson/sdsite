/*
This script handles the blog editor processing 
*/
//Import the crud service commons
import {doEdits, crudSuccess, crudFailed} from './crud_gateway.js'

$(document).ready(function(){
    //These vars are defined in crud.js and common to all crud calls.
    requiredFields = ['question','answer']
    formName = 'form1'
    tableName = 'faqs'
    suppressResponse = false
    
    //Assign the click functions for the buttons and onchanges
    $('#createbtn').on('click',  function(event) {doEdits('create', event);})    
    $('#readbtn').on('click',     function(event) {doEdits('read', event);})    
    $('#updatebtn').on('click', function(event) {doEdits('update', event);})    
    $('#deletebtn').on('click',  function(event) {doEdits('delete', event);})    

    $('#faqselect').on('change', function(event) {loadFaq(event);})    
} )

//Load a post into the editor using the crud service.
function loadFaq(event)
{   
    event.preventDefault();    
    var id = $('#faqselect').find(":selected").val();
    if (id == ' ') return  //Ignore click on instruction option
    currentId = id  // Save for update and delete calls
    conditions = 'id= ' + id
    columns = '*'
    opcode = 'read'
    doEdits('read',event)
}

/*
    This function handles the onchange event for
    the file input that the users use to populate the
    content textarea.

*/
function loadBlogContent(event)
{
    const fileInput = document.getElementById("fileloader");
    const fileContentDisplay = document.getElementById("content");
    const file = event.target.files[0];
    
    fileContentDisplay.textContent = ""; // Clear previous file content
 
    // Validate file existence and type
    if (!file) {
        alert("No file selected. Please choose a file.");
    return;
    }

    if (!file.type.startsWith("text")) {
        alert("Unsupported file type. Please select a text file.");
    return;
    }

    // Read the file
    const reader = new FileReader();
    reader.onload = () => {
    fileContentDisplay.value = reader.result;
    };
    reader.onerror = () => {
    alert("Error reading the file. Please try again.");
    };
    reader.readAsText(file);
}
