
const apiKey = "824f5b8c655b400a99d93a9f4e841ed0"; // Ersetze dies mit deinem echten API-Schlüssel
const query = 50; // Suchbegriff für das Rezept
const header = "recipes";

async function getRecipes() {
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

getRecipes();