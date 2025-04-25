async function getNutritionPlanFromAI() {
    const weight = parseFloat(document.getElementById("weight").value);
    const height = parseFloat(document.getElementById("height").value);
    const age = parseInt(document.getElementById("age").value, 10);
    const gender = document.getElementById("gender").value;
    const activityLevel = document.getElementById("activity-level").value;
    const additionalInfo = document.getElementById("additional-info").value;

    const userData = {
        weight,
        height,
        age,
        gender,
        activityLevel,
        additionalInfo,
        goal: 'Trainingsplan erstellen', // Beispielwert - an die API-Anforderungen anpassen
        fitness_level: activityLevel, // Beispielwert - an die API-Anforderungen anpassen
        preferences: [], // Beispielwert - an die API-Anforderungen anpassen
        health_conditions: additionalInfo.split(','), // Beispielwert - an die API-Anforderungen anpassen
        schedule: {
            days_per_week: 3, // Beispielwert - an die API-Anforderungen anpassen
            session_duration: 60 // Beispielwert - an die API-Anforderungen anpassen
        },
        plan_duration_weeks: 4 // Beispielwert - an die API-Anforderungen anpassen
    };

    const apiKey = 'DEIN_API_KEY'; // Ersetze das durch deinen API-Key
    const apiUrl = 'API_ENDPOINT_URL'; // Ersetze das durch die tatsächliche URL deiner API
    const statusMessageDiv = document.getElementById('statusMessage');
    const writeTableDiv = document.getElementById('writeTable');

    statusMessageDiv.textContent = 'Daten werden gesendet...';
    writeTableDiv.innerHTML = ''; // Alte Tabelle entfernen, falls vorhanden

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-RapidAPI-Key': apiKey,
                'X-RapidAPI-Host': 'ai-workout-planner-exercise-fitness-nutrition-guide.p.rapidapi.com' // Wichtig: Host-Header nicht vergessen!
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            statusMessageDiv.textContent = `Fehler beim Abrufen des Trainingsplans: ${errorMessage}`;
            return;
        }

        const trainingPlanData = await response.json();
        statusMessageDiv.textContent = 'Trainingsplan erfolgreich abgerufen!';
        displayTrainingPlan(trainingPlanData); // Funktion zum Anzeigen der Tabelle aufrufen

    } catch (error) {
        statusMessageDiv.textContent = `Ein unerwarteter Fehler ist aufgetreten: ${error.message}`;
    }
}

function displayTrainingPlan(planData) {
    const writeTableDiv = document.getElementById('writeTable');
    const table = document.createElement('table');
    table.classList.add('table', 'table-bordered'); // Bootstrap Klassen für Styling

    // Tabellenkopf erstellen (Beispielhafte Spaltennamen - an deine API-Antwort anpassen)
    const thead = table.createTHead();
    const headerRow = thead.insertRow();
    const headers = ['Tag', 'Übung', 'Sätze', 'Wiederholungen']; // Passe diese an deine Daten an
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });

    const tbody = table.createTBody();

    // Datenreihen hinzufügen (angenommen, planData ist ein Array von Übungsobjekten)
    planData.forEach(dayPlan => {
        const dayRow = tbody.insertRow();
        const dayCell = dayRow.insertCell();
        dayCell.textContent = dayPlan.day; // Angenommen, dein Plan hat eine Eigenschaft 'day'

        const exercisesCell = dayRow.insertCell();
        if (Array.isArray(dayPlan.exercises)) {
            const exerciseList = document.createElement('ul');
            dayPlan.exercises.forEach(exercise => {
                const listItem = document.createElement('li');
                listItem.textContent = `${exercise.name} - ${exercise.sets} Sätze x ${exercise.repetitions} Wiederholungen`;
                exerciseList.appendChild(listItem);
            });
            exercisesCell.appendChild(exerciseList);
        } else {
            exercisesCell.textContent = 'Keine Übungen für diesen Tag';
        }
        dayRow.insertCell().textContent = ''; // Platzhalter für Sätze (könnte auch in den Übungsobjekten sein)
        dayRow.insertCell().textContent = ''; // Platzhalter für Wiederholungen (könnte auch in den Übungsobjekten sein)
    });

    writeTableDiv.appendChild(table);
}