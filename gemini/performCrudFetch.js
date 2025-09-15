async function performCrudFetch(opcode, payload, onSuccess, onError) { // <--- Added callbacks
    const url = '/crud/' + opcode;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        returnedResult = data; // Still setting this if you need a global reference

        if (onSuccess && typeof onSuccess === 'function') {
            onSuccess(data); // <--- Call success callback
        }

    } catch (error) {
        returnedResult = `Error: ${error.message}`; // Still setting this if you need a global reference

        if (onError && typeof onError === 'function') {
            onError(returnedResult); // <--- Call error callback
        }
    }
}

// Example usage:
performCrudFetch(
    "create",
    { name: "Jane Doe", age: 25 },
    function(data) { // This is the success callback
        console.log("Creation successful! Data:", data);
        // Do something specific with the created data, e.g., update UI
        displayCreatedItem(data);
    },
    function(errorMessage) { // This is the error callback
        console.error("Failed to create item:", errorMessage);
        // Display an alert to the user, log to console, etc.
        showUserError(errorMessage);
    }
);

// Define your callback functions
function displayCreatedItem(item) {
    // Logic to add the item to your UI, like a list or table
    console.log("UI updated with new item:", item);
}

function showUserError(msg) {
    // Logic to show an error message to the user
    alert("Operation failed: " + msg);
}