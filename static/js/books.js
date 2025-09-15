//Books table JS
import {doEdits, crudSuccess, crudFailed} from './crud_gateway.js'

var booktitle
var bookid

$(document).ready(function(){
    //These vars are defined in crud.js
    requiredFields = ['title', 'author', 'imagename', 'description', 'price']    //Fields required for create and update
    formName = 'form1'
    tableName = 'books'
    
    //Assign the click functions for the buttons
    $('#createbtn').on('click', function(event) {
            doEdits('create', event);
        })    
    $('#updatebtn').on('click', function(event) {
            doEdits('update', event);
    })    
    $('#deletebtn').on('click', function(event) {
            doEdits('delete', event); // Call the imported doEdits function
    })    
    //and the book list for loading book records
    $('#bookslist').on('change', function(event) {
            loadBook(event);
    })

    $('#summaryli').on('click',function(event){
        $('#big-book-img').hide()
        $('#extract').hide()
        $('#summary').show()
    })

    $('#excerptli').on('click',function(event){
         $('#big-book-img').hide()
         $('#summary').hide()
         $('#extract').show()
       
    })
    
    bookid = $('#bookid').val( )
    booktitle = $('#booktitle').val()
    
})

function getbook(id)
{
     event.stopPropagation();
    
     const url = f`/showbook/${id}`;
     
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

//Get the book summary or excerpt text using the stored title
function getBookTexts(texttype, event)
{
    $('#big-book-img').hide();
    $('#book-detail').show();
    
    $('#txttitle').html('['+texttype+']')
    
    const url = '/booktext?title='+booktitle+'&type='+texttype
    
    try{
        fetch(url)
          .then(response => response.json())
          .then(data => {
            $('#bookdoc').html(data)
          })
    }
    catch(error){
        alert('Unable to process your request now. Please try again later.'  + error)
    }
    
    
    
}


//This function handles the file tag and populates the
//content div.
function loadBookContent(event)
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

//Load a book into the editor
function loadBook(event)
{   
    event.preventDefault();

    var id = $('#bookslist').find(":selected").val()
    if (id == '') return
    currentId = id       //Save for crud ops.
    conditions = 'id='+id //Conditions for update and delete
    const url = '/showbook/'+id;

    fetch(url)
    .then(response => response.json())
    .then(data => {
         for (let key in data) {
            if (key == 'created') continue
            if (data.hasOwnProperty(key)) {
                
                $('#' + key).val(data[key])
            }
        }
    })
    .catch(error => {
        alert('Unable to process your request now. Please try again later.'  + error)
    });
}    
