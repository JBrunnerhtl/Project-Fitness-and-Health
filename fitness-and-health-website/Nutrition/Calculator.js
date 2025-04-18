function validateNutritionForm() {

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


    formElements.forEach(element => {
        if (element) {
            element.classList.remove('is-invalid');
        }
    });

    let isValid = true;


    const weight = parseFloat(weightInput.value);
    if (!weight || isNaN(weight) || weight < 20 || weight > 300) {
        weightInput.classList.add('is-invalid');
        isValid = false;
    }


    const height = parseFloat(heightInput.value);
    if (!height || isNaN(height) || height < 50 || height > 250) {
        heightInput.classList.add('is-invalid');
        isValid = false;
    }


    const age = parseInt(ageInput.value);
    if (!age || isNaN(age) || age < 1 || age > 120) {
        ageInput.classList.add('is-invalid');
        isValid = false;
    }


    if (!genderSelect.value) {
        genderSelect.classList.add('is-invalid');
        isValid = false;
    }


    if (!activitySelect.value) {
        activitySelect.classList.add('is-invalid');
        isValid = false;
    }


    console.log("Form validation result:", isValid);
    return isValid;
}