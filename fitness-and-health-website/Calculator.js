function calculateCalories() {

    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const age = parseInt(document.getElementById('age').value);
    const gender = document.getElementById('gender').value;
    const activityLevel = document.getElementById('activity-level').value;

    let calories;

        if (isNaN(weight) || isNaN(height) || isNaN(age) || gender === "" || activityLevel === "") {
        alert("Bitte gib gültige Werte ein!");
        return NaN;
    }


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

    return calories;
}