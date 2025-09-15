/**
 * Generic fetch function to communicate with Flask routes.
 *
 * @param {string} url - The URL of the Flask route.
 * @param {string} method - The HTTP method (e.g., 'GET', 'POST', 'PUT', 'DELETE').
 * @param {object} [data=null] - Optional data to send in the request body (for POST, PUT).
 * @param {object} [headers={}] - Optional custom headers.
 * @returns {Promise<object>} - A promise that resolves to the JSON response from the Flask route.
 * @throws {Error} - Throws an error if the network request fails or the server returns an error.
 */
async function flaskFetch(url, method, data = null, headers = {}) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            ...headers
        },
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
            throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message || response.statusText}`);
        }
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return await response.json();
        } else {
            return response; // Return the raw response object if not JSON
        }
    } catch (error) {
        console.error('Fetch error:', error);
        throw error; // Re-throw the error for the caller to handle
    }
}
