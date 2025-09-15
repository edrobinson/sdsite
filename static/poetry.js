/*
    This script handles the poems table processing
    
*/
$(document).ready(function(){
    //These vars are defined in crud.js and common to all calls.
    requiredFields = ['title','created', 'description', 'content', 'status']
    formName = 'form1'
    tableName = 'poems'
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

