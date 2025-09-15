/*
    This script handles the poems table processing
    
*/
   import {doEdits, crudSuccess, crudFailed} from './crud_gateway.js'
   
$(document).ready(function(){
    //These vars are defined in crud.js and common to all calls.
    requiredFields = ['title','created', 'description', 'content', 'status']
    formName = 'form1'
    tableName = 'poems'
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
            doEdits('delete', event);
    })    
    //and the blog list for loading blog records
    $('#poemslist').on('change', function(event) {
            loadPoem(event);
    })    
   
})



//Load a post into the editor using the crud service.
function loadPoem(event)
{   
    event.preventDefault();
    var id = $('#poemslist').find(":selected").val();
    if (id == '') return
    $('#id').val(id)
    conditions = 'id=' + id
    doEdits('read', event)
}

