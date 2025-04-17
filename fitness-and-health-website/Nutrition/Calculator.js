function validateNutritionForm() {
    // Select all relevant form elements
    const weightInput = document.getElementById('weight');
    const heightInput = document.getElementById('height');
    const ageInput = document.getElementById('age');
    const genderSelect = document.getElementById('gender');
    const activitySelect = document.getElementById('activity-level');

    const formElements = [
        weightInput,
        heightInput,
        ageInput,
        genderSelect,
        activitySelect
    ];

    // --- Clear previous validation states ---
    formElements.forEach(element => {
        if (element) { // Check if element exists before accessing classList
            element.classList.remove('is-invalid');
        }
    });

    let isValid = true;

    // --- Input Validation ---
    // Weight
    const weight = parseFloat(weightInput.value);
    if (!weight || isNaN(weight) || weight < 20 || weight > 300) {
        weightInput.classList.add('is-invalid');
        isValid = false;
    }

    // Height
    const height = parseFloat(heightInput.value);
    if (!height || isNaN(height) || height < 50 || height > 250) {
        heightInput.classList.add('is-invalid');
        isValid = false;
    }

    // Age
    const age = parseInt(ageInput.value);
    if (!age || isNaN(age) || age < 1 || age > 120) {
        ageInput.classList.add('is-invalid');
        isValid = false;
    }

    // Gender
    if (!genderSelect.value) { // Check if a value is selected
        genderSelect.classList.add('is-invalid');
        isValid = false;
    }

    // Activity Level
    if (!activitySelect.value) { // Check if a value is selected
        activitySelect.classList.add('is-invalid');
        isValid = false;
    }
    // Note: No validation needed for 'additional-info' as it's free text

    console.log("Form validation result:", isValid);
    return isValid;
}