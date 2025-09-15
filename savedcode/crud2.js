/**
 * Performs a CRUD operation by calling the Flask API endpoint.
 * This function is designed to be embedded in any webpage and does not
 * rely on specific HTML element IDs for input/output.
 *
 * @param {string} tableName - The name of the database table (e.g., 'users').
 * @param {'create'|'read'|'update'|'delete'} operation - The CRUD operation to perform.
 * @param {Object} [data=null] - For 'create' and 'update' operations, a key-value pair
 * of data to be sent.
 * @param {Object} [conditions=null] - For 'read', 'update', and 'delete' operations,
 * a key-value pair of conditions to filter by.
 * @returns {Promise<Object>} A Promise that resolves with the JSON response from the Flask API,
 * or rejects with an error.
 *
 * Thanks to Gemini for fenerating this script . . .
 */
async function performCrudOperation(tableName, operation, data = null, conditions = null) {
    // Validate inputs
    if (!tableName || typeof tableName !== 'string' || tableName.trim() === '') {
        throw new Error('Table name is required and must be a non-empty string.');
    }
    const validOperations = ['create', 'read', 'update', 'delete'];
    if (!operation || !validOperations.includes(operation)) {
        throw new Error(`Invalid operation: '${operation}'. Must be one of: ${validOperations.join(', ')}.`);
    }

    // Construct the payload based on the operation
    const payload = {
        table_name: tableName,
        operation: operation
    };

    // Add data and conditions if relevant to the operation
    if (operation === 'create' || operation === 'update') {
        if (!data || typeof data !== 'object') {
            throw new Error(`'data' object is required for '${operation}' operation.`);
        }
        payload.data = JSON.stringify(data);
    }

    if (operation === 'read' || operation === 'update' || operation === 'delete') {
        // Conditions are optional for read, but required for update/delete
        if ((operation === 'update' || operation === 'delete') && (!conditions || typeof conditions !== 'object')) {
            throw new Error(`'conditions' object is required for '${operation}' operation.`);
        }
        // If conditions are provided (even if optional for read), add them
        if (conditions && typeof conditions === 'object') {
             payload.conditions = conditions;
        } else if (operation !== 'read' && !conditions) {
            // This case handles where conditions are missing for update/delete,
            // which should have been caught by the check above, but as a safeguard.
            throw new Error(`'conditions' object is required for '${operation}' operation.`);
        }
    }


    try {
        const response = await fetch('/simple/crud', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        const result = await response.json();
        console.log(`Simple/Crud Result: ${result}`)
        if (!response.ok) {
            // If the HTTP response status is not OK (e.g., 400, 500),
            // throw an error including the message from the API.
            const errorMessage = result.message || `API error with status ${response.status}`;
            throw new Error(errorMessage);
        }

        return result; // Return the success response from the API

    } catch (error) {
        // Log the error for debugging purposes
        console.log('Error during CRUD API call:', error);
        // Re-throw the error so the caller can handle it
        throw error;
    }
}
