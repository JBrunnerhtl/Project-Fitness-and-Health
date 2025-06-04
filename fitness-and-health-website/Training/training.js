
const GEMINI_API_KEY_TRAINING = "AIzaSyCmASFgvCtxB2Q1JN6lC-jOHQ0PlCNhXOw";
const EXERCISEDB_RAPIDAPI_KEY = "5e3ee329abmsha7c07675e6393b6p13eea0jsnd88b9973abdf";
const EXERCISEDB_RAPIDAPI_HOST = "exercisedb.p.rapidapi.com";

const GEMINI_API_URL_TRAINING = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY_TRAINING}`;
const EXERCISEDB_BASE_URL = `https://${EXERCISEDB_RAPIDAPI_HOST}/exercises`;

const TRAINING_FORM_ID = "trainingForm";
const WORKOUT_PLAN_CONTAINER_ID = "workoutPlanContainer";
const TRAINING_STATUS_MESSAGE_ID = "trainingStatusMessage";

async function generateAndDisplayTrainingPlan() {
    const form = document.getElementById(TRAINING_FORM_ID);
    const planContainer = document.getElementById(WORKOUT_PLAN_CONTAINER_ID);
    const statusMessage = document.getElementById(TRAINING_STATUS_MESSAGE_ID);
    const submitButton = form ? form.querySelector('button[type="button"]') : null;

    if (!form || !planContainer || !statusMessage || !submitButton) {
        console.error("One or more essential HTML elements for training plan are missing.");
        if (statusMessage) statusMessage.textContent = "Fehler: Seitenelemente fehlen.";
        return;
    }

    const userData = {
        weight: document.getElementById('weight')?.value,
        height: document.getElementById('height')?.value,
        age: document.getElementById('age')?.value,
        gender: document.getElementById('gender')?.value,
        activityLevel: document.getElementById('activity-level')?.value,
        limitations: document.getElementById('disabilities')?.value || 'Keine',
        fitnessGoal: document.getElementById('fitness-goal')?.value,
    };

    if (!userData.age || !userData.fitnessGoal || !userData.gender) {
        statusMessage.textContent = "Bitte füllen Sie alle erforderlichen Felder im Formular aus.";
        statusMessage.style.color = 'red';
        return;
    }

    submitButton.disabled = true;
    statusMessage.textContent = "Trainingsplan wird generiert...";
    statusMessage.style.color = 'white';

    planContainer.innerHTML = '<div class="text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div><p>Generiere Plan mit AI...</p></div>';

    const trainingPrompt = `
        Act as an expert fitness trainer. Based on the following user data, create a structured weekly workout plan for 4 weeks.
            Provide the response ONLY in JSON format. The JSON should have a root object with a key "weeklySchedule".
            "weeklySchedule" should be an array of day objects. Each day object should have:
            - "day": "String value" (e.g., "Monday", "Tuesday", "Rest")
            - "focus": "String value" (e.g., "Full Body Strength", "Upper Body")
            - "warmUp": "String value describing the warm-up."
            - "exercises": An array of exercise objects. Each exercise object MUST have:
                - "name": "Standard English name of the exercise as a string" (e.g., "Barbell Squat")
                - "sets": Number (e.g., 3) OR a string if it's a range (e.g., "2-3"). **If it's a range or text, it MUST be a JSON string (enclosed in double quotes).**
                - "reps": Number (e.g., 10) OR a string if it's a range or text like "AMRAP" (e.g., "8-12", "AMRAP"). **If it's a range or text, it MUST be a JSON string (enclosed in double quotes).**
                - "rest": "String value for rest time" (e.g., "60s", "60-90s")
            - "coolDown": "String value describing the cool-down."
        If a day is a rest day, "exercises" array can be empty or null, and "focus" can be "Rest Day".
        Tailor the plan considering the user's limitations and fitness goal. Use common exercises.

        User Data:
        - Age: ${userData.age}, Gender: ${userData.gender}, Activity Level: ${userData.activityLevel}
        - Fitness Goal: ${userData.fitnessGoal}, Limitations: ${userData.limitations}
        - (Assume access to standard gym equipment or bodyweight if implied by goal/limitations)
    `;

    try {
        const geminiRequestBody = { contents: [{ parts: [{ text: trainingPrompt }] }] };
        const geminiResponse = await fetch(GEMINI_API_URL_TRAINING, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(geminiRequestBody),
        });

        if (!geminiResponse.ok) {
            const errorText = await geminiResponse.text();
            throw new Error(`Gemini API Error: ${geminiResponse.status} ${errorText}`);
        }
        const geminiData = await geminiResponse.json();
        const planJsonString = extractGeminiText(geminiData);
        const workoutPlan = JSON.parse(planJsonString);

        if (!workoutPlan.weeklySchedule) {
            throw new Error("AI did not return the plan in the expected 'weeklySchedule' format.");
        }

        statusMessage.textContent = "Trainingsplan von AI erhalten. Lade Übungsdetails von ExerciseDB...";
        planContainer.innerHTML = '<div class="text-center"><div class="spinner-border text-success" role="status"><span class="visually-hidden">Loading...</span></div><p>Lade Übungsanimationen...</p></div>';


        const enrichedPlan = await enrichPlanWithExerciseDbData(workoutPlan.weeklySchedule);

        displayWorkoutPlan(enrichedPlan, planContainer);
        statusMessage.textContent = "Trainingsplan erfolgreich geladen!";
        statusMessage.style.color = 'green';

    } catch (error) {
        console.error("Error generating training plan:", error);
        statusMessage.textContent = `Fehler: ${error.message}`;
        statusMessage.style.color = 'red';
        planContainer.innerHTML = `<p class="text-danger text-center">Fehler beim Generieren des Trainingsplans.</p>`;
    } finally {
        submitButton.disabled = false;
    }
}

