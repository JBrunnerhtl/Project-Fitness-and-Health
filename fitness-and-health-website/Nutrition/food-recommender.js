const USDA_API_KEY = "zIUmv0ofmvJ4xDCjk62M6OnZrMmyX9CIA4NMyUAR";
const GEMINI_API_KEY_FOOD = "AIzaSyCmASFgvCtxB2Q1JN6lC-jOHQ0PlCNhXOw";


const USDA_SEARCH_URL = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${USDA_API_KEY}`;
const USDA_DETAILS_URL_BASE = `https://api.nal.usda.gov/fdc/v1/food/`;


const GEMINI_API_URL_FOOD = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY_FOOD}`;



async function fetchAndDisplayFoodData(userData, nutritionData, foodTableContainerId, statusMessageElementId) {
    const statusMessageElement = document.getElementById(statusMessageElementId);
    const foodTableContainer = document.getElementById(foodTableContainerId);


    if (!foodTableContainer) {
        console.error(`Error: Food table container with ID '${foodTableContainerId}' not found.`);
        if (statusMessageElement) {
            statusMessageElement.textContent = `Fehler: Food-Tabellen-Container nicht gefunden.`;
            statusMessageElement.style.color = 'red';
        }
        return;
    }
    if (!statusMessageElement) {
        console.error(`Error: Status message element with ID '${statusMessageElementId}' not found.`);
    }


    foodTableContainer.innerHTML = `<p class="text-center">Suche nach Lebensmittelempfehlungen...</p>`;
    if (statusMessageElement) {
        statusMessageElement.textContent = "Suche nach Lebensmittelempfehlungen...";
        statusMessageElement.style.color = 'black';
    }



    const proteinGrams = (nutritionData.proteinCalories / 4).toFixed(0);
    const fatGrams = (nutritionData.fatCalories / 9).toFixed(0);
    const carbGrams = (nutritionData.carbCalories / 4).toFixed(0);


    const foodPrompt = `
        Based on the following user data and their calculated daily nutritional targets, please recommend **around 20 specific food items** suitable for their diet. Prioritize whole, unprocessed foods where possible. Consider the 'Additional Information/Restrictions'.

        User Data:
        - Weight: ${userData.weight} kg - Height: ${userData.height} cm - Age: ${userData.age} years - Gender: ${userData.gender} - Activity Level: ${userData.activityLevel} - Additional Info: ${userData.additionalInfo}

        Calculated Daily Targets:
        - Total Calories: ${nutritionData.calories.toFixed(0)} kcal - Protein: ${proteinGrams} g - Fat: ${fatGrams} g - Carbohydrates: ${carbGrams} g

        Provide the response ONLY as a simple comma-separated list of food names. Example: Chicken Breast, Broccoli, Quinoa, Salmon, Spinach, Sweet Potato, Almonds, Greek Yogurt, Lentils, Brown Rice, Olive Oil, Blueberries, Walnuts, Eggs, Oats, Bell Pepper, Tomato, Apple, Pear, Carrot
    `;

    try {
        const requestBody = { contents: [{ parts: [{ text: foodPrompt }] }] };
        console.log("Sending request to Gemini API (Food List)...");
        const response = await fetch(GEMINI_API_URL_FOOD, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestBody),
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Gemini API Error (Food List): ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        console.log("Gemini API Success Response (Food List):", data);


        let foodListString = '';
        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
            foodListString = data.candidates[0].content.parts[0].text.trim();
        } else {
            throw new Error("Unerwartete Antwortstruktur von der AI für die Lebensmittelliste.");
        }
        console.log("Extracted food list string:", foodListString);


        const foodNamesArray = foodListString.split(',')
            .map(food => food.trim())
            .filter(food => food.length > 0);

        if (foodNamesArray.length === 0) {
            throw new Error("AI hat keine verwertbaren Lebensmittelempfehlungen zurückgegeben.");
        }

        console.log("Parsed food names array:", foodNamesArray);


        await lookupFoodsInUSDA(foodNamesArray, foodTableContainer, statusMessageElement);

        if (statusMessageElement) {
            statusMessageElement.textContent = "Nährwertplan und Lebensmittelempfehlungen erfolgreich geladen!";
            statusMessageElement.style.color = 'green';
        }

    } catch (error) {
        console.error("Error fetching or processing food recommendations:", error);
        if (statusMessageElement) {
            statusMessageElement.textContent = `Fehler bei Lebensmittelempfehlungen: ${error.message}`;
            statusMessageElement.style.color = 'red';
        }
        foodTableContainer.innerHTML = `<p class="text-center text-danger">Fehler beim Laden der Lebensmittelempfehlungen.</p>`;
    }
}

async function lookupFoodsInUSDA(foodNamesArray, foodTableContainer, statusMessageElement) {
    if (!foodTableContainer) return;

    foodTableContainer.innerHTML = `<p class="text-center">Suche Nährwertdaten für ${foodNamesArray.length} Lebensmittel...</p>`;
    if (statusMessageElement) {
        statusMessageElement.textContent = "Suche Nährwertdaten in USDA Datenbank...";
        statusMessageElement.style.color = 'black';
    }


    const lookupPromises = foodNamesArray.map(foodName => searchAndGetUSDADetails(foodName));


    const results = await Promise.allSettled(lookupPromises);
    console.log("USDA Lookup Results (Promise.allSettled):", results);


    const usdaDataArray = results
        .filter(result => result.status === 'fulfilled' && result.value)
        .map(result => result.value);


    displayFoodTable(usdaDataArray, foodNamesArray.length, foodTableContainer);
}


async function searchAndGetUSDADetails(foodName) {
    console.log(`Searching USDA for: ${foodName}`);
    const searchBody = { query: foodName, pageSize: 1, dataType: ["Foundation", "SR Legacy"] };

    try {

        const searchResponse = await fetch(USDA_SEARCH_URL, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(searchBody),
        });
        if (!searchResponse.ok) {
            const errorText = await searchResponse.text();
            throw new Error(`USDA Search API Error for "${foodName}": ${searchResponse.status} ${searchResponse.statusText} - ${errorText}`);
        }
        const searchData = await searchResponse.json();

        if (!searchData.foods || searchData.foods.length === 0 || !searchData.foods[0].fdcId) {
            console.warn(`No suitable USDA match found for: ${foodName}`);
            return null;
        }
        const fdcId = searchData.foods[0].fdcId;
        const bestMatchName = searchData.foods[0].description;
        console.log(`Found USDA match for "${foodName}": ${bestMatchName} (fdcId: ${fdcId})`);


        const detailsUrl = `${USDA_DETAILS_URL_BASE}${fdcId}?api_key=${USDA_API_KEY}`;
        const detailsResponse = await fetch(detailsUrl);
        if (!detailsResponse.ok) {
            const errorText = await detailsResponse.text();
            throw new Error(`USDA Details API Error for fdcId ${fdcId}: ${detailsResponse.status} ${detailsResponse.statusText} - ${errorText}`);
        }
        const detailsData = await detailsResponse.json();


        const nutrients = detailsData.foodNutrients;
        const findNutrient = (nutrientId) => nutrients.find(n => n.nutrient.id === nutrientId)?.amount ?? 'N/A';
        const findNutrientByName = (namePart) => nutrients.find(n => n.nutrient.name.toLowerCase().includes(namePart.toLowerCase()))?.amount ?? 'N/A';

        let calories = findNutrient(1008);
        if (calories === 'N/A') calories = findNutrientByName('energy');
        if (calories === 'N/A' && findNutrient(1062) !== 'N/A') {
            calories = (findNutrient(1062) / 4.184).toFixed(0);
        }

        const protein = findNutrient(1003);
        const fat = findNutrient(1004);
        const carbs = findNutrient(1005);

        return {
            originalName: foodName,
            usdaName: bestMatchName,
            calories: calories,
            protein: protein,
            fat: fat,
            carbs: carbs,
        };

    } catch (error) {
        console.error(`Error during USDA lookup for "${foodName}":`, error);
        throw error;
    }
}


function displayFoodTable(usdaDataArray, totalRequested, foodTableContainer) {
    if (!foodTableContainer) {
        console.error("DisplayFoodTable Error: Container element not provided.");
        return;
    }

    if (!usdaDataArray || usdaDataArray.length === 0) {
        foodTableContainer.innerHTML = `<p class="text-center text-muted">Keine Nährwertdaten für empfohlene Lebensmittel gefunden.</p>`;
        return;
    }


    let tableHTML = `
        <div class="row">
            <div class="col-12">
                <div class="card shadow">
                    <div class="card-body bg-dark text-light"> 
                        <h5 class="card-title text-center mb-4" style="color: #ffffff;">Empfohlene Lebensmittel (Nährwerte pro 100g)</h5>
                        <p class="text-center text-white-50 small">Es konnten Daten für ${usdaDataArray.length} von ${totalRequested} Empfehlungen gefunden werden. Ergebnisse basieren auf der besten Übereinstimmung in der USDA-Datenbank.</p>
                        <div class="table-responsive">
                            <table class="table table-dark table-striped table-hover m-0 w-100"> 
                                <thead class="thead-light"> 
                                    <tr>
                                        <th>Empfehlung (AI)</th>
                                        <th>USDA Eintrag</th>
                                        <th>Kalorien (kcal)</th>
                                        <th>Protein (g)</th>
                                        <th>Fett (g)</th>
                                        <th>Kohlenhydrate (g)</th>
                                    </tr>
                                </thead>
                                <tbody>
    `;

    usdaDataArray.forEach(food => {
        tableHTML += `
            <tr>
                <td>${food.originalName}</td>
                <td>${food.usdaName}</td>
                <td>${food.calories !== 'N/A' ? Number(food.calories).toFixed(0) : 'N/A'}</td>
                <td>${food.protein !== 'N/A' ? Number(food.protein).toFixed(1) : 'N/A'}</td>
                <td>${food.fat !== 'N/A' ? Number(food.fat).toFixed(1) : 'N/A'}</td>
                <td>${food.carbs !== 'N/A' ? Number(food.carbs).toFixed(1) : 'N/A'}</td>
            </tr>
        `;
    });

    tableHTML += `
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    foodTableContainer.innerHTML = tableHTML;

    const originalFoodNames = usdaDataArray.map(food => food.originalName);


    if (typeof storeRecommendedFoodsAndShowButton === 'function') {
        storeRecommendedFoodsAndShowButton(originalFoodNames);
    } else {
        console.error("storeRecommendedFoodsAndShowButton function from dishes.js not found.");
    }
}
