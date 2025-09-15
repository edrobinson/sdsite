/*
    These functions are embedded in the page and editor 
    scripts to call the Gemini generated crud service JS,
*/

// : Create a new record
async function create(table, data) {
    try {
        const result = await performCrudOperation(table, 'create', data);
    );
        console.log('Create Result:', result);
    } catch (error) {
        console.error('Create Error:', error.message);
    }
}

// : Read all records
async function readAll(table) {
    try {
        const result = await performCrudOperation(table, 'read');
        console.log('Read All Result:', result);
    } catch (error) {
        console.error('Read All Error:', error.message);
    }
}

// : Read a specific record
async function readSpecific(table, conditions {
    try {
        const result = await performCrudOperation(
            table,
            'read',
            null, // No data for read operation
            conditions
        );
        console.log('Read Specific Result:', result);
    } catch (error) {
        console.error('Read Specific Error:', error.message);
    }
}

// : Update a record
async function update(table, data, conditions ) {
    try {
        const result = await performCrudOperation(
            table,
            'update',
            data,
            conditions
        );
        console.log('Update Result:', result);
    } catch (error) {
        console.error('Update Error:', error.message);
    }
}

// : Delete a record
async function delete(table, conditions) {
    try {
        const result = await performCrudOperation(
            table,
            'delete',
            null,
            conditions
        );
        console.log('Delete Result:', result);
    } catch (error) {
        console.error('Delete Error:', error.message);
    }
}
