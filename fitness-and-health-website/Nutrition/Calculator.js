function calculateCalories() {
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const age = parseInt(document.getElementById('age').value);
    const gender = document.getElementById('gender').value;
    const activityLevel = document.getElementById('activity-level').value;


    const formElements = [
        document.getElementById('weight'),
        document.getElementById('height'),
        document.getElementById('age'),
        document.getElementById('gender'),
        document.getElementById('activity-level')
    ];

    formElements.forEach(element => {
        element.classList.remove('is-invalid');
    });

    let isValid = true;


    if (!weight || isNaN(weight) || weight < 20 || weight > 300) {
        document.getElementById('weight').classList.add('is-invalid');
        isValid = false;
    }

    if (!height || isNaN(height) || height < 50 || height > 250) {
        document.getElementById('height').classList.add('is-invalid');
        isValid = false;
    }

    if (!age || isNaN(age) || age < 1 || age > 120) {
        document.getElementById('age').classList.add('is-invalid');
        isValid = false;
    }

    if (!gender) {
        document.getElementById('gender').classList.add('is-invalid');
        isValid = false;
    }

    if (!activityLevel) {
        document.getElementById('activity-level').classList.add('is-invalid');
        isValid = false;
    }

    let calories = 0;

    console.log(weight);
    console.log(height);
    console.log(age);
    console.log(gender);
    console.log(activityLevel);
    console.log("Form is valid:", isValid);


    if (isValid) {
        if (gender === 'Männlich') {
            calories = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
            calories = 10 * weight + 6.25 * height - 5 * age - 161;
        }

        switch (activityLevel) {
            case 'low':
                calories *= 1.2;
                break;
            case 'moderate':
                calories *= 1.55;
                break;
            case 'high':
                calories *= 1.725;
                break;
        }
    }

    return { calories: calories, isValid: isValid };
}