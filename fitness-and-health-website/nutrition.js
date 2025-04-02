
const apiKey = ""; // Ersetze dies mit deinem echten API-Schlüssel
const query = 50; // Suchbegriff für das Rezept
const header = "recipes";

async function getRecipesForProtein() {
    const url = `https://api.spoonacular.com/${header}/complexSearch?maxProtein=${query}&apiKey=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Fehler: ${response.status}`);
        }
        const data = await response.json();
        console.log(data); // Rezepte ausgeben
    } catch (error) {
        console.error("API-Fehler:", error);
    }
}

async function getRecipesForCarbs() {

}
async function getRecipesForFat() {

}



