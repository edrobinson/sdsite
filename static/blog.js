/*
    This script handles the blog display and the
    blog manager/ editor functionality
*/
import {doEdits, crudSuccess, crudFailed} from './crud_gateway.js'

$(document).ready(function(){
    //These vars are defined in crud.js and common to all calls.
    requiredFields = ['title','created', 'description', 'content', 'status']
    formName = 'form1'
    tableName = 'blog'
    suppressResponse = false
    $('#postlist').on('change', function(event) {getpost(event);}) 
})

function getpost(id)
{
     event.stopPropagation();
     var id = $('#postlist').find(":selected").val();
     if (id == ' ') return
     const url = `/readpost/${id}`;
     
     fetch(url)
      .then(response => response.json())
      .then(data => {

          $('#post').html(data.content)
      })
      .catch(error => {
        alert('Unable to process your request now. Please try again later.'  + error)
       });
}

//This function handles the file tag and populates the
//content div.
function loadPostContent(event)
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

//Load a post into the editor using the crud service.
//Load a post into the editor using the crud service.
function loadPost(event)
{   
    event.preventDefault();
    var id = $('#postlist').find(":selected").val();
//    alert(id)
    if (id == ' ') return  //Ignore click on instruction option
    currentId = id  // Save for update and delete calls
    conditions = 'id= ' + id
    columns = '*'
    opcode = 'read'
    doEdits('read',event)
}

