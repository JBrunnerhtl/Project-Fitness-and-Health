const GEMINI_API_KEY = "AIzaSyCmASFgvCtxB2Q1JN6lC-jOHQ0PlCNhXOw"; // Replace with your actual key!
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

// Function to handle the form submission and AI call
async function getNutritionPlanFromAI() {
    console.log("getNutritionPlanFromAI called");

    const submitButton = document.getElementById('submitBtn');
    const statusMessage = document.getElementById('statusMessage');

    // 1. Validate Form Input using the function from Calculator.js
    if (!validateNutritionForm()) {
        statusMessage.textContent = "Bitte korrigieren Sie die markierten Felder.";
        statusMessage.style.color = 'red';
        document.getElementById('writeTable').innerHTML = ''; // Clear previous results if any
        // No need to clear foodTableForProteins anymore
        return; // Stop if validation fails
    }

    // 2. Disable button and show loading state
    submitButton.disabled = true;
    statusMessage.textContent = "Berechne Nährwertplan...";
    statusMessage.style.color = 'black';
    document.getElementById('writeTable').innerHTML = ''; // Clear previous table
    // No need to clear foodTableForProteins anymore


    // 3. Gather form data
    const weight = document.getElementById('weight').value;
    const height = document.getElementById('height').value;
    const age = document.getElementById('age').value;
    const gender = document.getElementById('gender').value;
    const activityLevel = document.getElementById('activity-level').value;
    const additionalInfo = document.getElementById('additional-info').value || 'Keine'; // Get additional info or default

    // 4. Construct the prompt for Gemini AI
    const prompt = `
        Act as a nutritionist. Based on the following user data, calculate the estimated daily caloric needs and a recommended macronutrient breakdown (protein, fat, carbohydrates, fiber) in calories.

        User Data:
        - Weight: ${weight} kg
        - Height: ${height} cm
        - Age: ${age} years
        - Gender: ${gender}
        - Activity Level: ${activityLevel} (low, moderate, or high)
        - Additional Information/Restrictions: ${additionalInfo}

        Please provide the response ONLY in JSON format, with the following structure:
        {
          "calories": number, // total daily calories
          "proteinCalories": number, // calories from protein (aim for ~30% total, adjust based on info)
          "fatCalories": number, // calories from fat (aim for ~25% total, adjust based on info)
          "carbCalories": number, // calories from carbohydrates (aim for ~40% total, adjust based on info)
          "fiberCalories": number // calories from fiber (aim for ~5% total, adjust based on info)
        }

        Ensure the sum of protein, fat, carb, and fiber calories approximately equals the total calories. Use the Mifflin-St Jeor equation as a base for Basal Metabolic Rate (BMR) and apply an activity multiplier (low: 1.2, moderate: 1.55, high: 1.725), but adjust the final numbers and distribution based on all provided information, especially the 'Additional Information'. Be realistic and provide integer values for the calories.
    `;

    // 5. Prepare the request body for Gemini API
    const requestBody = {
        contents: [{
            parts: [{
                text: prompt
            }]
        }],
        // Optional: Add safety settings if needed
        // safetySettings: [ ... ],
        // Optional: Add generation config if needed
        // generationConfig: { temperature: 0.7, ... }
    };

    // 6. Make the API Call
    try {
        console.log("Sending request to Gemini API...");
        const response = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        console.log("Received response status:", response.status);

        if (!response.ok) {
            let errorDetails = `HTTP error! status: ${response.status}`;
            try {
                const errorData = await response.json();
                console.error("Gemini API Error Response:", errorData);
                errorDetails = `API Error: ${errorData.error?.message || response.statusText}`;
            } catch (e) {
                console.error("Could not parse error response body:", e);
                errorDetails = `HTTP error ${response.status}. Could not parse error response.`;
            }
            throw new Error(errorDetails);
        }

        const data = await response.json();
        console.log("Gemini API Success Response:", data);

        // 7. Extract and parse the JSON response from Gemini
        let nutritionJsonString = '';
        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
            nutritionJsonString = data.candidates[0].content.parts[0].text;
            nutritionJsonString = nutritionJsonString.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else {
            throw new Error("Unexpected response structure from Gemini API.");
        }

        console.log("Extracted text from AI:", nutritionJsonString);

        let nutritionData;
        try {
            nutritionData = JSON.parse(nutritionJsonString);
            console.log("Parsed Nutrition Data:", nutritionData);
        } catch (parseError) {
            console.error("Failed to parse JSON response from AI:", parseError, "\nRaw string:", nutritionJsonString);
            throw new Error("AI returned data in an unexpected format. Could not parse nutrition plan.");
        }

        // 8. Call loadTable (from Loader.js) with the parsed data
        loadTable(nutritionData);
        statusMessage.textContent = "Nährwertplan erfolgreich erstellt!";
        statusMessage.style.color = 'green';

        // 9. **** REMOVED SPOONACULAR CALL ****
        // const proteinGrams = nutritionData.proteinCalories ? (nutritionData.proteinCalories / 4).toFixed(0) : (weight * 1.6);
        // getRecipesForNutrient('protein', proteinGrams); // <-- This line is removed/commented out


    } catch (error) {
        console.error("Error fetching or processing nutrition plan:", error);
        statusMessage.textContent = `Fehler: ${error.message}`;
        statusMessage.style.color = 'red';
        document.getElementById('writeTable').innerHTML = '';

    } finally {
        // 10. Re-enable the button regardless of success or failure
        submitButton.disabled = false;
        console.log("getNutritionPlanFromAI finished.");
    }
}


