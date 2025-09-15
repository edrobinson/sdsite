//Book Editor specific JS

    $(document).ready(function(){
        textsFocuser();
    });

   //Focus on the book title
    function textsFocuser(){
        document.getElementById('page').focus()
    }
    
    //Editor buttons request handler
    function handleRequest(opcode){
        event.preventDefault();
    }
