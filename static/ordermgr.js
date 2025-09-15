//Books JS
import {doEdits, crudSuccess, crudFailed} from './crud_gateway.js'

$(document).ready(function(){
    //These vars are defined in crud.js
    requiredFields = ['title', 'author', 'imagename', 'description', 'price']    //Fields required for create and update
    formName = 'form1'
    tableName = 'orders'
    
    //Assign the click functions for the buttons
    $('#createbtn').on('click', function(event) {
            doEdits('create', event);
        }) 
    $('#readbtn').on('click', function(event) {
            doEdits('read', event);
        })    
    $('#updatebtn').on('click', function(event) {
            doEdits('update', event);
    })    
    $('#deletebtn').on('click', function(event) {
            doEdits('delete', event); // Call the imported doEdits function
    })    
    //and the blog list for loading blog records
    $('#orderlist').on('change', function(event) {
            loadOrder(event);
        })    
    
})

function loadOrder(event)
{   
    event.preventDefault();
    var id = $('#orderlist').find(":selected").val();
    if (id == '') return  //Ignore click on instruction option
    currentId = id  // Save for update and delete calls
    conditions = 'id=' + id
    columns = '*'
    opcode = 'read'
    doEdits('read',event)
}

//Load a post into the editor
function xloadOrder(event)
{   
    event.preventDefault();

    var id = $('#orderlist').find(":selected").val()
    if (id == '') return
    currentId = id       //Save for crud ops.
    conditions = 'id='+id //Conditions for update and delete
    const url = '/showorder/'+id;

    fetch(url)
    .then(response => response.json())
    .then(data => {
        alert(JSON.stringify(data)) 
         for (let key in data) {
            if (data.hasOwnProperty(key)) {
                
                $('#' + key).val(data[key])
            }
        }
    })
    .catch(error => {
        alert('Unable to process your request now. Please try again later.'  + error)
    });
}    
