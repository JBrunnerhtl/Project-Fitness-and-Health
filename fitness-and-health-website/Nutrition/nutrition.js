const GEMINI_API_KEY = "AIzaSyCmASFgvCtxB2Q1JN6lC-jOHQ0PlCNhXOw";

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;


const MACRO_TABLE_CONTAINER_ID = 'writeTable';
const FOOD_TABLE_CONTAINER_ID = 'foodRecomTableContainer';
const STATUS_MESSAGE_ID = 'statusMessage';
const SUBMIT_BUTTON_ID = 'submitBtn';



async function getNutritionPlanFromAI() {
    console.log("getNutritionPlanFromAI called");

    const submitButton = document.getElementById(SUBMIT_BUTTON_ID);
    const statusMessage = document.getElementById(STATUS_MESSAGE_ID);
    const resultsTableContainer = document.getElementById(MACRO_TABLE_CONTAINER_ID);
    const foodTableContainer = document.getElementById(FOOD_TABLE_CONTAINER_ID);


    if (!submitButton || !statusMessage || !resultsTableContainer || !foodTableContainer) {
        console.error("Initialization Error: One or more required HTML elements not found (submitBtn, statusMessage, writeTable, foodRecomTableContainer).");
        alert("Ein Fehler ist aufgetreten. Wichtige Seitenelemente fehlen.");
        return;
    }


    resultsTableContainer.innerHTML = '';
    foodTableContainer.innerHTML = '';


    if (!validateNutritionForm()) {
        statusMessage.textContent = "Bitte korrigieren Sie die markierten Felder.";
        statusMessage.style.color = 'red';
        return;
    }


    submitButton.disabled = true;
    statusMessage.textContent = "Berechne Nährwertplan...";
    statusMessage.style.color = 'black';


    const userData = {
        weight: document.getElementById('weight').value,
        height: document.getElementById('height').value,
        age: document.getElementById('age').value,
        gender: document.getElementById('gender').value,
        activityLevel: document.getElementById('activity-level').value,
        additionalInfo: document.getElementById('additional-info').value || 'Keine'
    };


    const macroPrompt = `
    Act as a nutritionist. Based on the following user data, calculate the estimated daily caloric needs and a recommended macronutrient breakdown (protein, fat, carbohydrates, fiber) in calories.

    User Data:
    - Weight: ${userData.weight} kg
    - Height: ${userData.height} cm
    - Age: ${userData.age} years
    - Gender: ${userData.gender}
    - Activity Level: ${userData.activityLevel}
    - Additional Information/Restrictions: ${userData.additionalInfo}

    Please provide the response ONLY in JSON format, with the following structure:
    {
      "calories": number, // total daily calories
      "proteinCalories": number, // calories from protein (aim for ~30% total, adjust based on info)
      "fatCalories": number, // calories from fat (aim for ~25% total, adjust based on info)
      "carbCalories": number, // calories from carbohydrates (aim for ~40% total, adjust based on info)
      "fiberCalories": number // calories from fiber (aim for ~5% total, adjust based on info) <<<--- Explicitly requested here
    }

    Ensure the sum of protein, fat, carb, and fiber calories approximately equals the total calories. Use the Mifflin-St Jeor equation as a base for Basal Metabolic Rate (BMR) and apply an activity multiplier (low: 1.2, moderate: 1.55, high: 1.725), but adjust the final numbers and distribution based on all provided information, especially the 'Additional Information'. Be realistic and provide integer values for the calories.
`;


    try {
        const requestBody = { contents: [{ parts: [{ text: macroPrompt }] }] };
        console.log("Sending FIRST request to Gemini API (Macros)...");
        const response = await fetch(GEMINI_API_URL, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestBody),
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Gemini API Error (Macros): ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        console.log("Gemini API Success Response (Macros):", data);


        let nutritionJsonString = extractGeminiText(data);
        console.log("Attempting to parse Macro JSON:", "'" + nutritionJsonString + "'");
        const nutritionData = JSON.parse(nutritionJsonString);
        console.log("Parsed Macro Data Object:", nutritionData);

        loadTable(nutritionData);
        statusMessage.textContent = "Nährwertplan erstellt. Suche nach Lebensmittelempfehlungen...";


        if (typeof fetchAndDisplayFoodData === 'function') {
            await fetchAndDisplayFoodData(userData, nutritionData, FOOD_TABLE_CONTAINER_ID, STATUS_MESSAGE_ID);
        } else {
            console.error("Error: function fetchAndDisplayFoodData not found. Make sure food-recommender.js is loaded correctly before nutrition.js.");
            statusMessage.textContent = "Fehler: Lebensmittelempfehlungs-Funktion nicht geladen.";
            statusMessage.style.color = 'red';
        }


    } catch (error) {
        console.error("Error during Macro Calculation or triggering Food Rec:", error);
        statusMessage.textContent = `Fehler: ${error.message}`;
        statusMessage.style.color = 'red';
        resultsTableContainer.innerHTML = '';
        foodTableContainer.innerHTML = '';
    } finally {

        submitButton.disabled = false;
        console.log("getNutritionPlanFromAI finished.");
    }
}

function extractGeminiText(responseData) {
    if (responseData.candidates && responseData.candidates[0]?.content?.parts?.[0]?.text) {
        let text = responseData.candidates[0].content.parts[0].text;
        return text.replace(/^```(json)?\s*/gmi, '').replace(/\s*```\s*$/gmi, '').trim();
    } else {
        console.error("Unexpected Gemini response structure:", responseData);
        throw new Error("Unerwartete Antwortstruktur von der AI erhalten.");
    }
}
