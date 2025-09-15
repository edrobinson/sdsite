/*
    This script handles the prose display and the
    blog manager/ editor functionality
*/
$(document).ready(function(){
    //These vars are defined in crud.js
    requiredFields = ['title', 'description', 'content', 'status']    //Fields required for create and update
    formName = 'form1'
    tableName = 'prose'
})

//Read a prose record and populate the content field - prose page
function loadaProse(id, event)
{
    event.stopPropagation();
    const url = '/getprosearticle/' + id;
    fetch(url)
    .then(response => response.json())
    .then(data => {
        alert(data['content'])
          $('#article').html(data['content'])
    })
    .catch(error => {
        alert('Unable to process your request now. Please try again later.'  + error)
    });
}    

//Read and display a prose record using the crud service - prosemgr page
function loadProseArticle(event)
{
    event.stopPropagation();
    var id = $('#proselist').find(":selected").val();
    if (id == '') return
    $('#id').val(id)
    doEdits('read', event)
}    
    
 

//This function handles the file tag and populates the
//content div.
function loadProseContent(event)
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

//Load a prose into the editor
function loadProse(event)
{   
    event.preventDefault();
    var id = $('#proselist').find(":selected").val();
    if (id == '') return
    $('#id').val(id)
    $('#opcode').val('read')
    $('#table').val('blog')
    processEdits('read', event)
}
