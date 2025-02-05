document.addEventListener('DocumentContentLoaded', () =>{
    const submitButton = document.querySelector(".btn-custom");

    submitButton.addEventListener("click", function () {

        const weight = parseFloat(document.getElementById("weight").value);
        const height = parseFloat(document.getElementById("height").value);
        const age = parseInt(document.getElementById("age").value, 10);
        const gender = document.getElementById("gender").value;
        const activityLevel = document.getElementById("activity-level").value;
        const disabilities = document.getElementById("disabilities").value;
        const fitnessGoal = document.getElementById("fitness-goal").value;
        const USER_DATA = {
            weight,
            height,
            age,
            gender,
            activityLevel,
            disabilities,
            fitnessGoal
        };
    })

})