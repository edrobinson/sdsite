/*
    This script handles all of the contact page communications
*/
//Import the crud service commons
import {doEdits, crudSuccess, crudFailed} from './crud_gateway.js'

let replyModal //The response modal instance

$(document).ready(function(){
    //These vars are defined in crud.js
    requiredFields = ['name', 'email' , 'subject', 'message']    //Fields required for create and update
    formName = 'form1'
    tableName = 'contacts'
    
    
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
    $('#replybtn').on('click', function(event) {
            replyToContact()
    })    
    $('#sendreply').on('click', function(event) {
            sendContactReply()
    })    
    //and the blog list for loading blog records
    $('#contactlist').on('change', function(event) {
            loadContact(event);
        })    
    
})

function loadContact(event)
{   
    event.preventDefault();
    var id = $('#contactlist').find(":selected").val();
    if (id == '') return  //Ignore click on instruction option
    currentId = id  // Save for update and delete calls
    conditions = 'id = ' + id
    columns = '*'
    opcode = 'read'
    doEdits('read',event)
}

//Open the reply page modal
function replyToContact()
{
    replyModal = new bootstrap.Modal(document.getElementById('contactReplyModal'))
    replyModal.toggle()
}

//Send a request to the email route
async function sendContactReply()
{
    showSpinner()
    //Get the user's response and clear the modal
    const message = $('#replyText').val()
    document.getElementById('modalCloser').click()

    const url = '/send_email'
    let data
    data = {"subject" : "Reply From SD Website",
                 "msgbody" : message,
                 "recipient" : $('#email').val()
                }
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

        const response_data = await response.json(); 
        hideSpinner()
        setTimeout(function() { //LEt the hide finish . . .
            alert(response_data);
        }, 100);        
    } catch (error) {
        hideSpinner()
        alert(`Error: ${error.message}`)
    }
}

async function placeOrder(event) { 
     event.stopPropagation();
    //Get the form data
    formName = 'form1'
    requestData = getRequestData()

     const url = `/placebookorder`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
        }

        const data = await response.json(); 
        alert(data)
    } catch (error) {
        alert(`Error: ${error.message}`)
    }
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