function extractGeminiText(responseData) {
    if (responseData.candidates && responseData.candidates[0]?.content?.parts?.[0]?.text) {
        let text = responseData.candidates[0].content.parts[0].text;
        return text.replace(/^```(json)?\s*/gmi, '').replace(/\s*```\s*$/gmi, '').trim();
    }
    throw new Error("Unerwartete Antwortstruktur von der AI.");
}

async function enrichPlanWithExerciseDbData(weeklySchedule) {
    const enrichedSchedule = [];
    const allExerciseNames = new Set();
    weeklySchedule.forEach(dayPlan => {
        dayPlan.exercises?.forEach(ex => allExerciseNames.add(ex.name.toLowerCase()));
    });

    console.log("Unique exercise names for ExerciseDB:", Array.from(allExerciseNames));

    const exerciseDbDetailsMap = new Map();
    const exercisePromises = Array.from(allExerciseNames).map(name =>
        fetchExerciseDbDetails(name).then(detail => {
            if (detail) exerciseDbDetailsMap.set(name, detail);
        })
    );
    await Promise.allSettled(exercisePromises);

    for (const dayPlan of weeklySchedule) {
        const enrichedDay = { ...dayPlan, exercises: [] };
        if (dayPlan.exercises && dayPlan.exercises.length > 0) {
            enrichedDay.exercises = dayPlan.exercises.map(exercise => {
                const exerciseDbData = exerciseDbDetailsMap.get(exercise.name.toLowerCase());
                return { ...exercise, exerciseDbData: exerciseDbData || null };
            });
        }
        enrichedSchedule.push(enrichedDay);
    }
    return enrichedSchedule;
}


async function fetchExerciseDbDetails(exerciseName) {
    if (!exerciseName || exerciseName.trim() === "") return null;

    const searchName = exerciseName.toLowerCase().replace(/\s+/g, '%20');
    console.log(`ExerciseDB: Searching for "${exerciseName}" (encoded: ${searchName})`);


    const url = `${EXERCISEDB_BASE_URL}/name/${searchName}`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': EXERCISEDB_RAPIDAPI_KEY,
            'X-RapidAPI-Host': EXERCISEDB_RAPIDAPI_HOST
        }
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {

            if (response.status === 404) {
                 console.warn(`ExerciseDB: No direct match found for "${exerciseName}" (Status 404).`);
                 return null;
            }
            const errorData = await response.json().catch(() => ({ message: response.statusText }));
            console.warn(`ExerciseDB API error for "${exerciseName}": ${response.status}`, errorData.message || errorData);
            return null;
        }
        const data = await response.json();

        if (data && data.length > 0) {
            console.log(`ExerciseDB: Found details for "${exerciseName}"`, data[0]);
            return data[0];
        } else {
            console.warn(`ExerciseDB: No data returned for "${exerciseName}" despite OK status.`);
            return null;
        }
    } catch (error) {
        console.error(`ExerciseDB: Network or parsing error for "${exerciseName}":`, error);
        return null;
    }
}


