
const SPOONACULAR_API_KEY = "94c4023aedc643b78c35b427c91a36f7";
const SPOONACULAR_RECIPE_BY_INGREDIENTS_URL = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${SPOONACULAR_API_KEY}`;

let recommendedFoodNamesForRecipes = [];


function storeRecommendedFoodsAndShowButton(foodNames) {
    recommendedFoodNamesForRecipes = foodNames.map(name => name.toLowerCase().trim())
        .filter(name => name.length > 2);

    const recipeButtonContainer = document.getElementById('recipeButtonContainer');
    const recipeResultsContainer = document.getElementById('recipeResultsContainer');

    if (!recipeButtonContainer || !recipeResultsContainer) {
        console.error("Recipe button or results container not found.");
        return;
    }

    recipeResultsContainer.innerHTML = '';
    recipeButtonContainer.innerHTML = '';

    if (recommendedFoodNamesForRecipes.length > 0) {
        const makeDishesButton = document.createElement('button');
        makeDishesButton.textContent = "Gerichte vorschlagen";
        makeDishesButton.className = "btn btn-lg btn-success";
        makeDishesButton.id = "makeDishesBtn";
        makeDishesButton.addEventListener('click', fetchRecipesFromSpoonacular);

        recipeButtonContainer.appendChild(makeDishesButton);
        recipeButtonContainer.style.display = 'block';
    } else {
        recipeButtonContainer.style.display = 'none';
    }
}

async function fetchRecipesFromSpoonacular() {
    const recipeResultsContainer = document.getElementById('recipeResultsContainer');
    const makeDishesButton = document.getElementById('makeDishesBtn');

    if (!recipeResultsContainer || !makeDishesButton) return;

    if (recommendedFoodNamesForRecipes.length === 0) {
        recipeResultsContainer.innerHTML = "<p class='text-center text-muted'>Keine Zutaten für Rezeptsuche vorhanden.</p>";
        return;
    }

    makeDishesButton.disabled = true;
    makeDishesButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Lade Rezepte...';
    recipeResultsContainer.innerHTML = '<div class="text-center"><div class="spinner-border text-info" role="status"><span class="visually-hidden">Loading...</span></div><p>Suche nach passenden Rezepten...</p></div>';


    const ingredientsForQuery = recommendedFoodNamesForRecipes.slice(0, 5).join(',');
    const numberOfRecipes = 9;

    const url = `${SPOONACULAR_RECIPE_BY_INGREDIENTS_URL}&ingredients=${encodeURIComponent(ingredientsForQuery)}&number=${numberOfRecipes}&ranking=1&ignorePantry=true`;


    console.log("Spoonacular Request URL:", url);

    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(`Spoonacular API Error: ${response.status} ${response.statusText} - ${errorData ? errorData.message : 'Failed to fetch'}`);
        }
        const recipes = await response.json();
        console.log("Spoonacular Recipes Found:", recipes);
        displayRecipes(recipes, recipeResultsContainer);

    } catch (error) {
        console.error("Error fetching recipes from Spoonacular:", error);
        recipeResultsContainer.innerHTML = `<p class="text-danger text-center">Fehler beim Laden der Rezepte: ${error.message}</p>`;
    } finally {
        makeDishesButton.disabled = false;
        makeDishesButton.textContent = "Gerichte vorschlagen";
    }
}

function displayRecipes(recipes, container) {
    container.innerHTML = '';

    if (!recipes || recipes.length === 0) {
        container.innerHTML = "<p class='text-center text-muted'>Keine passenden Rezepte für die ausgewählten Zutaten gefunden.</p>";
        return;
    }

    let html = `<h3 class="text-center mb-4" data-key="recipe-section-title">Rezeptvorschläge</h3>`;
    html += `<div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">`;

    recipes.forEach(recipe => {
        html += `
            <div class="col">
                <div class="card h-100 recipe-card">
                    <img src="${recipe.image}" class="card-img-top" alt="${recipe.title}" style="object-fit: cover; height: 200px;">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${recipe.title}</h5>
                        ${recipe.usedIngredientCount > 0 ? `<p class="card-text text-muted small">Verwendet ${recipe.usedIngredientCount} Ihrer empfohlenen Zutaten.</p>` : ''}
                        ${recipe.missedIngredientCount > 0 ? `<p class="card-text text-warning small">Benötigt ${recipe.missedIngredientCount} weitere Zutat(en).</p>` : ''}
                        <a href="https://spoonacular.com/recipes/${recipe.title.toLowerCase().replace(/\s+/g, '-')}-${recipe.id}" target="_blank" class="btn btn-primary mt-auto align-self-start">Rezept ansehen</a>
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

