/*
    Book order page js
*/
$(document).ready(function(){
    $('#btnorder').on('click', function(event) {
           placeOrder(event)
    })    
})

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