function displayWorkoutPlan(weeklySchedule, container) {
    if (!weeklySchedule || weeklySchedule.length === 0) {
        container.innerHTML = "<p class='text-center text-muted'>Kein Trainingsplan verfügbar.</p>";
        return;
    }

    let html = `<h3 class="text-center mb-4" data-key="plan-title">Dein Wochenplan</h3>`;
    html += `<div class="accordion" id="workoutAccordion">`;

    weeklySchedule.forEach((dayPlan, index) => {
        const dayId = `day-${index}`;
        html += `
            <div class="accordion-item">
                <h2 class="accordion-header" id="heading-${dayId}">
                    <button class="accordion-button ${index !== 0 ? 'collapsed' : ''}" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${dayId}" aria-expanded="${index === 0}" aria-controls="collapse-${dayId}">
                        <strong>${dayPlan.day || `Tag ${index + 1}`}</strong>: ${dayPlan.focus || 'Allgemeines Training'}
                    </button>
                </h2>
                <div id="collapse-${dayId}" class="accordion-collapse collapse ${index === 0 ? 'show' : ''}" aria-labelledby="heading-${dayId}" data-bs-parent="#workoutAccordion">
                    <div class="accordion-body">
                        ${dayPlan.warmUp ? `<p><strong>Warm-up:</strong> ${dayPlan.warmUp}</p>` : ''}
        `;

        if (dayPlan.exercises && dayPlan.exercises.length > 0) {
            html += `<ul class="list-group list-group-flush">`;
            dayPlan.exercises.forEach(ex => {
                const dbData = ex.exerciseDbData;
                const displayName = dbData?.name || ex.name;
                html += `
                    <li class="list-group-item">
                        <h5>${displayName.charAt(0).toUpperCase() + displayName.slice(1)}</h5>
                        <p><strong>Sätze:</strong> ${ex.sets}, <strong>Wdh.:</strong> ${ex.reps}, <strong>Pause:</strong> ${ex.rest}</p>
                        ${dbData?.target ? `<p><small>Zielmuskel: ${dbData.target.charAt(0).toUpperCase() + dbData.target.slice(1)}</small></p>` : ''}
                        ${dbData?.equipment ? `<p><small>Benötigtes Equipment: ${dbData.equipment.charAt(0).toUpperCase() + dbData.equipment.slice(1)}</small></p>` : ''}
                        ${dbData?.gifUrl ? `
                            <div class="my-2">
                                <img src="${dbData.gifUrl}" alt="Animation für ${displayName}" class="img-fluid rounded" style="max-height: 250px; border: 1px solid #ccc;">
                            </div>
                        ` : ''}
                        <button class="btn btn-sm btn-outline-info watch-tutorial-btn mt-2" data-exercise-name="${displayName}">Zeige Tutorial (YouTube)</button>
                    </li>
                `;
            });
            html += `</ul>`;
        } else if (dayPlan.focus && dayPlan.focus.toLowerCase().includes('rest')) {
            html += `<p>Heute ist Ruhetag. Leichte Aktivität wie Spazierengehen ist empfohlen.</p>`;
        } else {
            html += `<p>Keine spezifischen Übungen für diesen Tag.</p>`;
        }

        html += `
                        ${dayPlan.coolDown ? `<p class="mt-3"><strong>Cool-down:</strong> ${dayPlan.coolDown}</p>` : ''}
                    </div>
                </div>
            </div>
        `;
    });

    html += `</div>`;
    container.innerHTML = html;

    if (typeof applyTranslations === 'function' && typeof currentLanguage === 'string') {
        applyTranslations(currentLanguage);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const trainingForm = document.getElementById(TRAINING_FORM_ID);
    if (trainingForm) {
        const submitButton = trainingForm.querySelector('button[type="button"]');
        if (submitButton) {
            submitButton.addEventListener('click', generateAndDisplayTrainingPlan);
        } else {
            console.error("Submit button not found in training form.");
        }
    } else {
        console.warn("Training form not found on this page.");
    }

    const planContainer = document.getElementById(WORKOUT_PLAN_CONTAINER_ID);
    if (planContainer) {
        planContainer.addEventListener('click', function(event) {
            const button = event.target.closest('.watch-tutorial-btn');
            if (button) {
                const exerciseName = button.dataset.exerciseName;
                if (exerciseName) {
                    const searchQuery = `${exerciseName} exercise tutorial`;
                    const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;
                    window.open(youtubeUrl, '_blank');
                }
            }
        });
    }
});
