/*
    This script handles all of the contact page communications
*/
import {doEdits, crudSuccess, crudFailed} from './crud_gateway.js'

let replyModal //The response modal instance

$(document).ready(function(){
    //These vars are defined in crud.js
    requiredFields = ['name', 'email' , 'subject', 'message']    //Fields required for create and update
    formName = 'form1'
    tableName = 'contacts'
    
    $('#btncontact').on('click', function(event) {
            processContact(event);
        }) 
    
    const loader = document.querySelector('.loader-overlay'); //Spinner overlay class
})   


//Send the  contact form to the backend for storage
async function processContact(event)
{
    event.stopPropagation();
    showSpinner()
    //Populate the non-user elements
    $('#status').val('new')
    $('#received').val(makeYMD())
    
    const data = getRequestData()
    const url = '/process-contact'
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
        }

        const json = await response.json(); //data is the returned json. Not a promise due to the await
        hideSpinner()
        setTimeout(function() { //LEt the hide finish . . .
            alert(json);
        }, 100);        
    }catch (error) {
        hideSpinner()
        console.error('Fetch error:', error);
        alert('Fetch error:', error);
    }
}

function makeYMD()
{
    const today = new Date();
    const formattedDate = today.toISOString().slice(0, 10);
    return formattedDate
}

//Load a post into the editor
function loadContact(event)
{   
    event.preventDefault();
    var id = $('#contactlist').find(":selected").val();
    if (id == '') return
    conditions = `id =  ${id}`
    doEdits('read', event)
}

//Open the reply page
function replyToContact()
{
    replyModal = new bootstrap.Modal(document.getElementById('contactReplyModal'))
    replyModal.toggle()
}

//Send a request to the email route
function sendContactReply()
{
    //Get the user's response and clear the modal
    message = $('#replyText').val()
    document.getElementById('modalCloser').click()
    
    alert(message)
    //ToDo - send the email via a flask mail route
}

    // Function to show the loading spinner
    function showSpinner() {
        loadingOverlay.classList.remove('hidden');
        loadingOverlay.classList.add('visible');
    }

    // Function to hide the loading spinner
    function hideSpinner() {
        loadingOverlay.classList.remove('visible');
        loadingOverlay.classList.add('hidden');
    }