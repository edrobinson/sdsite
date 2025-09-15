// file2.js (page-specific-logic.js)

import { 
    createRecord, 
    readRecords, 
    readRecordById, // Uncomment if needed for this page
    updateRecord,   // Uncomment if needed for this page
    deleteRecord 
} from './file1.js'; // Adjust path if file1.js is in a different directory

document.addEventListener('DOMContentLoaded', () => {
    const recordForm = document.getElementById('recordForm');
    const recordList = document.getElementById('recordList');
    const loadRecordsBtn = document.getElementById('loadRecordsBtn');

    // --- Event Listeners ---

    if (recordForm) {
        recordForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent default form submission
            const recordName = document.getElementById('recordName').value;
            const recordValue = document.getElementById('recordValue').value;

            // Call the abstract CRUD service from file1.js, passing a callback
            try {
                await createRecord(
                    { name: recordName, value: recordValue },
                    (newRecord) => { // This is the success callback
                        console.log('Page Logic: Record created successfully (callback):', newRecord);
                        alert('Record created!');
                        recordForm.reset(); // Clear the form
                        displayRecords();   // Refresh the list after creation
                    }
                );
            } catch (error) {
                console.error('Page Logic: Failed to create record:', error);
                alert(`Error creating record: ${error.message}`);
            }
        });
    }

    if (loadRecordsBtn) {
        loadRecordsBtn.addEventListener('click', displayRecords);
    }

    // --- UI Update Functions ---

    // Function to display/refresh records (specific to this page's UI)
    async function displayRecords() {
        if (!recordList) return; // Ensure the element exists

        recordList.innerHTML = 'Loading records...'; // Show a loading indicator
        try {
            const records = await readRecords(); // Call the abstract CRUD service
            console.log('Page Logic: Records loaded:', records);
            recordList.innerHTML = ''; // Clear loading message

            if (records && records.length > 0) {
                records.forEach(record => {
                    const li = document.createElement('li');
                    li.textContent = `ID: ${record.id}, Name: ${record.name}, Value: ${record.value}`;
                    
                    // Add a delete button for each record
                    const deleteBtn = document.createElement('button');
                    deleteBtn.textContent = 'Delete';
                    deleteBtn.style.marginLeft = '10px';
                    deleteBtn.addEventListener('click', async () => {
                        if (confirm(`Are you sure you want to delete record ${record.id} (${record.name})?`)) {
                            try {
                                await deleteRecord(
                                    record.id,
                                    (deletedId) => { // This is the success callback for deletion
                                        console.log(`Page Logic: Record ID ${deletedId} deleted successfully (callback).`);
                                        alert('Record deleted!');
                                        displayRecords(); // Refresh list after deletion
                                    }
                                );
                            } catch (error) {
                                console.error('Page Logic: Failed to delete record:', error);
                                alert(`Error deleting record: ${error.message}`);
                            }
                        }
                    });
                    li.appendChild(deleteBtn);
                    recordList.appendChild(li);
                });
            } else {
                recordList.innerHTML = 'No records found.'; // Message if no records
            }
        } catch (error) {
            console.error('Page Logic: Failed to load records:', error);
            recordList.innerHTML = `Error loading records: ${error.message}`; // Display error
        }
    }

    // --- Initial Page Setup ---

    // Load and display records when the page first loads
    displayRecords(); 
});