// file1.js (crud-manager.js)

const API_BASE_URL = '/api'; // Your Flask API base URL

async function fetchData(url, options = {}) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            // Handle HTTP errors (e.g., 404, 500)
            const errorData = await response.json().catch(() => ({ message: response.statusText }));
            throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message || 'Unknown error'}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Fetch error in CRUD Manager:", error);
        // Re-throw the error so the calling code (file2.js) can handle it
        throw error; 
    }
}

// --- CRUD Exported Functions ---

// createRecord now accepts an optional successCallback
export async function createRecord(data, successCallback = null) {
    console.log("CRUD Manager: Attempting to create record:", data);
    try {
        const newRecord = await fetchData(`${API_BASE_URL}/items`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        console.log('CRUD Manager: Record created successfully:', newRecord);
        if (typeof successCallback === 'function') {
            successCallback(newRecord); // Call the callback with the new record data
        }
        return newRecord;
    } catch (error) {
        console.error('CRUD Manager: Failed to create record:', error);
        throw error; // Re-throw to be handled by file2.js
    }
}

export async function readRecords() {
    console.log("CRUD Manager: Attempting to read all records.");
    return fetchData(`${API_BASE_URL}/items`);
}

export async function readRecordById(id) {
    console.log(`CRUD Manager: Attempting to read record with ID: ${id}`);
    return fetchData(`${API_BASE_URL}/items/${id}`);
}

// updateRecord now accepts an optional successCallback
export async function updateRecord(id, data, successCallback = null) {
    console.log(`CRUD Manager: Attempting to update record ID ${id} with data:`, data);
    try {
        const updatedRecord = await fetchData(`${API_BASE_URL}/items/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        console.log('CRUD Manager: Record updated successfully:', updatedRecord);
        if (typeof successCallback === 'function') {
            successCallback(updatedRecord); // Call the callback with the updated record data
        }
        return updatedRecord;
    } catch (error) {
        console.error('CRUD Manager: Failed to update record:', error);
        throw error; // Re-throw to be handled by file2.js
    }
}

// deleteRecord now accepts an optional successCallback
export async function deleteRecord(id, successCallback = null) {
    console.log(`CRUD Manager: Attempting to delete record ID: ${id}`);
    try {
        await fetchData(`${API_BASE_URL}/items/${id}`, {
            method: 'DELETE',
        });
        console.log(`CRUD Manager: Record ID ${id} deleted successfully.`);
        if (typeof successCallback === 'function') {
            successCallback(id); // Call the callback with the ID of the deleted record
        }
        return true; // Indicate success
    } catch (error) {
        console.error('CRUD Manager: Failed to delete record:', error);
        throw error; // Re-throw to be handled by file2.js
    }
}