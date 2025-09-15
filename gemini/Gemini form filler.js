/**
 * Populates a form element with a given value based on its type.
 *
 * @param {string} elementId The ID of the form element.
 * @param {*} value The value to set for the element.
 */
function populateFormElement(elementId, value) {
    const element = document.getElementById(elementId);

    if (!element) {
        console.warn(`Element with ID "${elementId}" not found.`);
        return;
    }

    // Handle common HTML input elements
    if (element instanceof HTMLInputElement) {
        switch (element.type) {
            case 'text':
            case 'password':
            case 'email':
            case 'number':
            case 'tel':
            case 'url':
            case 'search':
            case 'date':
            case 'time':
            case 'datetime-local':
            case 'week':
            case 'month':
            case 'range':
            case 'color':
            case 'hidden':
                element.value = value;
                break;
            case 'checkbox':
                // For checkboxes, value can be a boolean or match the element's value attribute
                if (typeof value === 'boolean') {
                    element.checked = value;
                } else {
                    element.checked = (element.value === String(value));
                }
                break;
            case 'radio':
                // For radio buttons, set checked if the value matches the element's value attribute
                element.checked = (element.value === String(value));
                break;
            case 'file':
                // File inputs cannot be set programmatically for security reasons.
                console.warn(`Cannot programmatically set value for file input with ID "${elementId}". Security restriction.`);
                break;
            case 'submit':
            case 'reset':
            case 'button':
            case 'image': // Image inputs often behave like submit buttons
                // These types are typically not 'populated' with a value in the same way.
                // Their value attribute is usually their display text.
                // If you need to change their display text, you'd set element.value = value.
                // For now, we'll just ignore for "population".
                break;
            default:
                console.warn(`Unhandled input type "${element.type}" for element with ID "${elementId}". Setting value directly as a fallback.`);
                element.value = value;
                break;
        }
    }
    // Handle textarea elements
    else if (element instanceof HTMLTextAreaElement) {
        element.value = value;
    }
    // Handle select elements
    else if (element instanceof HTMLSelectElement) {
        // For single-select dropdowns
        if (!element.multiple) {
            element.value = value; // This should select the option if it exists
        }
        // For multi-select dropdowns
        else {
            const valuesToSelect = Array.isArray(value) ? value.map(String) : [String(value)]; // Ensure array of strings

            Array.from(element.options).forEach(option => {
                option.selected = valuesToSelect.includes(option.value);
            });
        }
    }
    // Handle other potentially 'settable' elements (e.g., custom elements with a value property)
    // This is a fallback and might not work for all custom elements.
    else if ('value' in element) {
        try {
            element.value = value;
        } catch (e) {
            console.warn(`Could not set 'value' property for element with ID "${elementId}". Error:`, e);
        }
    } else {
        console.warn(`Element with ID "${elementId}" is not a recognized form element type and does not have a 'value' property to set.`);
    }
}

// --- Example Usage ---

// 1. Text Input
// <input type="text" id="myTextInput">
populateFormElement('myTextInput', 'Hello World');

// 2. Number Input
// <input type="number" id="myNumberInput">
populateFormElement('myNumberInput', 123);

// 3. Email Input
// <input type="email" id="myEmailInput">
populateFormElement('myEmailInput', 'test@example.com');

// 4. Checkbox Input
// <input type="checkbox" id="myCheckbox1" value="option1">
// <input type="checkbox" id="myCheckbox2" value="option2">
populateFormElement('myCheckbox1', true); // Checks it
populateFormElement('myCheckbox2', 'option2'); // Checks if value matches

// 5. Radio Input
// <input type="radio" name="myRadioGroup" id="myRadio1" value="radio1">
// <input type="radio" name="myRadioGroup" id="myRadio2" value="radio2">
populateFormElement('myRadio2', 'radio2'); // Selects the radio button with value 'radio2'

// 6. Textarea
// <textarea id="myTextarea"></textarea>
populateFormElement('myTextarea', 'This is some text for the textarea.');

// 7. Single Select Dropdown
/*
<select id="mySingleSelect">
  <option value="apple">Apple</option>
  <option value="banana">Banana</option>
  <option value="orange">Orange</option>
</select>
*/
populateFormElement('mySingleSelect', 'banana');

// 8. Multi-Select Dropdown
/*
<select id="myMultiSelect" multiple>
  <option value="red">Red</option>
  <option value="green">Green</option>
  <option value="blue">Blue</option>
  <option value="yellow">Yellow</option>
</select>
*/
populateFormElement('myMultiSelect', ['green', 'yellow']);

// 9. Date Input
// <input type="date" id="myDateInput">
populateFormElement('myDateInput', '2025-12-25');

// 10. File Input (will log a warning)
// <input type="file" id="myFileInput">
populateFormElement('myFileInput', null); // Value cannot be set

// 11. Hidden Input
// <input type="hidden" id="myHiddenInput">
populateFormElement('myHiddenInput', 'secret_data_123');

// 12. Range Input
// <input type="range" id="myRangeInput" min="0" max="100">
populateFormElement('myRangeInput', 75);

// 13. Color Input
// <input type="color" id="myColorInput">
populateFormElement('myColorInput', '#FF0000'); // Red

// 14. Element not found
populateFormElement('nonExistentElement', 'someValue');